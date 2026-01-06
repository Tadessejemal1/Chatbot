# Shipper Chatbot (MVP)

Next.js (App Router) chat UI + Prisma/PostgreSQL persistence for:
- Users (anonymous cookie)
- Chat sessions
- Chat messages

## Prereqs

- Node.js + npm
- Docker + Docker Compose

## Local setup

```bash
cd "/home/entro/Desktop/SHIPPER CHATBOT/shipper-chatbot"

# 1) Start Postgres
docker compose up -d

# 2) Install deps (generates Prisma Client via postinstall)
npm install

# 3) Apply migrations
npx prisma migrate dev

# 4) Run the app
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Postgres is exposed on host port `5433` (see `docker-compose.yml`).
- Chat history is stored in Postgres; refresh and sessions/messages remain.

## Key paths

- UI: `src/app/page.tsx`
- Prisma schema: `prisma/schema.prisma`
- API:
	- `src/app/api/sessions/route.ts`
	- `src/app/api/sessions/[sessionId]/messages/route.ts`
# Chatbot
