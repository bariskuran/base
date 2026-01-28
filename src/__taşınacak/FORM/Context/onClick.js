import { baseStore } from "../../baseStore";

export const onClick = (_formApi = {}, _fieldApi = {}, e) => {
    const { set: setBase } = baseStore?.getState() || {};
    const { onClickFromForm, packageSender } = _formApi;
    const { onClickFromField, mainFolder, confirmation, activePopover, popoverId, fieldType } =
        _fieldApi;

    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (confirmation && activePopover !== popoverId && fieldType === "button") {
        setBase({ activePopover: popoverId });
        return;
    }

    packageSender([onClickFromForm, onClickFromField], { e, _fieldApi, fieldName: mainFolder });
};
