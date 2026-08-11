import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = process.env.RECONIFY_OPENAPI_SPEC ?? path.join(root, ".contract", "reconify.openapi.json");
process.env.RECONIFY_OPENAPI_SPEC = specPath;
execFileSync(process.execPath, [path.join(root, "scripts", "generate.mjs")], { cwd: root, stdio: "inherit" });
execFileSync("git", ["diff", "--exit-code", "--", "src/apis", "src/models.ts", "src/openapi-types.ts", "src/operations.ts"], {
  cwd: root,
  stdio: "inherit",
});
