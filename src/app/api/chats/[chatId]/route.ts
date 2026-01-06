import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ chatId: string }> },
) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = await ctx.params;
  if (!chatId) return NextResponse.json({ error: "chatId is required" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as null | { title?: unknown };
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (title.length > 80) return NextResponse.json({ error: "title is too long" }, { status: 400 });

  const isParticipant = await prisma.chatParticipant.findFirst({
    where: { sessionId: chatId, userId: auth.userId },
    select: { id: true },
  });

  if (!isParticipant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.chatSession.update({
    where: { id: chatId },
    data: { title },
    select: { id: true, title: true, updatedAt: true },
  });

  return NextResponse.json({ chat: updated });
}
