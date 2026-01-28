import { setSearchParams } from "../../setSearchParams";
import { debouncedFunction } from "../../debouncedFunction";
import { isEqual } from "../../isEqual";

export const searchParamsSet = (_formApi) => {
    const { formName } = _formApi || {};
    const fn = debouncedFunction(debouncedSearchParamsSet, {
        delay: 500,
        functionName: formName + "_searchParamsSet",
    });
    fn(_formApi);
};

export const debouncedSearchParamsSet = (_formApi = {}) => {
    const { useSearchParams, useLS, formName, paramsExporter, storeFile } = _formApi || {};
    if (!storeFile || (!useSearchParams && !useLS)) return;

    const form = storeFile.getState()?.[formName] || {};
    const values = form.values || {};
    const fields = form.fields || {};

    // default olan değerleri searchParam'a eklemek zorunda değiliz.
    // Bu değerleri exported'dan çıkartalım.
    const paramValues = { ...values };
    Object.keys(paramValues).forEach((fieldName) => {
        const currentValue = paramValues[fieldName];
        const defaultValue = fields[fieldName]?.defaultValue;
        if (isEqual(currentValue, defaultValue)) delete paramValues[fieldName];
    });

    // paramsExporter'ı uygula. FiltersManager'dan geliyor.
    const exported = paramsExporter
        ? paramsExporter({ storeFile, values: paramValues })
        : paramValues;

    // exported objesini url'e gönderelim. encoded string zaten setSearchParams'ta hallediliyor.
    const [encoded] = setSearchParams(exported, {
        skipSetAndReturnEncoded: !useSearchParams,
        maxLength: 4000,
    });

    if (useLS) {
        localStorage.setItem(formName, encoded);
    }
};
