// eslint-disable-next-line no-unused-vars
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";

// 1) getClientData mock
vi.mock("../../@baseStore/clientData/getClientData", () => ({
    getClientData: vi.fn(() => ({ winW: 123, winH: 456 })),
}));

// 2) useEventListener mock (we will capture handler and allow manual trigger)
let _listener = null;
vi.mock("../../useEventListener", () => ({
    useEventListener: vi.fn((event, handler) => {
        if (event === "resize") _listener = handler;
    }),
}));

// 3) baseStore mock (only what we need)
const setSpy = vi.fn();
vi.mock("../../@baseStore", () => ({
    baseStore: {
        clientData: { set: (...args) => setSpy(...args) },
    },
}));

import { getClientData } from "../../@baseStore/clientData/getClientData";
import { ClientDataProvider } from "./index.js";
import { useEventListener } from "../../useEventListener";

describe("ClientDataProvider", () => {
    beforeEach(() => {
        setSpy.mockClear();
        getClientData.mockClear();
        _listener = null;
    });

    it("calls getClientData + baseStore.clientData.set on mount", () => {
        render(<ClientDataProvider />);

        expect(getClientData).toHaveBeenCalledTimes(1);
        expect(setSpy).toHaveBeenCalledTimes(1);
        expect(setSpy).toHaveBeenCalledWith({ winW: 123, winH: 456 });
    });

    it("calls update again on resize", () => {
        render(<ClientDataProvider />);

        expect(setSpy).toHaveBeenCalledTimes(1);

        act(() => {
            _listener?.();
        });

        expect(getClientData).toHaveBeenCalledTimes(2);
        expect(setSpy).toHaveBeenCalledTimes(2);
    });

    it("recomputes when props change", () => {
        const { rerender } = render(<ClientDataProvider maxAspRatio={1} />);

        expect(getClientData).toHaveBeenCalledTimes(1);

        rerender(<ClientDataProvider maxAspRatio={2} />);

        expect(getClientData).toHaveBeenCalledTimes(2);
    });

    it("passes breakpoints/maxAspRatio/minAspRatio into getClientData", () => {
        const breakpoints = { xs: [0, 600] };
        render(<ClientDataProvider breakpoints={breakpoints} maxAspRatio={0.5} minAspRatio={2} />);

        expect(getClientData).toHaveBeenCalledWith({
            breakpoints,
            maxAspRatio: 0.5,
            minAspRatio: 2,
        });
    });

    it("wires resize listener with updateClientData", () => {
        render(<ClientDataProvider />);

        expect(useEventListener).toHaveBeenCalled();
        expect(useEventListener).toHaveBeenCalledWith("resize", expect.any(Function), {
            getFirst: false,
        });

        const [, handler] = useEventListener.mock.calls.find((c) => c[0] === "resize");
        act(() => handler());
        expect(setSpy).toHaveBeenCalledTimes(2);
    });
});
