import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../use", () => ({
    use: vi.fn(),
}));

vi.mock("../clientData", () => ({
    clientData: { __id: "clientDataStore" },
}));

import { use } from "../use";
import { clientData } from "../clientData";
import { useClient } from "./index.js";

describe("useClient", () => {
    beforeEach(() => {
        use.mockReset();
    });

    it("calls use(clientData, selector)", () => {
        const selector = vi.fn((s) => s);
        use.mockReturnValue({ winW: 100 });

        useClient(selector);

        expect(use).toHaveBeenCalledTimes(1);
        expect(use).toHaveBeenCalledWith(clientData, selector);
    });

    it("returns {} when use returns nullish", () => {
        use.mockReturnValue(undefined);
        expect(useClient()).toEqual({});

        use.mockReturnValue(null);
        expect(useClient()).toEqual({});
    });

    it("returns the selected state when use returns a value", () => {
        use.mockReturnValue({ winW: 123, winH: 456 });
        expect(useClient()).toEqual({ winW: 123, winH: 456 });
    });

    it("does not coerce falsy non-nullish values", () => {
        use.mockReturnValue(0);
        expect(useClient()).toBe(0);

        use.mockReturnValue("");
        expect(useClient()).toBe("");
    });
});
