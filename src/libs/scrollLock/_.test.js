import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../@baseStore", () => {
    const setSpy = vi.fn();
    return {
        __setSpy: setSpy,
        baseStore: {
            globalData: {
                set: setSpy,
            },
        },
    };
});

import { scrollLock } from "./index";
import { __setSpy } from "../@baseStore";

describe("scrollLock", () => {
    beforeEach(() => {
        __setSpy.mockClear();
        document.body.style.overflow = "";
        document.body.style.overflowY = "";
    });

    it("sets baseStore.globalData.isScrollLocked true/false", () => {
        scrollLock(true);
        expect(__setSpy).toHaveBeenCalledWith({ isScrollLocked: true });

        scrollLock(false);
        expect(__setSpy).toHaveBeenCalledWith({ isScrollLocked: false });
    });

    it("locks scrolling by setting body overflow and overflowY to hidden", () => {
        document.body.style.overflow = "auto";
        document.body.style.overflowY = "scroll";

        scrollLock(true);

        expect(document.body.style.overflow).toBe("hidden");
        expect(document.body.style.overflowY).toBe("hidden");
    });

    it("restores previous inline values on unlock", () => {
        document.body.style.overflow = "auto";
        document.body.style.overflowY = "scroll";

        scrollLock(true);

        document.body.style.overflow = "hidden";
        document.body.style.overflowY = "hidden";

        scrollLock(false);

        expect(document.body.style.overflow).toBe("auto");
        expect(document.body.style.overflowY).toBe("scroll");
    });

    it("does not overwrite stored previous values when called multiple times while locked", () => {
        document.body.style.overflow = "auto";
        document.body.style.overflowY = "scroll";

        scrollLock(true);

        document.body.style.overflow = "visible";
        document.body.style.overflowY = "visible";

        scrollLock(true);

        scrollLock(false);

        expect(document.body.style.overflow).toBe("auto");
        expect(document.body.style.overflowY).toBe("scroll");
    });

    it("is safe when document is undefined (SSR-like) but still sets global flag", () => {
        const originalDocument = globalThis.document;

        Object.defineProperty(globalThis, "document", {
            value: undefined,
            configurable: true,
        });

        expect(() => scrollLock(true)).not.toThrow();
        expect(__setSpy).toHaveBeenCalledWith({ isScrollLocked: true });

        Object.defineProperty(globalThis, "document", {
            value: originalDocument,
            configurable: true,
        });
    });
});
