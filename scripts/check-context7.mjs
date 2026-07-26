import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const context7Path = join(root, "context7.json");
const llmsPath = join(root, "llms.txt");
const requiredDocs = [
  "README.md",
  "docs/getting-started.md",
  "docs/request-options.md",
  "docs/workflows.md",
  "docs/api-reference.md",
];
const operationsSource = readFileSync(join(root, "src/operations.ts"), "utf8");

const context7 = JSON.parse(readFileSync(context7Path, "utf8"));
const requiredRules = [
  "@reconifyhq/sdk",
  "apiKey",
  "baseUrl",
  "client.events",
  "typed",
  "iterateEvents",
  "exclud",
];

if (context7.$schema !== "https://context7.com/schema/context7.json") throw new Error("context7.json has an unexpected schema URL");
if (context7.branch !== "main") throw new Error("context7.json must target the main branch");
if (!context7.projectTitle || !context7.description) throw new Error("context7.json needs projectTitle and description");
if (!Array.isArray(context7.rules) || context7.rules.length === 0) throw new Error("context7.json needs the required indexing rules");
for (const rule of requiredRules) {
  if (!context7.rules.some((value) => value.includes(rule))) throw new Error(`context7.json is missing a rule containing ${rule}`);
}

for (const file of requiredDocs) {
  if (!existsSync(join(root, file))) throw new Error(`Missing Context7 documentation file: ${file}`);
}

for (const file of requiredDocs) {
  const markdown = readFileSync(join(root, file), "utf8");
  const localLinks = markdown.matchAll(/\]\((?!https?:\/\/|#)([^)#]+)(?:#[^)]+)?\)/g);
  for (const [, link] of localLinks) {
    if (!existsSync(join(root, dirname(file), link))) throw new Error(`${file} links to missing file ${link}`);
  }
}

const apiReference = readFileSync(join(root, "docs/api-reference.md"), "utf8");
for (const [, methodName, module] of operationsSource.matchAll(/"methodName":"([^"]+)".*?"module":"([^"]+)"/g)) {
  const example = `client.${module}.${methodName}(`;
  if (!apiReference.includes(example)) throw new Error(`API reference is missing an example for ${module}.${methodName}`);
}

const llms = readFileSync(llmsPath, "utf8");
for (const file of requiredDocs.slice(1)) {
  if (!llms.includes(`/blob/main/${file}`)) throw new Error(`llms.txt does not link to ${file}`);
}

const packageFiles = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json"], { encoding: "utf8" }));
const packedFiles = new Set(packageFiles[0]?.files?.map(({ path }) => path) ?? []);
for (const file of ["README.md", "context7.json", "llms.txt", ...requiredDocs.slice(1)]) {
  if (!packedFiles.has(file)) throw new Error(`npm pack does not include ${file}`);
}

console.log("Context7 configuration, documentation links, and npm package contents passed.");
