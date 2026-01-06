import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Deprecated. Use /api/chats" },
    { status: 410 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Deprecated. Use /api/chats/with/:userId" },
    { status: 410 },
  );
}
