import { buildScramblePlan, buildScrambleText } from "../tools/animationUtils";

export default {
    id: "scrambleReveal",
    createPlan: ({ text, duration }) => buildScramblePlan(text, duration),
    getFrame: ({ text, step, plan }) => ({
        mode: "text",
        text: buildScrambleText(text, step, plan),
    }),
};
