import { describe, expect, it } from "vitest";
import { normalizeSlideNumber } from "./useVars";

describe("StoryTeller.amedist slide number", () => {
    it.each([
        [undefined, 4, 1],
        ["", 4, 1],
        ["not-a-number", 4, 1],
        [0, 4, 1],
        [-1, 4, 1],
        [5, 4, 1],
        [1.5, 4, 1],
        ["2", 4, 2],
        [3, 4, 3],
    ])("normalizes %p with %i slides to %i", (value, slideCount, expected) => {
        expect(normalizeSlideNumber(value, slideCount)).toBe(expected);
    });
});
