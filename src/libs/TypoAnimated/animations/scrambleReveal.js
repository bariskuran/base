import { buildScramblePlan, buildScrambleText } from "../tools/animationUtils";

/** Full-length scrambled text; letters resolve one by one (deneme → klmaeg … → deneme). */
export default {
    id: "scrambleReveal",
    createPlan: ({ text, duration }) => buildScramblePlan(text, duration),
    getFrame: ({ text, step, plan }) => ({
        mode: "text",
        text: buildScrambleText(text, step, plan),
    }),
};
