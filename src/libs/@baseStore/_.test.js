import { describe, it, expect } from "vitest";

import { baseStore } from "./index";

import { clientData } from "./clientData";
import { create } from "./create";
import { globalData } from "./globalData";
import { reactRouterDomData } from "./reactRouterDomData";
import { use } from "./use";
import { useClient } from "./useClient";
import { useGlobal } from "./useGlobal";
import { useLocal } from "./useLocal";
import { useReactRouterDom } from "./useReactRouterDom";

describe("baseStore namespace", () => {
    it("exposes expected keys", () => {
        expect(Object.keys(baseStore).sort()).toEqual(
            [
                "clientData",
                "create",
                "globalData",
                "reactRouterDomData",
                "use",
                "useClient",
                "useGlobal",
                "useLocal",
                "useReactRouterDom",
            ].sort(),
        );
    });

    it("re-exports exact module references", () => {
        expect(baseStore.create).toBe(create);
        expect(baseStore.clientData).toBe(clientData);
        expect(baseStore.globalData).toBe(globalData);
        expect(baseStore.reactRouterDomData).toBe(reactRouterDomData);
        expect(baseStore.use).toBe(use);
        expect(baseStore.useClient).toBe(useClient);
        expect(baseStore.useGlobal).toBe(useGlobal);
        expect(baseStore.useLocal).toBe(useLocal);
        expect(baseStore.useReactRouterDom).toBe(useReactRouterDom);
    });

    it("create returns a store with core methods", () => {
        const store = baseStore.create({ a: 1 });

        expect(typeof store.id).toBe("string");
        expect(typeof store.get).toBe("function");
        expect(typeof store.set).toBe("function");
        expect(typeof store.subscribe).toBe("function");
        expect(typeof store.getVersion).toBe("function");

        expect(store.get()).toEqual({ a: 1 });
    });

    it("global stores expose store shape", () => {
        for (const s of [
            baseStore.clientData,
            baseStore.globalData,
            baseStore.reactRouterDomData,
        ]) {
            expect(typeof s.get).toBe("function");
            expect(typeof s.set).toBe("function");
            expect(typeof s.subscribe).toBe("function");
        }
    });
});
