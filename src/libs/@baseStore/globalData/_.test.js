import { describe, it, expect, vi } from "vitest";

vi.mock("../create", () => ({
    create: vi.fn(() => ({ __store: true })),
}));

vi.mock("../../../constants/DEFAULT_GLOBAL_CORESTORE_VARIABLES", () => ({
    DEFAULT_GLOBAL_CORESTORE_VARIABLES: { a: 1, b: { c: 2 } },
}));

import { create } from "../create";
import { DEFAULT_GLOBAL_CORESTORE_VARIABLES } from "../../../constants/DEFAULT_GLOBAL_CORESTORE_VARIABLES";
import { globalData } from "./index.js";

describe("globalData", () => {
    it("initializes globalData store via create(DEFAULT_GLOBAL_CORESTORE_VARIABLES)", () => {
        expect(create).toHaveBeenCalledTimes(1);
        expect(create).toHaveBeenCalledWith(DEFAULT_GLOBAL_CORESTORE_VARIABLES);
        expect(globalData).toEqual({ __store: true });
    });
});
