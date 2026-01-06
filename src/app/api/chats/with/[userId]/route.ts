import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> },
) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await ctx.params;
  if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
  if (userId === auth.userId) {
    return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });
  }

  const other = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, imageUrl: true },
  });
  if (!other) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await prisma.chatSession.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: auth.userId } } },
        { participants: { some: { userId } } },
      ],
    },
    select: { id: true, title: true, updatedAt: true },
  });

  if (existing) {
    return NextResponse.json({ chat: { ...existing, otherUser: other } });
  }

  const created = await prisma.chatSession.create({
    data: {
      title: other.name,
      participants: {
        create: [{ userId: auth.userId }, { userId }],
      },
    },
    select: { id: true, title: true, updatedAt: true },
  });

  return NextResponse.json({ chat: { ...created, otherUser: other } });
}
