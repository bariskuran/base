import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../create", () => ({
    create: vi.fn((init) => ({ __init: init })),
}));

import { getClientData } from "./getClientData.js";
import { clientData } from "./index.js";
import { create } from "../create";

describe("clientData", () => {
    const originalInnerWidth = globalThis.window?.innerWidth;
    const originalInnerHeight = globalThis.window?.innerHeight;
    const originalMatchMedia = globalThis.window?.matchMedia;
    const originalDevicePixelRatio = globalThis.window?.devicePixelRatio;
    const originalScreen = globalThis.window?.screen;

    beforeEach(() => {
        vi.restoreAllMocks();

        if (!globalThis.window) globalThis.window = {};
        if (!globalThis.document) globalThis.document = { documentElement: {} };
        if (!globalThis.navigator) globalThis.navigator = {};

        globalThis.window.innerWidth = 1200;
        globalThis.window.innerHeight = 800;
        Object.defineProperty(globalThis.document.documentElement, "clientWidth", {
            value: 0,
            configurable: true,
        });
        Object.defineProperty(globalThis.document.documentElement, "clientHeight", {
            value: 0,
            configurable: true,
        });

        globalThis.window.devicePixelRatio = 2;

        globalThis.window.screen = {
            orientation: { type: "landscape-primary" },
        };

        globalThis.window.matchMedia = vi.fn((query) => ({
            matches:
                query === "(prefers-color-scheme: dark)"
                    ? true
                    : query === "(prefers-reduced-motion: reduce)"
                      ? false
                      : query === "(prefers-contrast: more)"
                        ? true
                        : query === "(pointer: coarse)"
                          ? false
                          : false,
        }));

        Object.defineProperty(globalThis.navigator, "language", {
            value: "en-GB",
            configurable: true,
        });
        Object.defineProperty(globalThis.navigator, "userAgent", {
            value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
            configurable: true,
        });
        Object.defineProperty(globalThis.navigator, "onLine", { value: false, configurable: true });
        Object.defineProperty(globalThis.navigator, "maxTouchPoints", {
            value: 0,
            configurable: true,
        });

        Object.defineProperty(globalThis.navigator, "connection", {
            value: {
                effectiveType: "4g",
                downlink: 10,
                rtt: 50,
                saveData: false,
            },
            configurable: true,
        });

        Object.defineProperty(globalThis.navigator, "deviceMemory", {
            value: 8,
            configurable: true,
        });
        Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
            value: 12,
            configurable: true,
        });
    });

    afterEach(() => {
        if (originalInnerWidth !== undefined) globalThis.window.innerWidth = originalInnerWidth;
        if (originalInnerHeight !== undefined) globalThis.window.innerHeight = originalInnerHeight;
        globalThis.window.matchMedia = originalMatchMedia;
        if (originalDevicePixelRatio !== undefined)
            globalThis.window.devicePixelRatio = originalDevicePixelRatio;
        if (originalScreen !== undefined) globalThis.window.screen = originalScreen;
    });

    it("initializes clientData store via create({})", () => {
        expect(create).toHaveBeenCalledTimes(1);
        expect(create).toHaveBeenCalledWith({});
        expect(clientData).toEqual({ __init: {} });
    });

    it("returns a shaped object in the browser environment", () => {
        const breakpoints = {
            phone: [0, 600],
            tablet: [600, 900],
            desktop: [900, 99999],
        };

        const out = getClientData({
            breakpoints,
            maxAspRatio: 0.5,
            minAspRatio: 2.5,
        });

        expect(out.winW).toBe(1200);
        expect(out.winH).toBe(800);
        expect(out.aspectRatio).toBe(1.5);

        expect(out.language).toBe("en-GB");

        expect(out.MAX_ASP_RATIO).toBe(0.5);
        expect(out.MIN_ASP_RATIO).toBe(2.5);
        expect(out.isOutOfRatio).toBe(false);
        expect(out.isSafeSize).toBe(true);

        expect(out.currentBreakpoint).toBe("desktop");
        expect(out.isMobile).toBe(false);

        expect(out.device).toBe("mac");
        expect(out.os).toBe("macOsX");
        expect(out.browser).toBe("safari");

        expect(out.dpr).toBe(2);
        expect(out.isRetina).toBe(true);
        expect(out.orientation).toBe("landscape-primary");

        expect(out.prefersDark).toBe(true);
        expect(out.prefersReducedMotion).toBe(false);
        expect(out.prefersContrastMore).toBe(true);

        expect(out.online).toBe(false);
        expect(out.connection).toEqual(
            expect.objectContaining({
                effectiveType: "4g",
                downlink: 10,
                rtt: 50,
                saveData: false,
            }),
        );

        expect(out.deviceMemory).toBe(8);
        expect(out.hardwareConcurrency).toBe(12);

        expect(out.maxTouchPoints).toBe(0);
        expect(out.hasTouch).toBe(false);
        expect(out.pointerCoarse).toBe(false);

        expect(typeof out.timeZone).toBe("string");
        expect(typeof out.utcOffsetMinutes).toBe("number");
        expect(typeof out.utcOffsetHours).toBe("number");
    });

    it("uses documentElement client sizes when innerWidth/innerHeight are missing", () => {
        globalThis.window.innerWidth = 0;
        globalThis.window.innerHeight = 0;
        Object.defineProperty(document.documentElement, "clientWidth", {
            value: 500,
            configurable: true,
        });
        Object.defineProperty(document.documentElement, "clientHeight", {
            value: 1000,
            configurable: true,
        });

        const out = getClientData();

        expect(out.winW).toBe(500);
        expect(out.winH).toBe(1000);
        expect(out.aspectRatio).toBe(0.5);
        expect(out.isMobile).toBe(true);
    });

    it("handles missing navigator connection fields safely", () => {
        Object.defineProperty(globalThis.navigator, "connection", {
            value: null,
            configurable: true,
        });

        const out = getClientData();

        expect(out.connection).toBeNull();
    });

    it("returns SSR-safe defaults when window/navigator are not available", () => {
        const prevWindow = globalThis.window;
        const prevNavigator = globalThis.navigator;

        try {
            delete globalThis.window;
            delete globalThis.navigator;

            const out = getClientData({
                breakpoints: { a: [0, 99999] },
                maxAspRatio: 0.25,
                minAspRatio: 3,
            });

            expect(out).toEqual(
                expect.objectContaining({
                    winW: 0,
                    winH: 0,
                    aspectRatio: 0,
                    language: "undefined",
                    timeZone: "undefined",
                    utcOffsetMinutes: 0,
                    utcOffsetHours: 0,

                    MAX_ASP_RATIO: 0.25,
                    MIN_ASP_RATIO: 3,

                    isOutOfRatio: false,
                    isSafeSize: true,
                    currentBreakpoint: "Not found",
                    isMobile: false,

                    device: "unknown",
                    os: "unknown",
                    browser: "unknown",

                    dpr: 1,
                    isRetina: false,
                    orientation: "unknown",

                    prefersDark: false,
                    prefersReducedMotion: false,
                    prefersContrastMore: false,

                    online: true,
                    connection: null,
                    deviceMemory: null,
                    hardwareConcurrency: null,
                    maxTouchPoints: 0,
                    hasTouch: false,
                    pointerCoarse: false,
                }),
            );
        } finally {
            globalThis.window = prevWindow;
            globalThis.navigator = prevNavigator;
        }
    });
});
