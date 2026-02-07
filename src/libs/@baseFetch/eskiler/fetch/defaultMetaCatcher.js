export const defaultMetaCatcher = (response, json) => {
    return json?.meta || json?.response?.meta || json?.response?.data?.meta;
};
