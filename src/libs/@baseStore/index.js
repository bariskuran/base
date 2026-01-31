import { clientData } from "./clientData";
import { create } from "./create";
import { globalData } from "./globalData";
import { reactRouterDomData } from "./reactRouterDomData";
import { use } from "./use";
import { useClient } from "./useClient";
import { useGlobal } from "./useGlobal";
import { useLocal } from "./useLocal";
import { useReactRouterDom } from "./useReactRouterDom";
import { notifierData } from "./notifierData";
import { useNotifier } from "./useNotifier";

/**
 * baseStore namespace object.
 *
 * Provides a small, dependency-free store system that can be used from both React components
 * and isolated (non-React) functions.
 *
 * Exposes:
 * - `baseStore.create(...)`      -> create a store instance
 * - `baseStore.clientData(...)`  -> get client/environment snapshot (SSR-safe)
 * - `baseStore.globalData(...)`  -> access your global data store/helpers (project-specific)
 * - `baseStore.use(...)`         -> subscribe to a store (returns current state)
 * - `baseStore.useClient(...)`   -> React hook for client data (project-specific)
 * - `baseStore.useGlobal(...)`   -> React hook for global store (project-specific)
 * - `baseStore.useLocal(...)`    -> React hook for local/page store (project-specific)
 * - `baseStore.reactRouterDomData(...)` -> React hook for react-router-dom data (project-specific)
 * - `baseStore.useReactRouterDom(...)` -> React hook for react-router-dom data (project-specific)
 *
 * @type {{
 *   create: <T>(initialState?: T) => {
 *     id: string,
 *     get: () => T,
 *     set: (updater: ((draft: T) => void) | Partial<T> | T) => T,
 *     subscribe: (listener: (next: T, prev: T) => void) => () => void,
 *     getVersion: () => number,
 *   },
 *   clientData: (...args: any[]) => any,
 *   globalData: (...args: any[]) => any,
 *   reactRouterDomData: (...args: any[]) => any,
 *   use: (store: { subscribe: Function, get: Function }, selector?: Function) => any,
 *   useClient: (...args: any[]) => any,
 *   useGlobal: (...args: any[]) => any,
 *   useLocal: (...args: any[]) => any,
 *   useReactRouterDom: (...args: any[]) => any,
 * }}
 *
 * @example for CREATE
 * const counterStore = baseStore.create({ count: 0, nested: {} });
 *
 * @example for GET
 * const snapshot = counterStore.get();
 *
 * @example for SET
 * counterStore.set((d) => {
 *   d.count = d.count + 1;
 * });
 * counterStore.set((d) => {
 *   d.nested.a.b.c = 1;
 * });
 * counterStore.set({ count: 10 });
 *
 * @example for SUBSCRIBE (Subscribe outside React)
 * const unsubscribe = counterStore.subscribe((next, prev) => {
 *   console.log("changed:", prev.count, "->", next.count);
 * });
 * // later: unsubscribe();
 *
 * @example for USE
 * const { count } = baseStore.use(counterStore, optionalSelector);
 *
 * @example for LOCAL - creating a store and selector doesn't necessery.
 * const { setLocal, ...allValues } = baseStore.useLocal(initialValues || {});
 * setLocal... // set method is the same.
 *
 * @example for CLIENT DATA & GLOBALDATA & NOTIFIER DATA
 * const cd = baseStore.clientData();
 * const global = baseStore.useGlobal();
 * const [ winW ] = baseStore.clientData(s=>[s.winW]);
 * const notifier = baseStore.useNotifier();
 * const [ A , set ] = baseStore.useNotifier(s=>[s.A]);
 * const { A, B, C, set } = baseStore.useNotifier();
 *
 */
export const baseStore = {
    create,
    clientData,
    globalData,
    notifierData,
    reactRouterDomData,
    use,
    useClient,
    useGlobal,
    useLocal,
    useReactRouterDom,
    useNotifier,
};
