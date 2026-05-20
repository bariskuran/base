import { buildRevealPlan, sliceRevealText } from "../tools/animationUtils";

/** Progressive reveal: d → de → den → … (chunked for long strings). */
export default {
    id: "typewriter",
    createPlan: ({ text, duration }) => buildRevealPlan(text, duration),
    getFrame: ({ text, step, plan }) => ({
        mode: "text",
        text: sliceRevealText(text, step, plan),
    }),
};
