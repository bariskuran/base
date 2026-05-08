/**
 * One-off sync helper: merges officialName (tr/fr/de/es + en official) from restcountries.com.
 * Updates ONLY officialName blocks (does not touch name, nativeName, capitals or continents).
 *
 * Run from repo root: node scripts/sync-country-information.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TARGET = path.join(ROOT, "src/constants/COUNTRY_INFORMATION.js");

const OVERRIDES = {
    TR: { officialName: { en: "Republic of Türkiye" } },
};

async function fetchAll() {
    const url =
        "https://restcountries.com/v3.1/all?fields=cca2,name,translations";
    const r = await fetch(url);
    if (!r.ok) throw new Error(`fetch failed ${r.status}`);
    return r.json();
}

function splitBlocks(src) {
    const needle = "export const COUNTRY_INFORMATION = {";
    const i = src.indexOf(needle);
    if (i < 0) throw new Error("COUNTRY_INFORMATION not found");
    const start = src.indexOf("{", i) + 1;
    const end = src.lastIndexOf("};");
    const prefix = src.slice(0, start);
    const suffix = src.slice(end);
    const list = [];
    const re = /\n    ([a-z]{2}):\s*\{/g;
    const hits = [];
    let m;
    while ((m = re.exec(src)) !== null) hits.push({ key: m[1], index: m.index });
    for (let h = 0; h < hits.length; h++) {
        const from = hits[h].index;
        const to = h + 1 < hits.length ? hits[h + 1].index : end;
        list.push({
            key: hits[h].key,
            text: src.slice(from, to),
        });
    }
    return { prefix, suffix, list };
}

function replaceOfficial(blockText, lines) {
    const re =
        /\n        officialName:\s*\{\n(?:            [^}]+\n)+        \},/;
    const replacement =
        `\n        officialName: {\n` +
        lines.map((line) => `            ${line}`).join(",\n") +
        `\n        },`;
    if (!re.test(blockText))
        throw new Error("officialName pattern failed for segment");
    return blockText.replace(re, replacement);
}

function esc(s) {
    return JSON.stringify(String(s ?? "")).slice(1, -1);
}

function mergeOfficial(iso2, row) {
    const ov = OVERRIDES[iso2]?.officialName ?? {};
    const t = row?.translations ?? {};
    return {
        tr: ov.tr ?? t.tur?.official ?? row.name.official,
        en: ov.en ?? row.name.official,
        fr: ov.fr ?? t.fra?.official ?? row.name.official,
        de: ov.de ?? t.deu?.official ?? row.name.official,
        es: ov.es ?? t.spa?.official ?? row.name.official,
    };
}

async function main() {
    const api = await fetchAll();
    const byIso = new Map(api.map((c) => [c.cca2, c]));
    const src = fs.readFileSync(TARGET, "utf8");
    const { prefix, suffix, list } = splitBlocks(src);

    /** @type {string[]} */
    const missing = [];
    let merged = "";

    for (const { key, text } of list) {
        const iso = key.toUpperCase();
        const row = byIso.get(iso);
        if (!row) {
            missing.push(key);
            merged += text;
            continue;
        }
        const o = mergeOfficial(iso, row);
        try {
            merged += replaceOfficial(text, [
                `tr: "${esc(o.tr)}"`,
                `en: "${esc(o.en)}"`,
                `fr: "${esc(o.fr)}"`,
                `de: "${esc(o.de)}"`,
                `es: "${esc(o.es)}"`,
            ]);
        } catch {
            missing.push(`${key}:replace`);
            merged += text;
        }
    }

    fs.writeFileSync(TARGET, `${prefix}${merged}${suffix}`, "utf8");
    const rep = path.join(__dirname, "sync-country-information.report.txt");
    fs.writeFileSync(
        rep,
        [
            missing.length
                ? `missing or regex fail: ${missing.join(", ")}`
                : "All countries merged OK.",
            "",
            "Official names only — name / capital / continents unchanged.",
        ].join("\n"),
        "utf8",
    );

    console.log("Done. Report:", rep);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
