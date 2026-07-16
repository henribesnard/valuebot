import crypto from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dataPath } from "./paths";

export interface LocalUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  plan: string;
  is_email_verified: boolean;
  role?: "user" | "admin";
  created_at: string;
}

interface Store {
  users: LocalUser[];
}

const AUTH_DIR = dataPath("auth");
const AUTH_PATH = dataPath("auth", "users.json");
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

function secret(): string {
  return process.env.JWT_SECRET_KEY || process.env.NEXTAUTH_SECRET || "valuebot-local-dev-secret-change-me";
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

async function loadStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(AUTH_PATH, "utf8"));
  } catch {
    return { users: [] };
  }
}

async function saveStore(store: Store): Promise<void> {
  await mkdir(AUTH_DIR, { recursive: true });
  await writeFile(AUTH_PATH, JSON.stringify(store, null, 2) + "\n", "utf8");
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  const hash = crypto.pbkdf2Sync(password, salt, 210_000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$210000$${salt}$${hash}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [scheme, roundsRaw, salt, expected] = encoded.split("$");
  if (scheme !== "pbkdf2_sha256" || !roundsRaw || !salt || !expected) return false;
  const actual = crypto.pbkdf2Sync(password, salt, Number(roundsRaw), 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

export function publicUser(user: LocalUser) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    plan: user.plan,
    role: user.role ?? "user",
    is_email_verified: user.is_email_verified,
  };
}

export async function findUserByEmail(email: string): Promise<LocalUser | null> {
  const store = await loadStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id: string): Promise<LocalUser | null> {
  const store = await loadStore();
  return store.users.find((u) => u.id === id) || null;
}

export async function upsertUser(input: {
  email: string;
  password: string;
  first_name?: string | null;
  last_name?: string | null;
  plan?: string;
  is_email_verified?: boolean;
  role?: "user" | "admin";
}): Promise<LocalUser> {
  const store = await loadStore();
  const existing = store.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  const now = new Date().toISOString();
  if (existing) {
    existing.password_hash = hashPassword(input.password);
    existing.first_name = input.first_name ?? existing.first_name;
    existing.last_name = input.last_name ?? existing.last_name;
    existing.plan = input.plan ?? existing.plan;
    existing.is_email_verified = input.is_email_verified ?? existing.is_email_verified;
    existing.role = input.role ?? existing.role;
    await saveStore(store);
    return existing;
  }
  const user: LocalUser = {
    id: crypto.randomUUID(),
    email: input.email.toLowerCase(),
    password_hash: hashPassword(input.password),
    first_name: input.first_name ?? null,
    last_name: input.last_name ?? null,
    plan: input.plan ?? "decouverte",
    is_email_verified: input.is_email_verified ?? true,
    role: input.role ?? "user",
    created_at: now,
  };
  store.users.push(user);
  await saveStore(store);
  return user;
}

export function createToken(userId: string, type: "access" | "refresh" = "access"): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: userId,
    type,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.createHmac("sha256", secret()).update(unsigned).digest("base64url");
  return `${unsigned}.${sig}`;
}

export function verifyToken(token: string): { sub: string; type: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;
  const expected = crypto.createHmac("sha256", secret()).update(`${h}.${p}`).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return { sub: payload.sub, type: payload.type };
}

export async function userFromAuthorization(authHeader: string | null): Promise<LocalUser | null> {
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return findUserById(payload.sub);
}
