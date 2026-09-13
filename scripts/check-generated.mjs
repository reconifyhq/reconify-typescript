import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = process.env.RECONIFY_OPENAPI_SPEC ?? path.join(root, ".contract", "reconify.openapi.json");
process.env.RECONIFY_OPENAPI_SPEC = specPath;
const generatedPaths = [
  "src/apis",
  "src/models.ts",
  "src/openapi-types.ts",
  "src/operations.ts",
];
const snapshot = new Map();
for (const relativePath of generatedPaths) {
  const absolutePath = path.join(root, relativePath);
  if (fs.statSync(absolutePath).isDirectory()) {
    for (const entry of fs.readdirSync(absolutePath)) {
      if (entry.endsWith(".ts")) snapshot.set(path.join(relativePath, entry), fs.readFileSync(path.join(absolutePath, entry)));
    }
  } else {
    snapshot.set(relativePath, fs.readFileSync(absolutePath));
  }
}
execFileSync(process.execPath, [path.join(root, "scripts", "generate.mjs")], { cwd: root, stdio: "inherit" });
const currentPaths = new Set(snapshot.keys());
for (const relativePath of generatedPaths) {
  const absolutePath = path.join(root, relativePath);
  if (fs.statSync(absolutePath).isDirectory()) {
    for (const entry of fs.readdirSync(absolutePath)) {
      if (entry.endsWith(".ts")) currentPaths.add(path.join(relativePath, entry));
    }
  } else {
    currentPaths.add(relativePath);
  }
}
const changed = [...currentPaths].filter((relativePath) => {
  const currentPath = path.join(root, relativePath);
  const current = fs.existsSync(currentPath) ? fs.readFileSync(currentPath) : undefined;
  const previous = snapshot.get(relativePath);
  return !current || !previous || !current.equals(previous);
});
if (changed.length) throw new Error("Generated output changed: " + changed.join(", "));
console.log("Generated output is up to date.");
