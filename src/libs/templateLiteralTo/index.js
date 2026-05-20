import { Fragment, createElement } from "react";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { dedent, splitParagraphs } from "./dedent";

const toParagraphNodes = (text, as = "p") => {
    const paragraphs = splitParagraphs(text);

    if (paragraphs.length === 0) return null;

    if (as === "span") {
        return createElement(
            Flex.column,
            { gap: 4 },
            ...paragraphs.map((para, index) =>
                createElement(Typo.span, { key: index }, para),
            ),
        );
    }

    if (paragraphs.length === 1) {
        return createElement(Typo.p, { key: 0 }, paragraphs[0]);
    }

    return createElement(
        Fragment,
        null,
        ...paragraphs.map((para, index) =>
            createElement(
                Typo.p,
                {
                    key: index,
                    margin: index < paragraphs.length - 1 ? "0 0 1em 0" : 0,
                },
                para,
            ),
        ),
    );
};

const templateLiteralTo = (text, mode = "pre") => {
    const key = String(mode);
    if (key === "p") return templateLiteralTo.p(text);
    if (key === "span") return templateLiteralTo.span(text);
    return templateLiteralTo.pre(text);
};

templateLiteralTo.pre = (text) => dedent(text);

templateLiteralTo.p = (text) => toParagraphNodes(text, "p");

templateLiteralTo.span = (text) => toParagraphNodes(text, "span");

export { dedent, splitParagraphs, templateLiteralTo };
export default templateLiteralTo;
