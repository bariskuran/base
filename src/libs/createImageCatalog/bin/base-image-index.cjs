#!/usr/bin/env node
/* eslint-disable no-console */
const { generateImageIndexes } = require("../vars");

const result = generateImageIndexes(process.cwd());

console.log(
    `base-image-index: ${result.imageFolders.length} image folders indexed, ${result.totalImages} files mapped.`,
);
