/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const pkgPath = path.resolve(process.cwd(), "package.json");
const distPath = path.resolve(process.cwd(), "dist");

function readPkg() {
    return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}

function run(cmd) {
    execSync(cmd, { stdio: "inherit" });
}

function runSilent(cmd) {
    try {
        execSync(cmd, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

function writePkg(pkg) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

function removeDist() {
    fs.rmSync(distPath, { recursive: true, force: true });
}

// function switchToLocal(pkg) {
//   pkg.main = "src/index.js";
//   pkg.module = "src/index.js";
//   pkg.exports = {
//     ".": {
//       import: "./src/index.js",
//       require: "./src/index.js"
//     }
//   };

//   delete pkg.type;
//   delete pkg.files;

//   return pkg;
// }

function switchToPublish(pkg) {
    pkg.type = "module";
    pkg.files = ["dist"];
    pkg.main = "./dist/bariskuran-base.umd.cjs";
    pkg.module = "./dist/bariskuran-base.js";
    pkg.exports = {
        ".": {
            import: "./dist/bariskuran-base.js",
            require: "./dist/bariskuran-base.umd.cjs",
        },
    };

    return pkg;
}

const original = readPkg();
const originalString = JSON.stringify(original, null, 2) + "\n";
const isLinked = runSilent("yarn list --pattern @bariskuran/base");

try {
    if (isLinked) {
        console.log("Linked package detected → unlinking");
        runSilent("yarn unlink");
    }
    console.log("Updateding package.json");
    writePkg(switchToPublish({ ...original }));
    console.log("Removing dist directory");
    removeDist();
    console.log("Building...");
    run("vite build");
    console.log("Library built successfully.");
} finally {
    console.log("Writing local package.json");
    fs.writeFileSync(pkgPath, originalString);
    console.log("Linking package");
    runSilent("yarn link");
    console.log("Linked enabled successfully");
    console.log("Done.");
}
