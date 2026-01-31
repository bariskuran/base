import { describe, it, expect, vi } from "vitest";
import { sleep } from "./index";

describe("sleep", () => {
    it("resolves after the specified delay", async () => {
        vi.useFakeTimers();

        const spy = vi.fn();

        const promise = sleep(500).then(spy);

        expect(spy).not.toHaveBeenCalled();

        vi.advanceTimersByTime(499);
        await Promise.resolve();
        expect(spy).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        await promise;

        expect(spy).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });

    it("returns a Promise", () => {
        const result = sleep(10);
        expect(result).toBeInstanceOf(Promise);
    });

    it("resolves with undefined", async () => {
        vi.useFakeTimers();

        const p = sleep(100);
        vi.advanceTimersByTime(100);

        const result = await p;
        expect(result).toBeUndefined();

        vi.useRealTimers();
    });
});
