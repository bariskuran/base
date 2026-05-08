/**
 * Repairs name.en wrongly overwritten by buggy sync (capital vs name).
 * Uses scripts/sync-country-information.report.txt produced by sync script.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT = path.join(__dirname, "sync-country-information.report.txt");
const TARGET = path.join(ROOT, "src/constants/COUNTRY_INFORMATION.js");

function escapeInner(s) {
    return JSON.stringify(String(s ?? "")).slice(1, -1);
}

function splitBlocks(src) {
    const needle = "export const COUNTRY_INFORMATION = {";
    const i = src.indexOf(needle);
    const start = src.indexOf("{", i) + 1;
    const end = src.lastIndexOf("};");
    const prefix = src.slice(0, start);
    const suffix = src.slice(end);
    const re = /\n    ([a-z]{2}):\s*\{/g;
    /** @type {{key:string,start:number,end:number,text:string}[]} */
    const list = [];
    let m;
    const hits = [];
    while ((m = re.exec(src)) !== null) hits.push({ key: m[1], index: m.index });
    for (let h = 0; h < hits.length; h++) {
        const from = hits[h].index;
        const to = h + 1 < hits.length ? hits[h + 1].index : end;
        list.push({ key: hits[h].key, start: from, end: to, text: src.slice(from, to) });
    }
    return { prefix, suffix, list };
}

/** @returns {Record<string,string>} iso2 → correct english short name */
function parseReport(reportText) {
    const map = {};
    const lines = reportText.split(/\r?\n/);
    for (const line of lines) {
        const m = /^([a-z]{2}):\s*en\s*"((?:[^"\\]|\\.)*)"\s*->\s*/.exec(line);
        if (!m) continue;
        map[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    return map;
}

function injectNameEn(blockText, en) {
    const re =
        /\n        name:\s*\{([\s\S]*?)\n        \},\n        officialName:/;
    const m = re.exec(blockText);
    if (!m) throw new Error("name block missing");
    const inner = m[1].replace(
        /\n            en:\s*"[^"]*"/,
        `\n            en: "${escapeInner(en)}"`,
    );
    return blockText.replace(
        re,
        `\n        name: {${inner}\n        },\n        officialName:`,
    );
}

const CONTINENT_REVERTS = {
    cy: `[CONTINENTS.asia, CONTINENTS.europe]`,
    eg: `[CONTINENTS.africa, CONTINENTS.asia]`,
    ge: `[CONTINENTS.asia, CONTINENTS.europe]`,
    kz: `[CONTINENTS.asia, CONTINENTS.europe]`,
    tl: `[CONTINENTS.asia]`,
};

function injectContinents(blockText, iso2) {
    const refs = CONTINENT_REVERTS[iso2];
    if (!refs) return blockText;
    return blockText.replace(
        /\n        continents:\s*\[[^\]]*\],/,
        `\n        continents: ${refs},`,
    );
}

const main = () => {
    const report = fs.readFileSync(REPORT, "utf8");
    const fixes = parseReport(report);
    const src = fs.readFileSync(TARGET, "utf8");
    const { prefix, suffix, list } = splitBlocks(src);
    let merged = "";

    for (const { key, text } of list) {
        let next = text;
        if (fixes[key]) next = injectNameEn(next, fixes[key]);
        next = injectContinents(next, key);
        merged += next;
    }

    fs.writeFileSync(TARGET, `${prefix}${merged}${suffix}`, "utf8");
    console.log("Restored name.en from report for:", Object.keys(fixes).length, "countries");
};

main();
