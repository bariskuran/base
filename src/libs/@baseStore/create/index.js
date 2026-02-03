import { shallowEqual } from "../../shallowEqual";
import { isPlainObject } from "../../isPlainObject";
import { isContainer } from "../../isContainer";
import { typeOf } from "../../typeOf";

let __baseStoreSeq = 0;

export const deepClonePlain = (value) => {
    const t = typeOf(value);

    if (t === "array") {
        return value.map(deepClonePlain);
    }

    if (t === "object" && isPlainObject(value)) {
        const out = {};
        for (const k of Object.keys(value)) {
            out[k] = deepClonePlain(value[k]);
        }
        return out;
    }

    return value;
};

const createDraftProxy = (root, markChanged) => {
    const proxyCache = new WeakMap();
    const missingCache = new WeakMap();

    const materializeChild = (parent, prop) => {
        let child = parent[prop];

        if (child === undefined) {
            child = {};
            parent[prop] = child;
            markChanged();
        } else if (!isContainer(child)) {
            throw new Error(
                `CoreStore: cannot create deep path at "${String(prop)}" because it is not an object/array.`,
            );
        }

        return child;
    };

    const getMissingProxy = (parent, prop) => {
        let map = missingCache.get(parent);
        if (!map) {
            map = new Map();
            missingCache.set(parent, map);
        }
        if (map.has(prop)) return map.get(prop);

        const sentinel = {
            [Symbol.toPrimitive]: () => 0,
            valueOf: () => 0,
            toString: () => "0",
        };

        const p = new Proxy(sentinel, {
            get(_t, nextProp) {
                if (nextProp === Symbol.toPrimitive) return sentinel[Symbol.toPrimitive];
                if (nextProp === "valueOf") return sentinel.valueOf;
                if (nextProp === "toString") return sentinel.toString;

                const child = materializeChild(parent, prop);
                return proxify(child)[nextProp];
            },
            set(_t, nextProp, value) {
                const child = materializeChild(parent, prop);
                proxify(child)[nextProp] = value;
                return true;
            },
            deleteProperty(_t, nextProp) {
                const child = materializeChild(parent, prop);
                delete proxify(child)[nextProp];
                return true;
            },
        });

        map.set(prop, p);
        return p;
    };

    const proxify = (target) => {
        if (!isContainer(target)) return target;
        if (proxyCache.has(target)) return proxyCache.get(target);

        const p = new Proxy(target, {
            get(t, prop) {
                const value = t[prop];
                if (value === undefined && typeof prop !== "symbol") {
                    return getMissingProxy(t, prop);
                }
                return proxify(value);
            },
            set(t, prop, value) {
                if (!Object.is(t[prop], value)) {
                    t[prop] = value;
                    markChanged();
                }
                return true;
            },
            deleteProperty(t, prop) {
                if (prop in t) {
                    delete t[prop];
                    markChanged();
                }
                return true;
            },
        });

        proxyCache.set(target, p);
        return p;
    };

    return proxify(root);
};

/**
 * Creates a core store instance with an initial state.
 *
 * The store acts as a centralized data container that can be accessed
 * both from external (non-React) functions and from React components
 * via hooks.
 *
 * @param {Object} [initialState={}] - Initial state of the store
 * @returns {Object} Core store instance
 */
export const create = (initialState = {}) => {
    const id = `baseStore_${++__baseStoreSeq}`;

    let version = 0;
    let state = initialState;
    const listeners = new Set();

    const get = () => state;

    const set = (updater) => {
        const prev = state;
        let next = prev;
        let changed = false;

        if (typeof updater === "function") {
            let didChange = false;
            const markChanged = () => (didChange = true);

            const draft = deepClonePlain(prev);
            const draftProxy = createDraftProxy(draft, markChanged);

            updater(draftProxy);

            if (!didChange) return state;
            next = draft;
            changed = true;
        } else if (updater && typeof updater === "object") {
            next = { ...prev, ...updater };
            changed = !shallowEqual(next, prev);
        } else {
            next = updater;
            changed = !Object.is(next, prev);
        }

        if (!changed) return state;

        state = next;
        version += 1;

        for (const l of listeners) {
            try {
                l(state, prev);
            } catch (err) {
                console.error(`[${id}] listener error`, err);
            }
        }

        return state;
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const getVersion = () => version;

    return { id, get, set, subscribe, getVersion };
};
