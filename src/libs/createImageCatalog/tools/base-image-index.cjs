#!/usr/bin/env node
/* eslint-disable no-undef */
const { generateImageIndexes } = require("../vars");

const result = generateImageIndexes(process.cwd());

console.log(
    `base-image-index: ${result.imageFolders.length} image folders indexed, ${result.totalImages} files mapped, ${result.catalogSplit.chunkCount} catalog chunks generated.`,
);
