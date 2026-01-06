import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBotReply } from "@/lib/bot";
import { getAuth } from "@/lib/auth";

export async function GET(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { sessionId } = await ctx.params;

  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      participants: { some: { userId: auth.userId } },
    },
    select: { id: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, createdAt: true, senderId: true },
  });

  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { sessionId } = await ctx.params;

  const body = (await req.json().catch(() => null)) as null | { content?: unknown };
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "content is required" }, { status: 400 });

  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      participants: { some: { userId: auth.userId } },
    },
    select: { id: true, title: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userMessage = await prisma.message.create({
    data: {
      sessionId,
      role: "USER",
      content,
      senderId: auth.userId,
    },
    select: { id: true, role: true, content: true, createdAt: true, senderId: true },
  });

  const newTitle = session.title === "New message" ? content.slice(0, 40) : null;
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: {
      ...(newTitle ? { title: newTitle } : {}),
      updatedAt: new Date(),
    },
  });

  const assistantText = generateBotReply(content);
  const assistantMessage = await prisma.message.create({
    data: {
      sessionId,
      role: "ASSISTANT",
      content: assistantText,
    },
    select: { id: true, role: true, content: true, createdAt: true, senderId: true },
  });

  return NextResponse.json({ messages: [userMessage, assistantMessage] });
}
