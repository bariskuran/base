import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorWrapper } from "./index";

const Boom = () => {
    throw new Error("boom");
};

describe("ErrorWrapper", () => {
    it("renders children directly when errorFallback is not provided", () => {
        render(
            <ErrorWrapper>
                <div>OK</div>
            </ErrorWrapper>,
        );

        expect(screen.getByText("OK")).toBeInTheDocument();
    });

    it("renders fallback when child throws and errorFallback is provided", () => {
        render(
            <ErrorWrapper errorFallback={<div data-testid="fallback">Fallback UI</div>}>
                <Boom />
            </ErrorWrapper>,
        );

        expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });
});
