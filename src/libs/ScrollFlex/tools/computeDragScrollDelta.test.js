import { describe, it, expect } from "vitest";
import { computeDragScrollFromPointers } from "./computeDragScrollDelta";

describe("computeDragScrollFromPointers", () => {
    it("imleç sağa kaydıkça scrollLeft azalır (içerik sağa çekilir)", () => {
        const next = computeDragScrollFromPointers(
            { x: 100, y: 50 },
            { x: 130, y: 50 },
            { scrollLeft: 10, scrollTop: 20 },
        );
        expect(next).toEqual({ scrollLeft: -20, scrollTop: 20 });
    });

    it("hem x hem y ekseninde uygular", () => {
        const next = computeDragScrollFromPointers(
            { x: 0, y: 0 },
            { x: 5, y: 8 },
            { scrollLeft: 100, scrollTop: 200 },
        );
        expect(next).toEqual({ scrollLeft: 95, scrollTop: 192 });
    });
});
