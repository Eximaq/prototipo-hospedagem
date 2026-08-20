import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseEnv } from "node:util";

export async function loadPrivateEnvFile(filePath = path.resolve(".env.local")) {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw new Error("Não foi possível ler o arquivo privado de ambiente.");
  }

  const values = parseEnv(content);
  for (const [key, value] of Object.entries(values)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return true;
}
