#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const TEMPLATE_DIR = path.join(__dirname, "..", "template");
const RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;

function isValidWorkspaceName(value) {
    return (
        value.length > 0 &&
        value.length <= 100 &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
        !RESERVED_NAMES.test(value)
    );
}

function isValidProjectName(value) {
    return (
        value.length <= 214 &&
        /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/.test(value) &&
        !value.includes("..") &&
        !value.startsWith(".") &&
        !value.startsWith("_")
    );
}

async function askRequired(rl, prompt, validate, errorMessage) {
    while (true) {
        const value = (await rl.question(prompt)).trim();
        if (value && validate(value)) return value;
        console.log(errorMessage);
    }
}

async function askYesNo(rl, prompt) {
    while (true) {
        const value = (await rl.question(prompt)).trim().toLowerCase();
        if (["y", "yes"].includes(value)) return true;
        if (["n", "no", ""].includes(value)) return false;
        console.log("Please answer yes or no.");
    }
}

async function askConflictPolicy(rl) {
    while (true) {
        const answer = (await rl.question(
            "For later conflicts, should I prompt you each time or reuse this choice? [prompt/reuse]: ",
        ))
            .trim()
            .toLowerCase();

        if (["prompt", "p"].includes(answer)) return "prompt";
        if (["reuse", "r"].includes(answer)) return "reuse";
        console.log("Please enter 'prompt' or 'reuse'.");
    }
}

async function collectAnswers(rl) {
    console.log("Create a new Base project. Press Ctrl+C to cancel.\n");

    const workspaceName = await askRequired(
        rl,
        "Workspace folder name (lowercase letters, numbers, and hyphens): ",
        isValidWorkspaceName,
        "Use 1–100 lowercase ASCII letters or numbers, separated by single hyphens. Avoid reserved system names.",
    );
    const projectName = await askRequired(
        rl,
        "Project/package name: ",
        isValidProjectName,
        "Enter a valid npm package name using lowercase letters, numbers, dots, underscores, or hyphens (an optional scope is allowed).",
    );
    const projectTitle = await askRequired(rl, "Project title: ", () => true, "Enter a project title.");
    const projectDescription = await askRequired(
        rl,
        "Project description: ",
        () => true,
        "Enter a project description.",
    );
    const projectUrl = await askRequired(
        rl,
        "Project URL (https://...): ",
        (value) => {
            try {
                return ["http:", "https:"].includes(new URL(value).protocol);
            } catch {
                return false;
            }
        },
        "Enter a valid http or https URL.",
    );
    const developerName = await askRequired(rl, "Developer name: ", () => true, "Enter a developer name.");
    const developerContact = await askRequired(
        rl,
        "Developer contact (email, website, or other contact): ",
        () => true,
        "Enter developer contact information.",
    );

    return {
        workspaceName,
        projectName,
        projectTitle,
        projectDescription,
        projectUrl,
        developerName,
        developerContact,
    };
}

function replaceEnvValue(envText, key, value) {
    const encoded = JSON.stringify(value);
    const matcher = new RegExp(`^${key}=.*$`, "m");
    if (!matcher.test(envText)) throw new Error(`The template is missing ${key} in its .env file.`);
    return envText.replace(matcher, `${key}=${encoded}`);
}

function escapeMarkdownTableCell(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("|", "\\|")
        .replace(/\r?\n/g, "<br>")
        .replaceAll("`", "\\`");
}

function escapeMarkdownHeading(value) {
    return String(value).replace(/[\\`*_{}\[\]<>#+.!|]/g, "\\$&").replace(/\r?\n/g, " ");
}

async function writeCustomizedFiles(targetDir, answers) {
    if (!answers.skipped.has("package.json")) {
        const packagePath = path.join(targetDir, "package.json");
        const packageJson = JSON.parse(await fs.promises.readFile(packagePath, "utf8"));
        packageJson.name = answers.projectName;
        packageJson.description = answers.projectDescription;
        packageJson.author = `${answers.developerName} <${answers.developerContact}>`;
        await fs.promises.writeFile(packagePath, `${JSON.stringify(packageJson, null, 4)}\n`);
    }

    if (!answers.skipped.has(".env")) {
        const envPath = path.join(targetDir, ".env");
        let envText = await fs.promises.readFile(envPath, "utf8");
        envText = replaceEnvValue(envText, "VITE_SITE_TITLE", answers.projectTitle);
        envText = replaceEnvValue(envText, "VITE_SITE_DESCRIPTION", answers.projectDescription);
        envText = replaceEnvValue(envText, "VITE_SITE_URL", answers.projectUrl);
        envText = replaceEnvValue(envText, "VITE_DEVELOPER_NAME", answers.developerName);
        await fs.promises.writeFile(envPath, envText);
    }

    if (!answers.skipped.has("LICENSE")) {
        const licensePath = path.join(targetDir, "LICENSE");
        const licenseText = await fs.promises.readFile(licensePath, "utf8");
        const currentYear = new Date().getFullYear();
        const personalizedLicense = licenseText
            .replaceAll("[YEAR]", String(currentYear))
            .replaceAll("[DEVELOPER_NAME]", answers.developerName)
            .replaceAll("[DEVELOPER_CONTACT]", answers.developerContact);
        await fs.promises.writeFile(licensePath, personalizedLicense);
    }

    if (!answers.skipped.has("README.md")) {
        const readmePath = path.join(targetDir, "README.md");
        let readme = await fs.promises.readFile(readmePath, "utf8");
        const replacements = {
            "[PROJECT_TITLE_HEADING]": escapeMarkdownHeading(answers.projectTitle),
            "[PROJECT_TITLE]": escapeMarkdownTableCell(answers.projectTitle),
            "[PROJECT_DESCRIPTION]": escapeMarkdownTableCell(answers.projectDescription),
            "[WORKSPACE_NAME]": escapeMarkdownTableCell(answers.workspaceName),
            "[PROJECT_NAME]": escapeMarkdownTableCell(answers.projectName),
            "[PROJECT_URL]": escapeMarkdownTableCell(answers.projectUrl),
            "[DEVELOPER_NAME]": escapeMarkdownTableCell(answers.developerName),
            "[DEVELOPER_CONTACT]": escapeMarkdownTableCell(answers.developerContact),
        };
        for (const [placeholder, value] of Object.entries(replacements)) {
            readme = readme.replaceAll(placeholder, value);
        }
        await fs.promises.writeFile(readmePath, readme);
    }
}

function promptOverwrite(relativePath) {
    return `\n\"${relativePath}\" already exists. Do you want to overwrite it? [y/N]: `;
}

async function copyTemplate(rl, targetDir) {
    let policy = null;
    let rememberedOverwrite = false;
    const skipped = new Set();

    async function resolveConflict(relativePath) {
        let overwrite;
        if (policy === "reuse") {
            overwrite = rememberedOverwrite;
        } else {
            overwrite = await askYesNo(rl, promptOverwrite(relativePath));
            if (policy === null) {
                rememberedOverwrite = overwrite;
                policy = await askConflictPolicy(rl);
            }
        }
        return overwrite;
    }

    async function copyNode(sourcePath, destinationPath, relativePath) {
        const sourceStat = await fs.promises.lstat(sourcePath);
        let destinationStat = null;
        try {
            destinationStat = await fs.promises.lstat(destinationPath);
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }

        if (destinationStat) {
            const sameType = sourceStat.isDirectory() === destinationStat.isDirectory();
            if (sameType && sourceStat.isDirectory()) {
                // Merge directories so unrelated user files remain untouched.
            } else if (!(await resolveConflict(relativePath))) {
                skipped.add(relativePath);
                return;
            } else {
                await fs.promises.rm(destinationPath, { recursive: true, force: true });
                destinationStat = null;
            }
        }

        if (sourceStat.isDirectory()) {
            await fs.promises.mkdir(destinationPath, { recursive: true });
            const children = await fs.promises.readdir(sourcePath);
            for (const child of children) {
                if (child === ".DS_Store") continue;
                await copyNode(
                    path.join(sourcePath, child),
                    path.join(destinationPath, child),
                    path.posix.join(relativePath, child),
                );
            }
            return;
        }

        if (sourceStat.isSymbolicLink()) throw new Error(`The template contains an unsupported symbolic link: ${relativePath}`);
        await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });
        await fs.promises.copyFile(sourcePath, destinationPath);
        await fs.promises.chmod(destinationPath, sourceStat.mode);
    }

    const children = await fs.promises.readdir(TEMPLATE_DIR);
    for (const child of children) {
        if (child === ".DS_Store") continue;
        const targetName = child === "gitignore" ? ".gitignore" : child;
        await copyNode(
            path.join(TEMPLATE_DIR, child),
            path.join(targetDir, targetName),
            targetName,
        );
    }
    return skipped;
}

async function installDependencies(targetDir) {
    console.log("\nInstalling dependencies with Yarn...");
    const result = spawnSync("yarn", ["install"], { cwd: targetDir, stdio: "inherit", shell: process.platform === "win32" });
    if (result.error || result.status !== 0) {
        console.error("\nProject files were created, but Yarn could not complete the installation.");
        console.error("Install Yarn if needed, then run 'yarn install' from the project folder.");
        return false;
    }
    return true;
}

async function main() {
    if (!fs.existsSync(TEMPLATE_DIR)) throw new Error("The project template could not be found in this installation.");

    const rl = readline.createInterface({ input: stdin, output: stdout });
    try {
        const answers = await collectAnswers(rl);
        const targetDir = path.resolve(process.cwd(), answers.workspaceName);
        const existing = await fs.promises.lstat(targetDir).catch((error) => {
            if (error.code === "ENOENT") return null;
            throw error;
        });

        if (existing && !existing.isDirectory()) {
            throw new Error(`A file already exists at "${answers.workspaceName}". Choose a different workspace folder name.`);
        }

        if (existing) {
            const proceed = await askYesNo(
                rl,
                `The workspace folder "${answers.workspaceName}" already exists. Should I add the project files to it? [y/N]: `,
            );
            if (!proceed) {
                console.log("Project creation cancelled.");
                return;
            }
        }

        await fs.promises.mkdir(targetDir, { recursive: true });
        answers.skipped = await copyTemplate(rl, targetDir);
        await writeCustomizedFiles(targetDir, answers);
        rl.close();

        const installed = await installDependencies(targetDir);
        if (installed) {
            console.log("\nSetup complete. Start your project with 'yarn start'.");
        } else {
            console.log(`\nProject files are ready in "${answers.workspaceName}".`);
        }
    } finally {
        rl.close();
    }
}

main().catch((error) => {
    console.error(`\nProject creation failed: ${error.message}`);
    process.exitCode = 1;
});
