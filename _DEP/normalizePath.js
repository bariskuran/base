export const normalizeFieldPath = (path) => (path?.startsWith("fields.") ? path : `fields.${path}`);
