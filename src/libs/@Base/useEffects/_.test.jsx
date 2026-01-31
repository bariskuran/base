import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";

vi.mock("../../logReferrers", () => ({
    logReferrers: vi.fn(),
}));

import { logReferrers } from "../../logReferrers";
import { useEffects } from "./index.js";

describe("useEffects", () => {
    beforeEach(() => {
        delete window.console.ref;
    });

    it("assigns window.console.ref to logReferrers on mount", () => {
        const TestComponent = () => {
            useEffects();
            return null;
        };

        render(<TestComponent />);

        expect(window.console.ref).toBe(logReferrers);
    });
});
