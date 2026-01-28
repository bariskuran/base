import { getSearchParams } from "../../getSearchParams";

export const searchParamsGet = (_formApi = {}) => {
    const { storeFile, useSearchParams, useLS, paramsImporter, formName, setValues } = _formApi;
    if (!storeFile || (!useSearchParams && !useLS)) return;

    const encoded = useSearchParams ? getSearchParams()?.[0] : localStorage.getItem(formName);
    const imported = paramsImporter ? paramsImporter({ storeFile, values: encoded }) : encoded;

    setValues(imported, {
        silentMode: true,
        skipIsTouched: true,
        setLastSubmittedValue: true,
    });
};
