import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const pagePayloadFile = "__PAGE__.txt";

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function ensureGitHubPagesAssetSupport() {
  const noJekyllPath = path.join(outDir, ".nojekyll");
  if (!existsSync(noJekyllPath)) return 0;
  return statSync(noJekyllPath).isFile() ? 1 : 0;
}

function createRscPayloadAliases() {
  let count = 0;

  for (const filePath of walk(outDir)) {
    const relativeParts = path.relative(outDir, filePath).split(path.sep);
    if (relativeParts.at(-1) !== pagePayloadFile) continue;

    const nextPartIndex = relativeParts.findIndex((part) => part.startsWith("__next."));
    if (nextPartIndex < 0) continue;

    const routeParts = relativeParts.slice(0, nextPartIndex);
    const payloadParts = relativeParts.slice(nextPartIndex);
    const flattenedPayload = payloadParts.join(".");
    const aliasPath = path.join(outDir, ...routeParts, flattenedPayload);

    if (aliasPath === filePath || existsSync(aliasPath)) continue;

    mkdirSync(path.dirname(aliasPath), { recursive: true });
    copyFileSync(filePath, aliasPath);
    count += 1;
  }

  return count;
}

if (!existsSync(outDir)) {
  throw new Error("Static export folder not found: out/");
}

const aliases = createRscPayloadAliases();
const noJekyll = ensureGitHubPagesAssetSupport();

console.log(
  `Static export prepared: ${aliases} RSC payload aliases, .nojekyll ${noJekyll ? "present" : "missing"}.`,
);
