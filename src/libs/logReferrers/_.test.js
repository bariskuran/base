import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../@baseStore", () => ({
    baseStore: {
        globalData: {
            get: vi.fn(),
        },
    },
}));

import { baseStore } from "../@baseStore";
import { logReferrers } from "./index";

describe("logReferrers", () => {
    const originalConsoleLog = console.log;

    beforeEach(() => {
        console.log = vi.fn();
        baseStore.globalData.get.mockClear();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    it("does nothing when isDevMode is false", () => {
        baseStore.globalData.get.mockReturnValue({ isDevMode: false });

        logReferrers("x", 1);

        expect(baseStore.globalData.get).toHaveBeenCalledTimes(1);
        expect(console.log).not.toHaveBeenCalled();
    });

    it("logs args and a stack when isDevMode is true", () => {
        baseStore.globalData.get.mockReturnValue({ isDevMode: true });

        logReferrers("recalc called", { a: 1 });

        expect(baseStore.globalData.get).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledTimes(1);

        const call = console.log.mock.calls[0];
        expect(call[0]).toBe("recalc called");
        expect(call[1]).toEqual({ a: 1 });

        const stackArg = call[2];
        expect(typeof stackArg).toBe("string");
        expect(stackArg.length).toBeGreaterThan(0);
    });

    it("treats missing isDevMode as false", () => {
        baseStore.globalData.get.mockReturnValue({});

        logReferrers("x");

        expect(console.log).not.toHaveBeenCalled();
    });
});
