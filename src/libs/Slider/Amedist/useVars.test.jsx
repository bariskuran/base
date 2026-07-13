import { describe, expect, it } from "vitest";
import { resolveSlideImageTiming } from "./useVars";

const image = (overrides = {}) => ({ src: "image.webp", ...overrides });

describe("Slider.amedist image timing", () => {
    it("uses itemDurationSec for scheduling and itemAnimationSec for animation speed", () => {
        const timing = resolveSlideImageTiming(
            {
                image: [image({ itemDurationSec: 2 }), image()],
            },
            {
                slideDurationSec: 4,
                itemDurationSec: 1,
                itemAnimationSec: 0.5,
                itemCrossFadeSec: 0,
            },
        );

        expect(timing.layers).toEqual([
            { durationMs: 500, delayMs: 0 },
            { durationMs: 500, delayMs: 2000 },
        ]);
    });

    it("clamps animation duration to the resolved item duration", () => {
        const timing = resolveSlideImageTiming(
            { image: [image({ itemDurationSec: 0.3, itemAnimationSec: 2 })] },
            { slideDurationSec: 2 },
        );

        expect(timing.layers[0].durationMs).toBe(300);
    });

    it("fits the sum of item durations into slideDurationSec", () => {
        const timing = resolveSlideImageTiming(
            { image: [image(), image()] },
            {
                slideDurationSec: 3,
                itemDurationSec: 2,
                itemAnimationSec: 0.5,
                itemCrossFadeSec: 0,
            },
        );

        expect(timing.layers).toEqual([
            { durationMs: 500, delayMs: 0 },
            { durationMs: 500, delayMs: 1500 },
        ]);
    });

    it("applies itemCrossFadeSec only as overlap between item schedules", () => {
        const timing = resolveSlideImageTiming(
            { image: [image(), image()] },
            {
                slideDurationSec: 4,
                itemDurationSec: 2,
                itemAnimationSec: 0.5,
                itemCrossFadeSec: 0.4,
            },
        );

        expect(timing.layers).toEqual([
            { durationMs: 500, delayMs: 0 },
            { durationMs: 500, delayMs: 1600 },
        ]);
    });
});
