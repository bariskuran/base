import typewriter from "../animations/typewriter";
import scrambleReveal from "../animations/scrambleReveal";
import animatedWriter from "../animations/animatedWriter";
import scatterLines from "../animations/scatterLines";
import stackedWords from "../animations/stackedWords";

const registry = {
    typewriter,
    scrambleReveal,
    animatedWriter,
    scatterLines,
    stackedWords,
};

export const resolveAnimation = (variant = "typewriter") => {
    const key = String(variant);
    return registry[key] ?? typewriter;
};

export const animationIds = Object.keys(registry);
