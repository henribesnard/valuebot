import { NextRequest, NextResponse } from "next/server";
import { createToken, findUserByEmail, publicUser, verifyPassword } from "../../_lib/local-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) {
    return NextResponse.json({ detail: "Email et mot de passe requis" }, { status: 400 });
  }
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ detail: "Email ou mot de passe incorrect" }, { status: 401 });
  }
  return NextResponse.json({
    access_token: createToken(user.id, "access"),
    refresh_token: createToken(user.id, "refresh"),
    token_type: "bearer",
    user: publicUser(user),
  });
}
