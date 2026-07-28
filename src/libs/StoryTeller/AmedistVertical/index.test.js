import { describe, expect, it } from "vitest";
import { normalizeVerticalTextItem, splitVerticalText } from ".";

describe("StoryTeller AmedistVertical text", () => {
    it.each([
        [[], 0, 0],
        [["a"], 1, 0],
        [["a", "b"], 1, 1],
        [["a", "b", "c"], 2, 1],
        [["a", "b", "c", "d"], 2, 2],
    ])("splits %p into %i and %i items", (input, text1Count, text2Count) => {
        const [text1, text2] = splitVerticalText(input);
        expect(text1).toHaveLength(text1Count);
        expect(text2).toHaveLength(text2Count);
    });

    it("keeps classic items as paragraphs", () => {
        expect(normalizeVerticalTextItem("classic text")).toEqual({
            as: "p",
            data: "classic text",
            settings: {},
        });
    });

    it("extracts the Typo variant and forwards remaining settings", () => {
        expect(
            normalizeVerticalTextItem({
                as: "h3",
                data: "Title",
                color: "primary",
                weight: 700,
            }),
        ).toEqual({
            as: "h3",
            data: "Title",
            settings: { color: "primary", weight: 700 },
        });
    });
});
