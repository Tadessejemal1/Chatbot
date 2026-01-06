import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    where: { id: { not: auth.userId } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, imageUrl: true },
  });

  return NextResponse.json({ users });
}
