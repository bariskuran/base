/**
 * _dS.jsx içinde code={`...`} bloklarında import'tan sonraki satırları
 * görsel hizalama için 24 boşlukla girintiler (getTimeDiff ile uyumlu).
 * İç içe template / ${} için doğru kapanışı bulur.
 */
import fs from "node:fs";
import path from "node:path";

const INDENT = "                        ";
const MARKER = "${SYS.basePath}";
const FILES = process.argv.slice(2);

function skipLineComment(s, i) {
    while (i < s.length && s[i] !== "\n" && s[i] !== "\r") i++;
    return i;
}

function skipBlockComment(s, i) {
    i += 2;
    while (i + 1 < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
    return i + 2 < s.length ? i + 2 : s.length;
}

function skipString(s, i, quote) {
    i++;
    while (i < s.length) {
        const c = s[i];
        if (c === "\\") {
            i += 2;
            continue;
        }
        if (c === quote) return i + 1;
        i++;
    }
    return i;
}

/** i, açılış ` indeksi; kapanış ` sonrası indeksi döner */
function skipTemplateLiteral(s, i) {
    if (s[i] !== "`") throw new Error("expected ` at " + i);
    i++;
    while (i < s.length) {
        const c = s[i];
        if (c === "\\") {
            i += 2;
            continue;
        }
        if (c === "$" && s[i + 1] === "{") {
            i += 2;
            i = skipBraceExpression(s, i);
            continue;
        }
        if (c === "`") return i + 1;
        i++;
    }
    throw new Error("unterminated template");
}

/** ${ sonrası ilk karakter; eşleşen } sonrası indeks */
function skipBraceExpression(s, i) {
    let depth = 1;
    while (i < s.length && depth > 0) {
        const c = s[i];
        if (c === "/" && s[i + 1] === "/") {
            i = skipLineComment(s, i);
            continue;
        }
        if (c === "/" && s[i + 1] === "*") {
            i = skipBlockComment(s, i);
            continue;
        }
        if (c === "'" || c === '"') {
            i = skipString(s, i, c);
            continue;
        }
        if (c === "`") {
            i = skipTemplateLiteral(s, i);
            continue;
        }
        if (c === "{") {
            depth++;
            i++;
            continue;
        }
        if (c === "}") {
            depth--;
            i++;
            if (depth === 0) return i;
            continue;
        }
        i++;
    }
    return i;
}

function fixTemplateBody(body) {
    if (!body.includes(MARKER)) return body;
    const lines = body.split("\n");
    const importIdx = lines.findIndex((line) => {
        const t = line.trim();
        return t.includes("from") && t.includes(MARKER);
    });
    if (importIdx === -1) return body;

    let m0 = Infinity;
    for (let li = importIdx + 1; li < lines.length; li++) {
        if (lines[li].trim() === "") continue;
        m0 = Math.min(m0, lines[li].match(/^\s*/)[0].length);
    }
    if (!Number.isFinite(m0)) m0 = 0;

    const out = [];
    for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        if (li <= importIdx) {
            out.push(line);
            continue;
        }
        if (line.trim() === "") {
            out.push(line);
            continue;
        }
        const lead = line.match(/^\s*/)[0].length;
        const rest = lead >= m0 ? line.slice(m0) : line.trimStart();
        out.push(INDENT + rest);
    }
    return out.join("\n");
}

function processFile(filePath) {
    let s = fs.readFileSync(filePath, "utf8");
    const needle = "code={`";
    let out = "";
    let cursor = 0;
    let changed = false;

    while (true) {
        const idx = s.indexOf(needle, cursor);
        if (idx === -1) {
            out += s.slice(cursor);
            break;
        }
        out += s.slice(cursor, idx);
        const tick = idx + needle.length - 1;
        const afterTick = skipTemplateLiteral(s, tick);
        const inner = s.slice(tick + 1, afterTick - 1);
        const fixed = fixTemplateBody(inner);
        if (fixed !== inner) changed = true;
        out += needle + fixed + "`}";
        let j = afterTick;
        while (j < s.length && /\s/.test(s[j])) j++;
        if (j >= s.length || s[j] !== "}") {
            throw new Error(`expected } after code template at offset ${j} in ${filePath}`);
        }
        cursor = j + 1;
    }

    if (changed) fs.writeFileSync(filePath, out);
    return changed;
}

for (const f of FILES) {
    const abs = path.resolve(f);
    if (fs.existsSync(abs)) {
        const c = processFile(abs);
        console.log(c ? "updated" : "unchanged", abs);
    } else {
        console.error("missing", abs);
    }
}
