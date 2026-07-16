import path from "path";

export function projectRoot(): string {
  if (process.env.VALUEBOT_ROOT) return process.env.VALUEBOT_ROOT;
  const cwd = process.cwd();
  if (cwd.endsWith(path.join(".next", "standalone"))) {
    return path.resolve(cwd, "..", "..");
  }
  return cwd;
}

export function dataPath(...parts: string[]): string {
  return path.join(projectRoot(), "data", ...parts);
}
