import { NextRequest, NextResponse } from "next/server";
import { createToken, findUserByEmail, publicUser, upsertUser } from "../../_lib/local-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const firstName = body.first_name ? String(body.first_name) : null;
  const acceptAge = Boolean(body.accept_age);
  if (!acceptAge) {
    return NextResponse.json({ detail: "Vous devez certifier avoir 18 ans ou plus" }, { status: 400 });
  }
  if (!email || password.length < 8) {
    return NextResponse.json({ detail: "Email valide et mot de passe de 8 caractères minimum requis" }, { status: 400 });
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ detail: "Un compte existe déjà avec cet email" }, { status: 409 });
  }
  const user = await upsertUser({ email, password, first_name: firstName, plan: "decouverte", is_email_verified: true });
  return NextResponse.json({
    access_token: createToken(user.id, "access"),
    refresh_token: createToken(user.id, "refresh"),
    token_type: "bearer",
    user: publicUser(user),
  }, { status: 201 });
}
