/* eslint-disable @typescript-eslint/no-require-imports */

const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { jwtVerify } = require("jose");

const AUTH_COOKIE = "shipper_auth";

function parseCookies(cookieHeader = "") {
  const out = {};
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rest] = part.split("=");
    const key = rawKey?.trim();
    if (!key) continue;
    const value = rest.join("=").trim();
    if (!value) continue;
    out[key] = decodeURIComponent(value);
  }
  return out;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

async function getUserIdFromCookieHeader(cookieHeader) {
  const cookies = parseCookies(cookieHeader);
  const token = cookies[AUTH_COOKIE];
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const userId = payload.userId;
    return typeof userId === "string" ? userId : null;
  } catch {
    return null;
  }
}

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const onlineCounts = new Map();

function listOnlineUserIds() {
  const ids = [];
  for (const [userId, count] of onlineCounts.entries()) {
    if (count > 0) ids.push(userId);
  }
  return ids;
}

function markOnline(io, userId) {
  const prev = onlineCounts.get(userId) || 0;
  onlineCounts.set(userId, prev + 1);
  if (prev === 0) {
    io.emit("presence:update", { userId, online: true });
  }
}

function markOffline(io, userId) {
  const prev = onlineCounts.get(userId) || 0;
  const nextCount = Math.max(0, prev - 1);
  if (nextCount === 0) onlineCounts.delete(userId);
  else onlineCounts.set(userId, nextCount);

  if (prev > 0 && nextCount === 0) {
    io.emit("presence:update", { userId, online: false });
  }
}

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => handle(req, res));

    const io = new Server(server, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    io.on("connection", async (socket) => {
      const userId = await getUserIdFromCookieHeader(socket.handshake.headers.cookie);
      if (!userId) {
        socket.disconnect(true);
        return;
      }

      socket.data.userId = userId;
      markOnline(io, userId);

      socket.emit("presence:state", { onlineUserIds: listOnlineUserIds() });

      socket.on("disconnect", () => {
        const uid = socket.data.userId;
        if (typeof uid === "string") markOffline(io, uid);
      });
    });

    server.listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
