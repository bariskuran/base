import { buildWordEntries, parseMultilineText } from "./animationUtils";

const clamp = (ms, min, max) => Math.max(min, Math.min(max, ms));

const countWords = (text) => {
    const lines = parseMultilineText(text);
    if (!lines.length) return 0;
    return buildWordEntries(lines).length;
};

const letterSteps = (text) => {
    const len = Math.max(0, text?.length ?? 0);
    if (len === 0) return 1;
    if (len <= 48) return len;
    const chunkSteps = Math.min(28, Math.max(14, Math.round(len / 4)));
    return Math.ceil(len / Math.ceil(len / chunkSteps));
};

const calculators = {
    typewriter: (text) => {
        const steps = letterSteps(text);
        if (steps <= 48) return clamp(steps * 55, 400, 8000);
        return clamp(steps * 120, 1200, 12000);
    },
    scrambleReveal: (text) => {
        const steps = letterSteps(text) + 1;
        if (steps <= 49) return clamp(steps * 55, 450, 8000);
        return clamp(steps * 120, 1300, 12000);
    },
    animatedWriter: (text) => {
        const steps = letterSteps(text);
        if (steps <= 48) return clamp(steps * 70, 500, 9000);
        return clamp(steps * 140, 1400, 14000);
    },
    scatterLines: (text) => clamp(countWords(text) * 200, 600, 10000),
    stackedWords: (text) => clamp(2200 + countWords(text) * 80, 2000, 8000),
};

export const autoDuration = (variant, text) => {
    const calc = calculators[variant] ?? calculators.typewriter;
    return calc(String(text ?? ""));
};

export const resolveDuration = (variant, text, duration) => {
    if (duration != null && Number.isFinite(Number(duration))) {
        return Number(duration);
    }
    return autoDuration(variant, text);
};
