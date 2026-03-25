import { getPath } from "./getPath";
import { byPath } from "../../byPath";
import { validateField } from "./validateField";

const isGroupByProps = ({ Component, children } = {}) => !Component && children != null;

const ensureBaseShape = (node, name, label) => {
    node.name ??= name;
    node.label ??= label || null;
    node.count ??= 1;
    node.errors ??= [];
    node.isTouched ??= false;
    node.isDirty ??= false;
    node.isValid ??= true;
    node.isReady ??= true;
    node.isMainItem ??= false;
};

const normalizeGroup = (node) => {
    node.isGroup = true;
    node.children ??= {};

    // if (deriveValue) {
    //     const childrenValues = {};
    //     Object.entries(node.children).forEach(([childKey, childValue]) => {
    //         childrenValues[childKey] = childValue.value;
    //     });
    //     node.value = deriveValue({
    //         name: node.name,
    //         childrenValues,
    //     });
    // }
};

const normalizeLeaf = (node, { defaultValue, deriveValue }) => {
    node.isGroup = false;
    if ("children" in node) delete node.children;

    const v1 = defaultValue ?? null;
    const v = deriveValue
        ? deriveValue({
              value: v1,
          })
        : v1;

    node.defaultValue ??= v;
    node.value ??= v;
    node.previousValue ??= node.value;
    node.lastSubmittedValue ??= node.value;
    if ("lastSubmitValue" in node) {
        node.lastSubmittedValue ??= node.lastSubmitValue;
        delete node.lastSubmitValue;
    }
};

let mountFlushQueued = false;

export const scheduleMountFlush = ({ get, set }) => {
    if (mountFlushQueued) return;
    mountFlushQueued = true;

    queueMicrotask(() => {
        mountFlushQueued = false;

        const snap1 = get();
        const pulse1 = snap1._mountPulse || 0;

        queueMicrotask(() => {
            const snap2 = get();
            const pulse2 = snap2._mountPulse || 0;

            if (pulse2 === pulse1) {
                set((s) => {
                    s.areFieldsMounted = true;
                    s._mountFlushScheduled = false;
                });
            } else {
                scheduleMountFlush({ get, set });
            }
        });
    });
};

const toPlain = (v) => {
    try {
        return structuredClone(v);
    } catch {
        return JSON.parse(JSON.stringify(v));
    }
};

export const mountItem = ({ set, get, itemProps, parents = [], validateForm }) => {
    const { name, defaultValue, children, Component, label, deriveValue } = itemProps || {};
    if (!set || !get || !name) return;

    const isGroup = isGroupByProps({ Component, children });
    const isHighestLevel = parents.length === 0;

    const path = getPath({ parents, name });
    const currentItem = byPath.get(get(), path) || {};

    if (currentItem?.isReady) {
        set((s) => {
            const node = byPath.get(s, path);
            if (!node) return;

            node.count = (node.count || 1) + 1;

            // ensureBaseShape(node, name);

            // if (isGroup) normalizeGroup(node);
            // else normalizeLeaf(node, { defaultValue });
        });

        return;
    }

    set((s) => {
        const existing = byPath.get(s, path);
        const existingChildren = existing?.children;

        const node = {};
        ensureBaseShape(node, name, label);

        if (isGroup) {
            normalizeGroup(node);
            if (existingChildren && typeof existingChildren === "object") {
                node.children = toPlain(existingChildren);
            }
        } else {
            normalizeLeaf(node, { defaultValue, deriveValue });
        }

        if (node.isGroup && deriveValue) {
            const childrenValues = {};
            Object.entries(node.children).forEach(([childKey, childValue]) => {
                childrenValues[childKey] = childValue.value;
            });
            const v = deriveValue({
                name,
                childrenValues,
            });

            node.value = v;
            node.previousValue = v;
            node.lastSubmittedValue = v;
        }

        const [errors, isDirty, isValidGlobal] = validateField({
            value: node.value,
            validationRules: itemProps.validationRules,
            field: node,
        });

        node.errors = errors;
        node.isDirty = isDirty;
        node.isValid = isValidGlobal;

        byPath.set(s, path, node, true);

        if (isHighestLevel) {
            s.values ??= {};
            const v = node.value ?? defaultValue ?? null;

            if (!(name in s.values)) {
                s.values[name] = v;
            }
            const nodeRef = byPath.get(s, path);
            if (nodeRef) nodeRef.isMainItem = true;
        }

        s.areFieldsMounted = false;
        s._mountPulse = (s._mountPulse || 0) + 1;
        if (!s._mountFlushScheduled) s._mountFlushScheduled = true;
    });

    scheduleMountFlush({ get, set });

    validateForm();
};
