import { byPath } from "../../byPath";

export const getField = ({ get, name, parents = [] }) => {
    if (!get || !name) return undefined;

    const state = get();
    if (!state) return undefined;

    let path = "fields";

    if (Array.isArray(parents) && parents.length > 0) {
        for (let i = 0; i < parents.length; i++) {
            const p = parents[i];
            if (!p) continue;
            path += `.${p}.children`;
        }
    }

    path += `.${name}`;

    return byPath.get(state, path);
};
