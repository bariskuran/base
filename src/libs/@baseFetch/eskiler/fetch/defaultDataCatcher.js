export const defaultDataCatcher = (response, json) => {
    return json?.data || json?.response?.data || json?.response?.data?.data;
};
