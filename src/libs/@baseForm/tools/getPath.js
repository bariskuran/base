export const getPath = ({ parents = [], name }) => {
    let path = "fields";

    if (Array.isArray(parents) && parents.length > 0) {
        for (let i = 0; i < parents.length; i++) {
            const p = parents[i];
            if (!p) continue;
            path += `.${p}.children`;
        }
    }

    path += `.${name}`;
    path = path?.startsWith("fields.") ? path : `fields.${path}`;

    return path;
};
