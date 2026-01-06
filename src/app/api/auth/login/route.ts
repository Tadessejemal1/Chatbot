import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE, signAuthToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as null | {
    name?: unknown;
    imageUrl?: unknown;
  };

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const rawImageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
  const imageUrl = rawImageUrl ? rawImageUrl : null;

  const existing = await prisma.user.findFirst({
    where: { name },
    select: { id: true, name: true, imageUrl: true },
  });

  const user =
    existing ??
    (await prisma.user.create({
      data: {
        name,
        imageUrl,
      },
      select: { id: true, name: true, imageUrl: true },
    }));

  const jwt = await signAuthToken({ userId: user.id, name: user.name, imageUrl: user.imageUrl });
  const res = NextResponse.json({ user });
  res.cookies.set(AUTH_COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
