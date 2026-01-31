import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { GlobalDataProvider } from "./index";
import { baseStore } from "../../@baseStore";

describe("GlobalDataProvider", () => {
    beforeEach(() => {
        baseStore.globalData.set({});
        vi.clearAllMocks();
    });

    it("sets globalCoreStoreVariables to baseStore when provided", () => {
        const globalCoreStoreVariables = { user: "test", lang: "tr" };

        render(<GlobalDataProvider globalCoreStoreVariables={globalCoreStoreVariables} />);

        const storedData = baseStore.globalData.get();
        expect(storedData).toMatchObject({
            ...globalCoreStoreVariables,
        });
    });

    it("merges with existing globalData instead of replacing", () => {
        baseStore.globalData.set({ existing: "data", count: 1 });

        const globalCoreStoreVariables = { count: 2, new: "value" };

        render(<GlobalDataProvider globalCoreStoreVariables={globalCoreStoreVariables} />);

        const storedData = baseStore.globalData.get();
        expect(storedData).toMatchObject({
            existing: "data",
            count: 2,
            new: "value",
        });
    });

    it("does not set data when globalCoreStoreVariables is not an object", () => {
        const initialData = { existing: "data" };
        baseStore.globalData.set(initialData);
        const initialStoreSnapshot = { ...baseStore.globalData.get() };

        render(<GlobalDataProvider globalCoreStoreVariables={null} />);
        const afterNull = baseStore.globalData.get();
        expect(afterNull.existing).toBe(initialData.existing);
        expect(afterNull.theme).toEqual(initialStoreSnapshot.theme);

        baseStore.globalData.set(initialData);
        const beforeString = { ...baseStore.globalData.get() };
        render(<GlobalDataProvider globalCoreStoreVariables="string" />);
        const afterString = baseStore.globalData.get();
        expect(afterString.existing).toBe(initialData.existing);
        expect(afterString.theme).toEqual(beforeString.theme);

        baseStore.globalData.set(initialData);
        const beforeNumber = { ...baseStore.globalData.get() };
        render(<GlobalDataProvider globalCoreStoreVariables={123} />);
        const afterNumber = baseStore.globalData.get();
        expect(afterNumber.existing).toBe(initialData.existing);
        expect(afterNumber.theme).toEqual(beforeNumber.theme);
    });

    it("updates store when globalCoreStoreVariables changes", () => {
        const { rerender } = render(<GlobalDataProvider globalCoreStoreVariables={{ step: 1 }} />);

        expect(baseStore.globalData.get().step).toBe(1);

        rerender(<GlobalDataProvider globalCoreStoreVariables={{ step: 2 }} />);

        expect(baseStore.globalData.get().step).toBe(2);
    });

    it("renders nothing (returns null)", () => {
        const { container } = render(<GlobalDataProvider globalCoreStoreVariables={{}} />);
        expect(container.firstChild).toBeNull();
    });
});
