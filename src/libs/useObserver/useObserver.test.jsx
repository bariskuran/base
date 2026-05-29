import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useCallback, useState } from "react";
import { useObserver } from "./index";

const observe = vi.fn();
const disconnect = vi.fn();
let lastObserverInit = null;

beforeEach(() => {
    observe.mockClear();
    disconnect.mockClear();
    lastObserverInit = null;
    vi.stubGlobal(
        "IntersectionObserver",
        vi.fn(function IO(cb, init) {
            lastObserverInit = init;
            this.observe = (node) => {
                observe(node);
                cb([{ isIntersecting: false, target: node }]);
            };
            this.disconnect = disconnect;
        }),
    );
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("useObserver customViewport", () => {
    it("waits for customViewport element before observing", async () => {
        const onRoot = vi.fn();

        const Probe = () => {
            const [root, setRoot] = useState(null);
            const rootRef = useCallback((el) => {
                setRoot((prev) => (Object.is(prev, el) ? prev : el));
            }, []);

            const { ref: targetRef } = useObserver({
                customViewport: root,
                threshold: 0,
            });

            return (
                <div ref={rootRef} data-testid="root">
                    <div ref={targetRef} data-testid="target">
                        target
                    </div>
                </div>
            );
        };

        render(<Probe />);

        await act(async () => {
            await Promise.resolve();
        });

        expect(lastObserverInit?.root).toBeTruthy();
        expect(observe).toHaveBeenCalled();
    });

    it("maps legacy root and rootMargin options", async () => {
        const Probe = () => {
            const [root, setRoot] = useState(null);
            const rootRef = useCallback((el) => {
                setRoot((prev) => (Object.is(prev, el) ? prev : el));
            }, []);

            const { ref: targetRef } = useObserver({
                root,
                rootMargin: -12,
                threshold: 0,
            });

            return (
                <div ref={rootRef}>
                    <span ref={targetRef}>x</span>
                </div>
            );
        };

        render(<Probe />);

        await act(async () => {
            await Promise.resolve();
        });

        expect(lastObserverInit?.root).toBeTruthy();
        expect(lastObserverInit?.rootMargin).toBe("-12px");
    });
});
