#!/usr/bin/env node
/* eslint-disable no-undef */
const { setupImageCatalog } = require("../vars");

const result = setupImageCatalog(process.cwd());

console.log(`base-image-catalog-setup: ${result.imagesDirCreated ? "created" : "checked"} imageCatalog folders.`);
console.log(
    `base-image-catalog-setup: package.json ${result.packageJsonUpdated ? "updated" : "already ready"}.`,
);
