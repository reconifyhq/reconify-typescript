import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = process.env.RECONIFY_OPENAPI_SPEC ?? process.argv[2];
if (!specPath || !fs.existsSync(specPath)) {
  throw new Error("Set RECONIFY_OPENAPI_SPEC to an existing external OpenAPI JSON path before generating.");
}

const openapiTypescript = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "openapi-typescript.cmd" : "openapi-typescript");
execFileSync(openapiTypescript, [specPath, "-o", path.join(root, "src", "openapi-types.ts")], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(process.execPath, [path.join(root, "scripts", "generate-client.mjs"), specPath], {
  cwd: root,
  stdio: "inherit",
});
