import { describe, it, expect, vi } from "vitest";

vi.mock("../create", () => ({
    create: vi.fn(() => ({ __store: true })),
}));

import { create } from "../create";
import { reactRouterDomData } from "./index.js";

describe("reactRouterDomData", () => {
    it("initializes reactRouterDomData store via create(initialState)", () => {
        expect(create).toHaveBeenCalledTimes(1);
        expect(create).toHaveBeenCalledWith({
            navigate: null,
            navigateWithSearch: null,
            location: null,
            useParams: {},
            searchParams: {},
        });
        expect(reactRouterDomData).toEqual({ __store: true });
    });
});
