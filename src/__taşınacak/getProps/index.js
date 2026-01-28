import { getValueByPath } from "../getValueByPath";

export const getProps = (props, mapping) => {
    const result = {};
    for (const key in mapping) {
        const path = mapping[key];
        result[key] = getValueByPath(props, path);
    }
    return result;
};
