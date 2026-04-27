import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./tools/_Base.jsx";

const jointH = {
    lineHeight: 1.3,
    weight: 300,
};

export const Typo = componentCreator({
    name: "Typo",
    BaseComp: Base,
    variants: {
        h1: { as: "h1", size: "190%", ...jointH },
        h2: { as: "h2", size: "175%", ...jointH },
        h3: { as: "h3", size: "160%", ...jointH },
        h4: { as: "h4", size: "145%", ...jointH },
        h5: { as: "h5", size: "130%", lineHeight: 1.2 },
        h6: { as: "h6", size: "115%", lineHeight: 1.2 },
        p: { as: "p" },
        span: { as: "span" },
        quote: { as: "blockquote", size: "110%", enableQuoteMarks: true },
        sub: { size: "70%" },
        bold: { bold: true },
        italic: { italic: true },
        pre: { as: "pre" },
    },
});
