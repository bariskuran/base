import { describe, it, expect } from "vitest";
import { sortFunction } from "./index";

describe("sortFunction", () => {
    it("sorts numbers ascending", () => {
        expect([1, 10, 2].sort(sortFunction.asc)).toEqual([1, 2, 10]);
    });

    it("sorts numbers descending", () => {
        expect([1, 10, 2].sort(sortFunction.desc)).toEqual([10, 2, 1]);
    });

    it("sorts numeric strings ascending (numerically, not lexicographically)", () => {
        expect(["10", "2", "1"].sort(sortFunction.asc)).toEqual(["1", "2", "10"]);
    });

    it("sorts numeric strings descending (numerically, not lexicographically)", () => {
        expect(["10", "2", "1"].sort(sortFunction.desc)).toEqual(["10", "2", "1"]);
    });

    it("sorts strings with numeric prefixes ascending", () => {
        expect(["10px", "2px", "1px"].sort(sortFunction.asc)).toEqual(["1px", "2px", "10px"]);
    });

    it("sorts strings with numeric prefixes descending", () => {
        expect(["10px", "2px", "1px"].sort(sortFunction.desc)).toEqual(["10px", "2px", "1px"]);
    });

    it("sorts alphabetic strings case-insensitively", () => {
        expect(["b", "A", "c"].sort(sortFunction.asc)).toEqual(["A", "b", "c"]);
        expect(["b", "A", "c"].sort(sortFunction.desc)).toEqual(["c", "b", "A"]);
    });

    it("handles mixed text/number segments naturally", () => {
        expect(["file2", "file10", "file1"].sort(sortFunction.asc)).toEqual([
            "file1",
            "file2",
            "file10",
        ]);
        expect(["file2", "file10", "file1"].sort(sortFunction.desc)).toEqual([
            "file10",
            "file2",
            "file1",
        ]);
    });

    it("keeps original order when comparator treats values as equal (e.g. 0 vs 00)", () => {
        const input = ["a0", "a00", "a"];
        expect(input.slice().sort(sortFunction.desc)).toEqual(["a0", "a00", "a"]);
    });

    it("treats different types by their string forms but still uses numeric chunks", () => {
        expect([10, "2", 1].sort(sortFunction.asc)).toEqual([1, "2", 10]);
        expect([10, "2", 1].sort(sortFunction.desc)).toEqual([10, "2", 1]);
    });

    it("is stable for equal values in terms of comparator output", () => {
        const arr = ["a1", "a1", "a1"];
        const outAsc = arr.slice().sort(sortFunction.asc);
        const outDesc = arr.slice().sort(sortFunction.desc);
        expect(outAsc).toEqual(["a1", "a1", "a1"]);
        expect(outDesc).toEqual(["a1", "a1", "a1"]);
    });
});
