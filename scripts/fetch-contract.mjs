import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = process.env.RECONIFY_OPENAPI_SPEC ?? path.join(root, ".contract", "reconify.openapi.json");
const updateToLatest = process.argv.includes("--latest");
const pinPath = path.join(root, ".openapi-contract.json");
if (process.env.RECONIFY_OPENAPI_SPEC) {
  if (!fs.existsSync(outputPath)) throw new Error("RECONIFY_OPENAPI_SPEC does not exist: " + outputPath);
  if (updateToLatest) {
    const content = fs.readFileSync(outputPath);
    const document = JSON.parse(content);
    const version = document.info?.version;
    if (!version) throw new Error("Local OpenAPI contract has no info.version");
    const sha256 = crypto.createHash("sha256").update(content).digest("hex");
    fs.writeFileSync(pinPath, JSON.stringify({ version, sha256 }, null, 2) + "\n");
  }
  console.log("Using local OpenAPI contract: " + outputPath);
  process.exit(0);
}

const manifestUrl = process.env.RECONIFY_OPENAPI_MANIFEST_URL ?? "https://docs.reconifyhq.com/openapi/manifest.json";
const pinned = JSON.parse(fs.readFileSync(pinPath, "utf8"));
const manifestResponse = await fetch(manifestUrl);
if (!manifestResponse.ok) throw new Error("Failed to fetch OpenAPI manifest: HTTP " + manifestResponse.status);
const manifest = await manifestResponse.json();
const version = updateToLatest ? manifest.contract_version : pinned.version;
const artifact = manifest.versions?.[version];
if (!artifact) throw new Error("OpenAPI manifest has no version " + version);
if (!updateToLatest && artifact.sha256 !== pinned.sha256) {
  throw new Error("Pinned OpenAPI checksum does not match the manifest for version " + pinned.version);
}
const artifactUrl = new URL(artifact.url, manifestUrl);
const response = await fetch(artifactUrl);
if (!response.ok) throw new Error("Failed to fetch OpenAPI contract: HTTP " + response.status);
const content = Buffer.from(await response.arrayBuffer());
const digest = crypto.createHash("sha256").update(content).digest("hex");
if (updateToLatest) {
  fs.writeFileSync(pinPath, JSON.stringify({ version, sha256: digest }, null, 2) + "\n");
} else if (digest !== pinned.sha256) {
  throw new Error("OpenAPI checksum mismatch: expected " + pinned.sha256 + ", got " + digest);
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content);
console.log("Fetched OpenAPI " + version + " to " + outputPath);
