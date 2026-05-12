import { isArrayOrPlainObject } from "../isArrayOrPlainObject";

/**
 * Utilities to work with nested values via dot-separated paths.
 *
 * - Supports arrays using numeric segments (e.g. "items.0.name")
 * - Creates missing branches in `set` as `{}` or `[]` based on the next segment
 * - Includes a `mapping` helper to pick/rename values from an object by paths
 *
 * @example
 * byPath.get({ a: { b: 1 } }, "a.b"); // 1
 *
 * @example
 * const s1 = {};
 * const s2 = byPath.set(s1, "items.0.name", "Alice");
 * // s2 => { items: [ { name: "Alice" } ] }
 *
 * @example
 * const s = { a: { b: { c: 1 } } };
 * const s2 = byPath.delete(s, "a.b.c");
 * // s2 => { a: { b: {} } }
 *
 * @example
 * const props = { user: { name: "Baris" }, theme: { primary: "#ffbf00" } };
 * const picked = byPath.mapping(props, {
 *   username: "user.name",
 *   primaryColor: "theme.primary",
 * });
 * // picked => { username: "Baris", primaryColor: "#ffbf00" }
 */
export const byPath = (() => {
    const isIndex = (seg) => /^\d+$/.test(seg);
    const cloneContainer = (v) => (Array.isArray(v) ? v.slice() : { ...v });
    const makeContainerForNext = (nextSeg) => (isIndex(nextSeg) ? [] : {});
    const splitPath = (path) => (typeof path === "string" && path.length ? path.split(".") : []);
    const readFrom = (container, k) =>
        Array.isArray(container) && isIndex(k) ? container[Number(k)] : container?.[k];
    const writeTo = (container, k, v) => {
        if (Array.isArray(container) && isIndex(k)) container[Number(k)] = v;
        else container[k] = v;
    };
    const deleteFrom = (container, k) => {
        if (Array.isArray(container) && isIndex(k)) {
            container[Number(k)] = undefined;
        } else {
            delete container[k];
        }
    };

    return {
        get(obj, path) {
            const parts = splitPath(path);
            if (parts.length === 0) return undefined;

            let cur = obj;
            for (let i = 0; i < parts.length; i++) {
                if (cur == null) return undefined;
                cur = readFrom(cur, parts[i]);
            }
            return cur;
        },
        set(state, path, newValue, enableDirectUpdate = false) {
            const parts = splitPath(path);
            if (parts.length === 0) return state;

            if (enableDirectUpdate) {
                if (!isArrayOrPlainObject(state)) {
                    return byPath.set(state, path, newValue, false);
                }

                let cur = state;

                for (let i = 0; i < parts.length; i++) {
                    const key = parts[i];
                    const last = i === parts.length - 1;

                    if (last) {
                        writeTo(cur, key, newValue);
                        break;
                    }

                    const nextSeg = parts[i + 1];
                    const child = readFrom(cur, key);

                    if (!isArrayOrPlainObject(child)) {
                        writeTo(cur, key, makeContainerForNext(nextSeg));
                    }

                    cur = readFrom(cur, key);
                }

                return state;
            }

            const rootIsIndex = isIndex(parts[0]);
            const baseRoot = isArrayOrPlainObject(state) ? state : rootIsIndex ? [] : {};

            const rootCopy = cloneContainer(baseRoot);
            let curCopy = rootCopy;
            let curOrig = baseRoot;

            for (let i = 0; i < parts.length; i++) {
                const key = parts[i];
                const last = i === parts.length - 1;

                if (last) {
                    writeTo(curCopy, key, newValue);
                    break;
                }

                const nextSeg = parts[i + 1];
                const origChild = isArrayOrPlainObject(curOrig) ? readFrom(curOrig, key) : undefined;

                const nextContainer = isArrayOrPlainObject(origChild)
                    ? origChild
                    : makeContainerForNext(nextSeg);

                const nextCopy = cloneContainer(nextContainer);
                writeTo(curCopy, key, nextCopy);

                curOrig = nextContainer;
                curCopy = nextCopy;
            }

            return /** @type {any} */ (rootCopy);
        },
        delete(state, path, enableDirectUpdate = false) {
            const parts = splitPath(path);
            if (parts.length === 0) return state;

            if (enableDirectUpdate) {
                if (!isArrayOrPlainObject(state)) return state;

                let cur = state;
                for (let i = 0; i < parts.length - 1; i++) {
                    cur = readFrom(cur, parts[i]);
                    if (!isArrayOrPlainObject(cur)) return state;
                }

                deleteFrom(cur, parts[parts.length - 1]);
                return state;
            }

            if (!isArrayOrPlainObject(state)) return state;

            const stack = [];
            let curOrig = state;

            for (let i = 0; i < parts.length - 1; i++) {
                stack.push({ node: curOrig, key: parts[i] });
                curOrig = readFrom(curOrig, parts[i]);
                if (!isArrayOrPlainObject(curOrig)) return state;
            }

            const lastKey = parts[parts.length - 1];

            const bottomCopy = cloneContainer(curOrig);
            deleteFrom(bottomCopy, lastKey);

            let childCopy = bottomCopy;

            for (let i = stack.length - 1; i >= 0; i--) {
                const { node, key } = stack[i];
                const parentCopy = cloneContainer(node);
                writeTo(parentCopy, key, childCopy);
                childCopy = parentCopy;
            }

            return /** @type {any} */ (childCopy);
        },
        mapping(props, mappingObj) {
            const out = {};
            if (!mappingObj || typeof mappingObj !== "object") return out;

            for (const key in mappingObj) {
                if (!Object.prototype.hasOwnProperty.call(mappingObj, key)) continue;
                out[key] = this.get(props, mappingObj[key]);
            }
            return out;
        },
    };
})();
