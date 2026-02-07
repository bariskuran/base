export const onReady = (
    _formApi = {},
    // opts = {}
) => {
    const { searchParamsGet, useLS, useSearchParams, onReadyFromForm, packageSender, checkForm } =
        _formApi;

    if (useLS || useSearchParams) {
        searchParamsGet();
    }

    checkForm({ sender: "onReady" });
    packageSender(onReadyFromForm, { skipDebounce: true });
};
