import { describe, it, expect, vi, beforeEach } from "vitest";

const useMock = vi.fn();

vi.mock("../use", () => ({
    use: (...args) => useMock(...args),
}));

vi.mock("../globalData", () => ({
    globalData: { __id: "globalData" },
}));

import { useGlobal } from "./index";
import { globalData } from "../globalData";

describe("useGlobal", () => {
    beforeEach(() => {
        useMock.mockReset();
    });

    it("calls use(globalData, selector)", () => {
        const selector = vi.fn((s) => s);
        useMock.mockReturnValue({ a: 1 });

        useGlobal(selector);

        expect(useMock).toHaveBeenCalledTimes(1);
        expect(useMock).toHaveBeenCalledWith(globalData, selector);
    });

    it("returns {} when use() returns undefined", () => {
        useMock.mockReturnValue(undefined);
        expect(useGlobal()).toEqual({});
    });

    it("returns {} when use() returns null", () => {
        useMock.mockReturnValue(null);
        expect(useGlobal()).toEqual({});
    });

    it("does not coerce falsy non-nullish values", () => {
        useMock.mockReturnValue(0);
        expect(useGlobal()).toBe(0);

        useMock.mockReturnValue("");
        expect(useGlobal()).toBe("");

        useMock.mockReturnValue(false);
        expect(useGlobal()).toBe(false);
    });

    it("returns the value when it is an object", () => {
        const obj = { x: 1 };
        useMock.mockReturnValue(obj);
        expect(useGlobal()).toBe(obj);
    });
});
