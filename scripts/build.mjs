import { rm, mkdir, cp } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const distDir = resolve(projectRoot, "dist");

const targets = [
  { from: "manifest.json", to: "manifest.json" },
  { from: "assets", to: "assets" },
  { from: "src", to: "src" },
];

async function cleanDist() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

async function copyTargets() {
  for (const target of targets) {
    await cp(
      resolve(projectRoot, target.from),
      resolve(distDir, target.to),
      { recursive: true }
    );
  }
}

async function main() {
  await cleanDist();
  await copyTargets();
  console.log("Build complete: dist/");
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exitCode = 1;
});
