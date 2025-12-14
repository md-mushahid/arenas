import { getUserByUid } from "@/lib/globalFunctions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { uid } = await req.json();

  if (!uid) return NextResponse.json({ user: null }, { status: 400 });

  const user = await getUserByUid(uid);

  return NextResponse.json({ user });
}
