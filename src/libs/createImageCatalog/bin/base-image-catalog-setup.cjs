#!/usr/bin/env node
/* eslint-disable no-console */
const { setupImageCatalog } = require("../vars");

const result = setupImageCatalog(process.cwd());

console.log(`base-image-catalog-setup: ${result.imagesDirCreated ? "created" : "checked"} src/images.`);
console.log(
    `base-image-catalog-setup: package.json ${result.packageJsonUpdated ? "updated" : "already ready"}.`,
);
