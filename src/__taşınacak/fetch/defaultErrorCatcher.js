export const defaultErrorCatcher = (response /*json*/) => {
    return (
        response?.response?.data?.error ||
        response?.response?.data?.errors ||
        response?.response?.data?.data?.error ||
        response?.response?.data?.data?.errors
    );
};
