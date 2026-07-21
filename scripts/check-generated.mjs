import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.RECONIFY_OPENAPI_SPEC) {
  throw new Error("Set RECONIFY_OPENAPI_SPEC to the external OpenAPI JSON path before checking generated files.");
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, [path.join(root, "scripts", "generate.mjs")], { cwd: root, stdio: "inherit" });
execFileSync("git", ["diff", "--exit-code", "--", "src/apis", "src/models.ts", "src/openapi-types.ts", "src/operations.ts"], {
  cwd: root,
  stdio: "inherit",
});
