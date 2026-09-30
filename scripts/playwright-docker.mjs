import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("@playwright/test/package.json");

const IMAGE = `mcr.microsoft.com/playwright:v${version}-noble`;
const NODE_MODULES_VOLUME = "yugioh-card-maker-node-modules";
const INSTALL_WHEN_LOCKFILE_CHANGES =
    "cmp -s package-lock.json node_modules/.installed-lockfile || (npm ci --no-audit --no-fund && cp package-lock.json node_modules/.installed-lockfile)";

const dockerIsRunning = spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;

if (!dockerIsRunning) {
    console.error("Docker is not running. Start Docker Desktop to run the visual tests.");
    process.exit(1);
}

const playwrightArgs = process.argv.slice(2).join(" ");

const { status } = spawnSync("docker", [
    "run", "--rm", "--ipc=host",
    "-v", `${process.cwd()}:/work`,
    "-v", `${NODE_MODULES_VOLUME}:/work/node_modules`,
    "-w", "/work",
    IMAGE,
    "bash", "-c", `${INSTALL_WHEN_LOCKFILE_CHANGES} && npx playwright ${playwrightArgs}`,
], { stdio: "inherit" });

process.exit(status ?? 1);
