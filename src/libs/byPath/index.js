/**
 * Utilities to work with nested values via dot-separated paths.
 *
 * - Supports arrays using numeric segments (e.g. "items.0.name")
 * - Creates missing branches in `set` as `{}` or `[]` based on the next segment
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
 */
export const byPath = (() => {
    const isIndex = (seg) => /^\d+$/.test(seg);

    const isObjectLike = (v) => v !== null && typeof v === "object";

    const isPlainObject = (v) => {
        if (!isObjectLike(v)) return false;
        const proto = Object.getPrototypeOf(v);
        return proto === Object.prototype || proto === null;
    };

    const isContainer = (v) => Array.isArray(v) || isPlainObject(v);

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
            // Keep array shape stable: set to undefined (do not reindex)
            container[Number(k)] = undefined;
        } else {
            delete container[k];
        }
    };

    return {
        /**
         * Gets a nested value by dot-separated path.
         *
         * Supports "array index" segments (numeric keys):
         * - "items.0.name" => obj.items[0].name
         *
         * @param {*} obj - Source object/array.
         * @param {string} path - Dot-separated path.
         * @returns {*} The value at path, or `undefined` if not found.
         *
         * @example
         * byPath.get({ a: { b: 1 } }, "a.b"); // 1
         * byPath.get({ items: [{ name: "A" }] }, "items.0.name"); // "A"
         */
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

        /**
         * Sets a nested value by dot-separated path (object/array aware).
         *
         * - Missing branches are created automatically as `{}` or `[]` depending on the next segment.
         * - If `enableDirectUpdate` is true, mutates the given state in-place and returns it.
         * - Otherwise returns a new root, cloning only along the modified path (immutable update).
         *
         * @template T
         * @param {T} state - Source object/array to update.
         * @param {string} path - Dot-separated path (e.g. "a.b.c" or "items.0.name").
         * @param {*} newValue - Value to set at path.
         * @param {boolean} [enableDirectUpdate=false] - If true, mutates `state` directly.
         * @returns {T} Updated structure.
         *
         * @example
         * const s1 = {};
         * const s2 = byPath.set(s1, "items.0.name", "Alice");
         * // { items: [ { name: "Alice" } ] }
         */
        set(state, path, newValue, enableDirectUpdate = false) {
            const parts = splitPath(path);
            if (parts.length === 0) return state;

            // ---------- Mutable mode ----------
            if (enableDirectUpdate) {
                // if root isn't container, fall back to immutable to avoid weirdness
                if (!isContainer(state)) {
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

                    if (!isContainer(child)) {
                        writeTo(cur, key, makeContainerForNext(nextSeg));
                    }

                    cur = readFrom(cur, key);
                }

                return state;
            }

            // ---------- Immutable mode ----------
            const rootIsIndex = isIndex(parts[0]);
            const baseRoot = isContainer(state) ? state : rootIsIndex ? [] : {};

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
                const origChild = isContainer(curOrig) ? readFrom(curOrig, key) : undefined;

                const nextContainer = isContainer(origChild)
                    ? origChild
                    : makeContainerForNext(nextSeg);

                const nextCopy = cloneContainer(nextContainer);
                writeTo(curCopy, key, nextCopy);

                curOrig = nextContainer;
                curCopy = nextCopy;
            }

            return /** @type {any} */ (rootCopy);
        },

        /**
         * Deletes a nested key/index by dot-separated path.
         *
         * Behavior:
         * - Immutable by default: returns a new root cloning along the path.
         * - Mutable if `enableDirectUpdate=true`: mutates and returns the same reference.
         * - If the path doesn't exist, returns the original object (or same reference in mutable mode).
         * - Array index delete: sets the index to `undefined` (does not reindex).
         *
         * @template T
         * @param {T} state - Source object/array.
         * @param {string} path - Dot-separated path.
         * @param {boolean} [enableDirectUpdate=false] - If true, mutates `state` directly.
         * @returns {T} Updated structure.
         *
         * @example
         * const s1 = { a: { b: { c: 1, d: 2 } } };
         * const s2 = byPath.delete(s1, "a.b.c");
         * // s2 => { a: { b: { d: 2 } } }
         */
        delete(state, path, enableDirectUpdate = false) {
            const parts = splitPath(path);
            if (parts.length === 0) return state;

            // ---------- Mutable mode ----------
            if (enableDirectUpdate) {
                if (!isContainer(state)) return state;

                let cur = state;
                for (let i = 0; i < parts.length - 1; i++) {
                    cur = readFrom(cur, parts[i]);
                    if (!isContainer(cur)) return state; // nothing to delete
                }

                deleteFrom(cur, parts[parts.length - 1]);
                return state;
            }

            // ---------- Immutable mode ----------
            if (!isContainer(state)) return state;

            // Traverse and keep a stack of originals
            const stack = [];
            let curOrig = state;

            for (let i = 0; i < parts.length - 1; i++) {
                stack.push({ node: curOrig, key: parts[i] });
                curOrig = readFrom(curOrig, parts[i]);
                if (!isContainer(curOrig)) return state; // path not found
            }

            const lastKey = parts[parts.length - 1];

            // Clone bottom container and delete
            const bottomCopy = cloneContainer(curOrig);
            deleteFrom(bottomCopy, lastKey);

            // Rebuild upwards (clone each parent along the path)
            let childCopy = bottomCopy;

            for (let i = stack.length - 1; i >= 0; i--) {
                const { node, key } = stack[i];
                const parentCopy = cloneContainer(node);
                writeTo(parentCopy, key, childCopy);
                childCopy = parentCopy;
            }

            return /** @type {any} */ (childCopy);
        },
    };
})();
