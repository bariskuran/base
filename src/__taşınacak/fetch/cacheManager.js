import { baseStore } from "../baseStore";

export const getFromCache = (fetchStore = {}) => {
    const { url, useCache, onSuccess, global_onSuccess } = fetchStore;

    const responses = JSON.parse(localStorage.getItem("responses")) || {};
    if (responses[url]) {
        const { data, timeStamp = 0 } = responses[url];
        const curr = baseStore.getState().date.now.ts();
        const timeDiff = curr - timeStamp;
        if (timeDiff < useCache * 60000) {
            const [status, responseCode, isValid] = ["Data fetched via local storage.", 200, true];
            onSuccess && onSuccess({ data, store: baseStore });
            global_onSuccess && global_onSuccess({ data, store: baseStore });
            return {
                isValid,
                status,
                responseCode,
                data,
            };
        } else {
            const allowedTime = curr - useCache * 60000;
            const newResponses = Object.fromEntries(
                Object.entries(responses).filter(([, { timeStamp }]) => timeStamp > allowedTime),
            );
            localStorage.setItem("responses", JSON.stringify(newResponses));
        }
    }
};

export const addToCache = (url, handledData) => {
    const curr = baseStore.getState().date.now.ts();
    const responses = JSON.parse(localStorage.getItem("responses")) || {};
    responses[url] = { data: handledData, timeStamp: curr };
    localStorage.setItem("responses", JSON.stringify(responses));
};
