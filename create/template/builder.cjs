/* eslint-disable no-undef */
const { execFileSync, execSync } = require("child_process");
const path = require("path");

const MODE = process.argv[2]; // useGitBase | useLocalBase | buildLocal | buildRegistry
const PKG_NAME = "@bariskuran/base";
const BASE_SPEC = process.env.BASE_SPEC || `${PKG_NAME}@0.0.3`;

function run(cmd) {
    execSync(cmd, { stdio: "inherit" });
}

function runNodeScript(scriptPath) {
    execFileSync(process.execPath, [scriptPath], { stdio: "inherit" });
}

function runVite(args) {
    execFileSync(process.execPath, [path.join("node_modules", "vite", "bin", "vite.js"), ...args], {
        stdio: "inherit",
    });
}

function runSilent(cmd) {
    try {
        execSync(cmd, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

function startViteDev() {
    runVite([]);
}

function buildVite() {
    runVite(["build"]);
}

function formatRouteFiles() {
    execFileSync(
        process.execPath,
        [path.join("node_modules", "prettier", "bin", "prettier.cjs"), "--write", "src/views/**/route.js"],
        { stdio: "inherit" },
    );
}

function generateRouteMetadata() {
    runNodeScript("routes_auto_fill.cjs");
    formatRouteFiles();
}

function ensureGitBaseInstalled() {
    runSilent(`yarn unlink "${PKG_NAME}"`);
    run(`yarn add "${BASE_SPEC}"`);
}

function switchToLocalLink() {
    runSilent(`yarn remove "${PKG_NAME}"`);
    run(`yarn link "${PKG_NAME}"`);
}

function usageAndExit() {
    process.exit(1);
}

function assertSupportedNode() {
    const [major] = process.versions.node.split(".").map(Number);
    const isSupported = major >= 23;

    if (!isSupported) {
        console.error(
            `Node ${process.versions.node} is too old for this project. Use Node >=23.0.0, then rerun this command.`,
        );
        process.exit(1);
    }
}

if (!MODE) usageAndExit();

assertSupportedNode();

if (MODE === "useGitBase") {
    console.log(`🔁 Using GIT/registry base: ${BASE_SPEC}`);
    ensureGitBaseInstalled();
    console.log("🚀 Starting Vite dev server…");
    startViteDev();
    process.exit(0);
}

if (MODE === "useLocalBase") {
    console.log("🔁 Switching to LOCAL linked base…");
    switchToLocalLink();
    console.log("🚀 Starting Vite dev server…");
    startViteDev();
    process.exit(0);
}

if (MODE === "buildLocal") {
    console.log("🏗️ Build with LOCAL linked base.");

    let buildSucceeded = false;
    try {
        switchToLocalLink();
        console.log("🧭 Generating route metadata…");
        generateRouteMetadata();
        console.log("📦 Running vite build…");
        buildVite();
        buildSucceeded = true;
        console.log("✅ Build completed.");
    } finally {
        if (!buildSucceeded) {
            console.log("⚠️ Build failed; keeping current dependency state.");
        }
    }

    process.exit(buildSucceeded ? 0 : 1);
}

if (MODE === "buildRegistry") {
    console.log(`🏗️ Build with GIT/registry base: ${BASE_SPEC}`);

    let buildSucceeded = false;
    try {
        ensureGitBaseInstalled();
        console.log("🧭 Generating route metadata…");
        generateRouteMetadata();
        console.log("📦 Running vite build…");
        buildVite();
        buildSucceeded = true;
        console.log("✅ Build completed.");
    } finally {
        if (buildSucceeded) {
            console.log("🔁 Switching back to LOCAL linked base…");
            switchToLocalLink();
            console.log("✅ Local link enabled.");
        } else {
            console.log("⚠️ Build failed; keeping current dependency state (no auto relink).");
        }
    }

    process.exit(buildSucceeded ? 0 : 1);
}
usageAndExit();
