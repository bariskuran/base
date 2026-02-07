import { API_RESPONSE_CODES } from "../API_RESPONSE_CODES";

export const handleResponse = async (response, fetchStore = {}) => {
    const { dataCatcher, metaCatcher, errorCatcher, responseCodeCatcher } = fetchStore;

    const json = response?.headers?.get?.("Content-Type")?.includes?.("application/json")
        ? await response.json()
        : response;

    const data = dataCatcher(response, json);
    const meta = metaCatcher(response, json);

    const statusCode =
        window?.navigator?.online === false
            ? 0
            : !response
              ? 1
              : responseCodeCatcher(response, json) || "unknown";

    const error = errorCatcher(response, json);
    const [isValid, status] = API_RESPONSE_CODES[statusCode];

    return {
        isValid: isValid ? true : false,
        status: error || status,
        statusCode,
        data,
        meta,
        json,
    };
};
