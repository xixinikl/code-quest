import { access, readFile } from "node:fs/promises";

const manifestPath = new URL("../dist/.vite/manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const appEntry = Object.entries(manifest).find(([, chunk]) => chunk.isEntry);
const teachingBridgeKey = "src/TeachingBridge.tsx";
const teachingBridgeChunk = manifest[teachingBridgeKey];

if (!appEntry) {
  throw new Error("Bundle check failed: the application entry is missing.");
}

if (!teachingBridgeChunk?.isDynamicEntry) {
  throw new Error(
    "Bundle check failed: TeachingBridge must be emitted as a dynamic entry.",
  );
}

const [appEntryKey, appEntryChunk] = appEntry;
const visited = new Set();

function visitStaticImports(chunkKey) {
  if (visited.has(chunkKey)) return;
  visited.add(chunkKey);

  for (const importedKey of manifest[chunkKey]?.imports ?? []) {
    visitStaticImports(importedKey);
  }
}

visitStaticImports(appEntryKey);

if (visited.has(teachingBridgeKey)) {
  throw new Error(
    "Bundle check failed: the application entry statically imports TeachingBridge.",
  );
}

if (!(appEntryChunk.dynamicImports ?? []).includes(teachingBridgeKey)) {
  throw new Error(
    "Bundle check failed: the application entry does not lazy-load TeachingBridge.",
  );
}

await access(new URL(`../dist/${teachingBridgeChunk.file}`, import.meta.url));

console.log(
  `Lazy chunk verified: ${teachingBridgeChunk.file} is loaded on demand.`,
);
