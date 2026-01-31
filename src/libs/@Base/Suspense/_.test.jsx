import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuspenseWrapper } from "./index.jsx";

describe("SuspenseWrapper", () => {
    it("renders children directly when suspenseFallback is not provided", () => {
        render(
            <SuspenseWrapper>
                <div data-testid="child">Child</div>
            </SuspenseWrapper>,
        );

        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(screen.queryByTestId("fallback")).toBeNull();
    });

    it("renders fallback when child suspends and suspenseFallback is provided", () => {
        const Suspender = () => {
            throw new Promise(() => {});
        };

        render(
            <SuspenseWrapper suspenseFallback={<div data-testid="fallback">Loading</div>}>
                <Suspender />
            </SuspenseWrapper>,
        );

        expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });

    it("passes otherSuspenseProps to Suspense", async () => {
        vi.resetModules();

        const suspenseSpy = vi.fn();

        vi.doMock("react", async () => {
            const actual = await vi.importActual("react");
            return {
                ...actual,
                Suspense: (props) => {
                    suspenseSpy(props);
                    return props.children ?? null;
                },
            };
        });

        const mod = await import("./index.jsx");
        const Wrapped = mod.SuspenseWrapper;

        render(
            <Wrapped
                suspenseFallback={<div data-testid="fallback">Loading</div>}
                otherSuspenseProps={{ "data-x": "y" }}
            >
                <div data-testid="child">Child</div>
            </Wrapped>,
        );

        expect(suspenseSpy).toHaveBeenCalledTimes(1);
        const props = suspenseSpy.mock.calls[0][0];
        expect(props).toEqual(
            expect.objectContaining({
                fallback: expect.anything(),
                "data-x": "y",
            }),
        );
    });
});
