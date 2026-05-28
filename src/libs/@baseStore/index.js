import { create } from "./create";
import { globalData } from "./globalData";
import { use } from "./use";
import { useGlobal } from "./useGlobal";
import { useLocal } from "./useLocal";

/**
 * baseStore namespace object.
 *
 * Provides a small, dependency-free store system that can be used from both React components
 * and isolated (non-React) functions.
 *
 * Exposes:
 * - `baseStore.create(...)`      -> create a store instance
 * - `baseStore.globalData(...)`  -> access your global data store/helpers (project-specific)
 * - `baseStore.use(...)`         -> subscribe to a store (returns current state)
 * - `baseStore.useGlobal(...)`   -> React hook for global store (project-specific)
 * - `baseStore.useLocal(...)`    -> React hook for local/page store (project-specific)
 *
 * @type {{
 *   create: <T>(initialState?: T) => {
 *     id: string,
 *     get: () => T,
 *     set: (updater: ((draft: T) => void) | Partial<T> | T) => T,
 *     setByPath: (path: string, value: any) => T,
 *     remove: (path: string) => T,
 *     subscribe: (listener: (next: T, prev: T) => void) => () => void,
 *     getVersion: () => number,
 *   },
 *   globalData: (...args: any[]) => any,
 *   use: (store: { subscribe: Function, get: Function }, selector?: Function) => any,
 *   useGlobal: (...args: any[]) => any,
 *   useLocal: (...args: any[]) => any,
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
 * const { set, localStore, ...allValues } = baseStore.useLocal(initialValues || {});
 * set... // set method is the same.
 *
 * @example
 * const global = baseStore.useGlobal();
 *
 */
export const baseStore = {
    create,
    globalData,
    use,
    useGlobal,
    useLocal,
};
