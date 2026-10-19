#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const ROOT = path.resolve(__dirname, "..");
const CREATE_DIR = path.join(ROOT, "create");
const REGISTRY = "https://registry.npmjs.org/";
const EXPECTED_NAMES = {
    base: "@bariskuran/base",
    create: "@bariskuran/create-base",
};

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function isSemver(value) {
    return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(
        value,
    );
}

function npm(args, cwd, options = {}) {
    return spawnSync("npm", args, {
        cwd,
        encoding: options.capture ? "utf8" : undefined,
        stdio: options.capture ? "pipe" : "inherit",
        shell: process.platform === "win32",
    });
}

function assertNpmLogin() {
    const result = npm(["whoami", `--registry=${REGISTRY}`], ROOT, { capture: true });
    if (result.error || result.status !== 0) {
        const details = [result.stderr, result.stdout].filter(Boolean).join("\n").trim();
        throw new Error(
            `npm authentication is required. Run 'npm login --auth-type=web --registry=${REGISTRY}' and retry.${details ? `\n${details}` : ""}`,
        );
    }
    const username = result.stdout.trim();
    if (username) console.log(`Publishing as npm user: ${username}`);
}

function versionIsPublished(packageName, version) {
    const result = npm(["view", `${packageName}@${version}`, "version", "--json", `--registry=${REGISTRY}`], ROOT, {
        capture: true,
    });
    if (result.status === 0) return true;

    const details = `${result.stderr || ""}\n${result.stdout || ""}`;
    if (/E404|404 Not Found|is not in this registry|No match found/i.test(details)) return false;
    throw new Error(`Could not check ${packageName}@${version} on npm.\n${details.trim()}`);
}

async function askVersion(baseVersion) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    try {
        while (true) {
            const version = (await rl.question(
                `Version to publish for both packages (current Base version: ${baseVersion}): `,
            )).trim();
            if (isSemver(version)) return version;
            console.log("Enter a valid semantic version, for example 0.0.1 or 1.0.0.");
        }
    } finally {
        rl.close();
    }
}

function updateBaseSpec(builderPath, version) {
    const source = fs.readFileSync(builderPath, "utf8");
    const pattern = /^const BASE_SPEC = process\.env\.BASE_SPEC \|\| `\$\{PKG_NAME\}@[^`]+`;/m;
    if (!pattern.test(source)) throw new Error("Could not find the BASE_SPEC version in create/template/builder.cjs.");

    const updated = source.replace(pattern, () => `const BASE_SPEC = process.env.BASE_SPEC || \`\${PKG_NAME}@${version}\`;`);
    fs.writeFileSync(builderPath, updated);
}

function synchronizeVersions(version) {
    const basePath = path.join(ROOT, "package.json");
    const createPath = path.join(CREATE_DIR, "package.json");
    const templatePackagePath = path.join(CREATE_DIR, "template", "package.json");

    const basePackage = readJson(basePath);
    const createPackage = readJson(createPath);
    const templatePackage = readJson(templatePackagePath);

    if (basePackage.name !== EXPECTED_NAMES.base || createPackage.name !== EXPECTED_NAMES.create) {
        throw new Error("Unexpected package names found. Expected @bariskuran/base and @bariskuran/create-base.");
    }

    basePackage.version = version;
    createPackage.version = version;
    templatePackage.dependencies = templatePackage.dependencies || {};
    templatePackage.dependencies[EXPECTED_NAMES.base] = version;

    writeJson(basePath, basePackage);
    writeJson(createPath, createPackage);
    writeJson(templatePackagePath, templatePackage);
    updateBaseSpec(path.join(CREATE_DIR, "template", "builder.cjs"), version);
}

function publishPackage(packageName, cwd) {
    const result = npm(["publish", "--access", "public", `--registry=${REGISTRY}`], cwd);
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`npm publish failed for ${packageName}.`);
}

async function main() {
    const basePath = path.join(ROOT, "package.json");
    const basePackage = readJson(basePath);
    assertNpmLogin();

    const version = await askVersion(basePackage.version);
    const packages = [
        { name: EXPECTED_NAMES.base, directory: ROOT },
        { name: EXPECTED_NAMES.create, directory: CREATE_DIR },
    ];

    const alreadyPublished = new Map();
    for (const item of packages) {
        alreadyPublished.set(item.name, versionIsPublished(item.name, version));
    }

    synchronizeVersions(version);
    console.log(`\nPublishing release ${version}...`);

    const report = [];
    for (const item of packages) {
        if (alreadyPublished.get(item.name)) {
            console.log(`\n${item.name}@${version} already exists on npm; skipping the immutable version.`);
            report.push({ ...item, result: "already published; skipped" });
            continue;
        }

        console.log(`\nPublishing ${item.name}@${version}...`);
        publishPackage(item.name, item.directory);
        report.push({ ...item, result: "published" });
    }

    console.log("\nRelease report");
    for (const item of report) console.log(`- ${item.name}@${version}: ${item.result}`);
    console.log(`\nTry the initializer with: npx ${EXPECTED_NAMES.create}@${version}`);
}

main().catch((error) => {
    console.error(`\nRelease stopped: ${error.message}`);
    process.exitCode = 1;
});
