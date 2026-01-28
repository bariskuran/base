import { generateRandomText } from "../../generateRandomText";
import { _mountField } from "./_mountField";
import { _unmountField } from "./_unmountField";
import { callDefaultValues } from "./callDefaultValues";
import { callLastSubmittedValues } from "./callLastSubmittedValues";
import { callPreviousValues } from "./callPreviousValues";
import { checkForm } from "./checkForm";
import { checkIsReady } from "./checkIsReady";
import { clearValues } from "./clearValues";
import { onBlur } from "./onBlur";
import { onCancel } from "./onCancel";
import { onChange } from "./onChange";
import { onClear } from "./onClear";
import { onClick } from "./onClick";
import { onConfirm } from "./onConfirm";
import { onDropdownChange } from "./onDropdownChange";
import { onFocus } from "./onFocus";
import { onHover } from "./onHover";
import { onReady } from "./onReady";
import { onResetToDefaults } from "./onResetToDefaults";
import { onResetToLastSubmitted } from "./onResetToLastSubmitted";
import { onSubmit } from "./onSubmit";
import { packageSender } from "./packageSender";
import { removeFields } from "./removeFields";
import { searchParamsGet } from "./searchParamsGet";
import { searchParamsSet } from "./searchParamsSet";
import { setDefaultValues } from "./setDefaultValues";
import { setFields } from "./setFields";
import { setUnconfirmedValues } from "./setUnconfirmedValues";
import { setLastSubmittedValues } from "./setLastSubmittedValues";
import { setPreviousValues } from "./setPreviousValues";
import { setValues } from "./setValues";

export const _prepareFormApi = (p) => {
    if (!p.storeFile) {
        console.log("Missing storeFile for " + p.formName);
        return {};
    }

    const pageTitle = p.storeFile.getState().pageTitle;

    const _formApi = {
        formName: p.formName || pageTitle + "_" + generateRandomText(16),
        storeFile: p.storeFile,
        //
        fieldVersionFromForm: p.fieldVersion || "V1",
        helperVersionFromForm: p.helperVersion || "V1",
        disableHelperFromForm: p.disableHelper,
        //
        needManualApprovalForIsReady: p.needManualApprovalForIsReady,
        useSearchParams: p.useSearchParams,
        useLS: p.useLS,
        paramsExporter: p.paramsExporter,
        paramsImporter: p.paramsImporter,
        debounceTime: (p.debounceTime || 1) * 1000, // sec
        justHeaderFields: p.justHeaderFields, // if enabled, it only shows fields "headerField:true". All others will be hidden.
        disableUnmount: p.disableUnmount, // FiltersDrawer gibi, ekrandan kaldırılsa bile ayarları sıfırlamamak için gerekli.
        // Handlers
        onBlurFromForm: p.onBlur,
        onCancelFromForm: p.onCancel,
        onChangeFromForm: p.onChange,
        onClickFromForm: p.onClick,
        onFocusFromForm: p.onFocus,
        onReadyFromForm: p.onReady,
        onResetFromForm: p.onReset,
        onSubmitFromForm: p.onSubmit,
        onHoverFromForm: p.onHover,

        // Styling
        flexDirection: p.flexDirection || "column",
        flexGap: p.flexGap === undefined ? 10 : p.flexGap,
        flexJustify: p.flexJustify || "center",
        flexAlign: p.flexAlign || "center",

        // Rest is useless for now
    };

    // form functions get _formApi as first argument
    _formApi.callDefaultValues = (...p) => callDefaultValues(_formApi, ...p);
    _formApi.callLastSubmittedValues = (...p) => callLastSubmittedValues(_formApi, ...p);
    _formApi.callPreviousValues = (...p) => callPreviousValues(_formApi, ...p);
    _formApi.checkForm = (...p) => checkForm(_formApi, ...p);
    _formApi.checkIsReady = (...p) => checkIsReady(_formApi, ...p);
    _formApi.clearValues = (...p) => clearValues(_formApi, ...p);
    _formApi.onCancel = (...p) => onCancel(_formApi, ...p);
    _formApi.onReady = (...p) => onReady(_formApi, ...p);
    _formApi.onResetToDefaults = (...p) => onResetToDefaults(_formApi, ...p);
    _formApi.onResetToLastSubmitted = (...p) => onResetToLastSubmitted(_formApi, ...p);
    _formApi.onSubmit = (...p) => onSubmit(_formApi, ...p);
    _formApi.removeFields = (...p) => removeFields(_formApi, ...p);
    _formApi.setDefaultValues = (...p) => setDefaultValues(_formApi, ...p);
    _formApi.setFields = (...p) => setFields(_formApi, ...p);
    _formApi.setUnconfirmedValues = (...p) => setUnconfirmedValues(_formApi, ...p);
    _formApi.setLastSubmittedValues = (...p) => setLastSubmittedValues(_formApi, ...p);
    _formApi.setPreviousValues = (...p) => setPreviousValues(_formApi, ...p);
    _formApi.setValues = (...p) => setValues(_formApi, ...p);

    // tools
    _formApi.packageSender = (...p) => packageSender(_formApi, ...p);
    _formApi.searchParamsGet = (...p) => searchParamsGet(_formApi, ...p);
    _formApi.searchParamsSet = (...p) => searchParamsSet(_formApi, ...p);

    // field functions get _fieldApi as a second argument.
    _formApi._mountField = (_fieldApi, ...p) => _mountField(_formApi, _fieldApi, ...p);
    _formApi._unmountField = (_fieldApi, ...p) => _unmountField(_formApi, _fieldApi, ...p);
    _formApi.onBlur = (_fieldApi, ...p) => onBlur(_formApi, _fieldApi, ...p);
    _formApi.onChange = (_fieldApi, ...p) => onChange(_formApi, _fieldApi, ...p);
    _formApi.onClear = (_fieldApi, ...p) => onClear(_formApi, _fieldApi, ...p);
    _formApi.onClick = (_fieldApi, ...p) => onClick(_formApi, _fieldApi, ...p);
    _formApi.onConfirm = (_fieldApi, ...p) => onConfirm(_formApi, _fieldApi, ...p);
    _formApi.onDropdownChange = (_fieldApi, ...p) => onDropdownChange(_formApi, _fieldApi, ...p);
    _formApi.onFocus = (_fieldApi, ...p) => onFocus(_formApi, _fieldApi, ...p);
    _formApi.onHover = (_fieldApi, ...p) => onHover(_formApi, _fieldApi, ...p);

    return _formApi;
};
