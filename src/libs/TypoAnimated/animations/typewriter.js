import { buildRevealPlan, sliceRevealText } from "../tools/animationUtils";

export default {
    id: "typewriter",
    createPlan: ({ text, duration }) => buildRevealPlan(text, duration),
    getFrame: ({ text, step, plan }) => ({
        mode: "text",
        text: sliceRevealText(text, step, plan),
    }),
};
