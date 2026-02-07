export const defaultResponseCodeCatcher = (response /*json*/) => {
    return (
        response?.status ||
        response?.statusCode ||
        response?.response?.status ||
        response?.response?.statusCode
    );
};
