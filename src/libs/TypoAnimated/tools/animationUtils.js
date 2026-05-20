/** Tight multi-line stacks (scatterLines, stackedWords). */
export const TIGHT_LINE_HEIGHT = 0.8;

/**
 * Builds a step plan for progressive text reveal (typewriter-style).
 * Short text: one step per character. Long text: fewer steps with larger chunks.
 */
export const buildRevealPlan = (
    text,
    duration,
    {
        maxLetterSteps = 48,
        minChunkSteps = 14,
        maxChunkSteps = 28,
        minStepMs = 24,
    } = {},
) => {
    const len = Math.max(0, text?.length ?? 0);
    if (len === 0) {
        return { totalSteps: 1, chunk: 1, refreshTime: duration, charCount: 0 };
    }

    let chunk = 1;
    let totalSteps = len;

    if (len > maxLetterSteps) {
        totalSteps = Math.min(
            maxChunkSteps,
            Math.max(minChunkSteps, Math.round(duration / 90)),
        );
        chunk = Math.ceil(len / totalSteps);
        totalSteps = Math.ceil(len / chunk);
    }

    const refreshTime = Math.max(minStepMs, Math.floor(duration / totalSteps));

    return {
        totalSteps,
        chunk,
        refreshTime,
        charCount: len,
    };
};

export const sliceRevealText = (text, step, plan) => {
    if (!text) return "";
    const { chunk = 1, charCount = text.length } = plan || {};
    const visible = Math.min(charCount, Math.max(0, (step + 1) * chunk));
    return text.slice(0, visible);
};

export const resolveTextSource = (children, content) => {
    if (children != null && children !== "") return String(children);
    if (content != null && content !== "") return String(content);
    return "";
};

/** animatedWriter only: nowrap keeps per-char inline-blocks on one line with the ghost layer. */
export const resolveAnimatedWriterWhiteSpace = (text) =>
    String(text ?? "").includes("\n") ? "pre-wrap" : "nowrap";

export const pseudo = (seed) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

/** Same chunking as typewriter, plus one initial step with zero correct characters. */
export const buildScramblePlan = (text, duration, options) => {
    const base = buildRevealPlan(text, duration, options);
    if (!base.charCount) return base;

    const totalSteps = base.totalSteps + 1;
    const refreshTime = Math.max(24, Math.floor(duration / totalSteps));

    return { ...base, totalSteps, refreshTime, scramble: true };
};

export const getRevealCorrectCount = (step, plan) => {
    if (!plan?.scramble) {
        return Math.min(plan?.charCount ?? 0, Math.max(0, (step + 1) * (plan?.chunk ?? 1)));
    }
    if (step <= 0) return 0;
    return Math.min(plan.charCount, step * (plan.chunk ?? 1));
};

const scrambleChar = (index, char, text) => {
    if (!/[a-zA-Z]/.test(char)) return char;
    const upper = char === char.toUpperCase();
    const pool = upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "abcdefghijklmnopqrstuvwxyz";
    const seed = (text?.charCodeAt(0) ?? 0) * 31 + index * 17 + (text?.length ?? 0);
    return pool[Math.floor(pseudo(seed) * pool.length)];
};

/** Fixed length; prefix matches target, suffix stays scrambled until revealed. */
export const buildScrambleText = (text, step, plan) => {
    if (!text) return "";
    const correct = getRevealCorrectCount(step, plan);
    let out = "";
    for (let i = 0; i < text.length; i++) {
        out += i < correct ? text[i] : scrambleChar(i, text[i], text);
    }
    return out;
};

export const parseMultilineText = (text) =>
    String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

export const buildWordEntries = (lines) => {
    const entries = [];
    lines.forEach((line, lineIndex) => {
        line.split(/\s+/).filter(Boolean).forEach((word, wordIndex) => {
            entries.push({ lineIndex, wordIndex, word, seed: lineIndex * 1000 + wordIndex });
        });
    });
    return entries;
};
