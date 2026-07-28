import { describe, expect, it } from "vitest";
import { getObserverDirection, getObserverPhase } from ".";

const rootBounds = {
    top: 0,
    right: 1000,
    bottom: 800,
    left: 0,
    width: 1000,
    height: 800,
};

const createEntry = ({
    isIntersecting = true,
    intersectionRatio = 0.5,
    top = 300,
    left = 400,
    width = 200,
    height = 200,
} = {}) => ({
    isIntersecting,
    intersectionRatio,
    rootBounds,
    boundingClientRect: {
        top,
        right: left + width,
        bottom: top + height,
        left,
        width,
        height,
    },
});

describe("useObserver motion helpers", () => {
    it("distinguishes entering, inside, exiting, and outside phases", () => {
        expect(
            getObserverPhase({
                entry: createEntry({ intersectionRatio: 0.2 }),
                previousRatio: 0,
                previousIntersecting: false,
            }),
        ).toBe("entering");
        expect(
            getObserverPhase({
                entry: createEntry({ intersectionRatio: 1 }),
                previousRatio: 0.8,
                previousIntersecting: true,
            }),
        ).toBe("inside");
        expect(
            getObserverPhase({
                entry: createEntry({ intersectionRatio: 0.3 }),
                previousRatio: 0.5,
                previousIntersecting: true,
            }),
        ).toBe("exiting");
        expect(
            getObserverPhase({
                entry: createEntry({ isIntersecting: false, intersectionRatio: 0 }),
                previousRatio: 0.2,
                previousIntersecting: true,
            }),
        ).toBe("outside");
    });

    it("resolves the viewport edge nearest to the observed item", () => {
        expect(getObserverDirection(createEntry({ top: -120 }))).toBe("top");
        expect(getObserverDirection(createEntry({ top: 720 }))).toBe("bottom");
        expect(getObserverDirection(createEntry({ top: 300, left: -180 }))).toBe("left");
        expect(getObserverDirection(createEntry({ top: 300, left: 980 }))).toBe("right");
    });
});
