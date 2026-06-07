import { NextResponse } from "next/server";
import { setAdminSession, validateAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password || !validateAdminPassword(body.password)) {
    return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
