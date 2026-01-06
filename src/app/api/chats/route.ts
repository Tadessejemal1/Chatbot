import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.chatSession.findMany({
    where: {
      participants: {
        some: { userId: auth.userId },
      },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, imageUrl: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const payload = sessions.map((s) => {
    const other = s.participants
      .map((p) => p.user)
      .find((u) => u.id !== auth.userId) ?? null;

    return {
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt,
      otherUser: other,
      lastMessage: s.messages[0]?.content ?? null,
      lastRole: s.messages[0]?.role ?? null,
    };
  });

  return NextResponse.json({ chats: payload });
}
