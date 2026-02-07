import { stringCaseConverter as strCon } from "../../stringCaseConverter";

const ignoreTheseKeys = ["nameAndLabel"];

const CONFIG = (fieldProps, _formApi) => {
    return {
        // ignoredKeys
        // nameAndLabel,

        // complex settings
        multipleFields: {}, // this enables multiple fields but they saved seperately in the store. Check out FORM.pagination

        multipleFieldsWithPath: {},
        syncWith: {}, // this enables multiple fields but they saved together in the store. Check out dash2 > FORM.backupDomains
        mainFolder: {
            defaultValue: fieldProps.syncWith
                ? fieldProps.syncWith?.split(".")?.[0] // parent name
                : fieldProps.name || fieldProps.nameAndLabel, // name
        },
        pathAfterMainFolder: {
            defaultValue: fieldProps.syncWith
                ? fieldProps.syncWith?.split(".")?.slice(1).join(".") // parent path
                : undefined,
        },

        // basics
        name: {
            defaultValue: fieldProps.name || fieldProps.nameAndLabel,
        },
        label: {
            defaultValue:
                fieldProps.fieldType === "button"
                    ? undefined
                    : fieldProps.nameAndLabel
                      ? strCon(fieldProps.nameAndLabel, "title", "camel")
                      : "Unknown Label",
        },
        fieldType: { defaultValue: "input" },
        Component: {}, // Component: { defaultValue: Fields[fieldProps.fieldType] || Fields.Input }, -> Using this causes circular-dependency.
        defaultValue: { defaultValue: fieldProps.defaultValue || null },
        lastSubmittedValue: { defaultValue: fieldProps.defaultValue || null },
        // value: { defaultValue: fieldProps.defaultValue || null },
        value: { newKey: "valueFromField" },
        isFieldApiReady: { defaultValue: true },

        // versions
        useAntDirectly: {},
        disableHelper: {
            defaultValue: _formApi.disableHelperFromForm || fieldProps.useAntDirectly,
        },
        hideActions: {},
        fieldVersion: { defaultValue: _formApi.fieldVersionFromForm },
        helperVersion: { defaultValue: _formApi.helperVersionFromForm },

        // handlers
        onBlur: { newKey: "onBlurFromField" },
        onChange: { newKey: "onChangeFromField" },
        onClick: { newKey: "onClickFromField" },
        onFocus: { newKey: "onFocusFromField" },
        onPressEnter: { newKey: "onPressEnterFromField" },
        onClear: { newKey: "onClearFromField" },
        onHover: { newKey: "onHoverFromField" },
        onDropdownVisibleChange: { newKey: "onDropdownVisibleChangeFromField" },

        // helper props
        deactivate: {},
        hidden: {},
        disabled: {},
        confirmation: {},
        debugMode: {},
        descriptionText: {},
        headerField: {},
        hideClear: {},
        isLast: {},
        labelIcon: {},
        required: {},
        rules: {},
        tooltip: {},
        enableAbsoluteLabel: {},

        // extra input props
        triggerSubmitOnEnter: {},

        // extra select props
        searchAt: {},
        valueKey: {},
        labelKey: {},
        sortOrderBy: {
            defaultValue: "label",
        },
        sortOrderByDirection: {
            defaultValue: "asc",
        },
        dropdownActions: {},

        // extra button props
        href: {},
        preIcon: {},
        sufIcon: {},
        iconSize: {
            defaultValue: 14,
        },
        disableIconAnimation: {},
        isLoading: {},
        primary: {},
        secondary: {},
        error: {},
        success: {},
        hoverManually: {},
        disableAfterClick: {
            defaultValue: 2000,
        },
        isMobile: {},
        tooltipPlacement: {},

        // extra for columnOrder
        disableHoverBackground: {},
    };
};

export const _prepareFieldApi = (fieldProps = {}, _formApi = {}, fieldRef, popoverId) => {
    const { formName, storeFile } = _formApi || {};
    const store = storeFile?.getState() || {};
    const _fieldApi = { fieldRef, popoverId: popoverId.current };

    const restInputProps = {};
    const renderedConfig = CONFIG(fieldProps, _formApi);

    // İlk önce kullanıcının gönderdiği propları ekler.
    // Bunu yaparken prop isimlerini değiştirebilir. (newKey)
    // Onun dışında kullanıcının verdiği değerleri EZMEZ.
    // Bu esnada, kullanıcının FORM'a değil de içerisinde kullandığı komponente gönderdiği proplar da burada ayıklanır.
    // Bir prop ismi CONFIG'de geçmiyorsa, o sub-component'a gönderilir. Bunun da adı "restInputProps" olur.
    Object.entries(fieldProps).forEach(([key, value]) => {
        const configItem = renderedConfig[key];
        if (configItem) _fieldApi[configItem.newKey || key] = value;
        else if (!ignoreTheseKeys.includes(key)) restInputProps[key] = value;
    });

    // Atlanmış bir default varsa onu ekler. Kullanıcının göndermediği ama sistemin (CONFIG) talep ettiği defaultlar olabilir.
    // Bu nedenle renderedConfig dosyasına bakar ve bir üst adımda o prop işlenmediyse onu da _fieldApi'ye ekler.
    Object.entries(renderedConfig).forEach(([key, config]) => {
        const { newKey, defaultValue } = config;
        if (!defaultValue || _fieldApi[newKey || key] || restInputProps[key]) return;

        const currentValue = _fieldApi[newKey || key];
        if (currentValue === undefined || currentValue === null) {
            _fieldApi[newKey || key] = defaultValue;
        }
    });

    // Bazı veriler, form kurulmadan önce, farklı komponentler tarafından gönderiliyor.
    // Mesela columnOrder'ın ilk verileri columnManager tarafından hesaplanıyor ve columnOrder kurulmadan önce hazırlanıyor.
    // Ancak bazı durumlarda, columnOrder gizli olabilir ya da filters altında yer almayabilir.
    // Böyle bir durumda, columnManager'ın fields alanına müdahele etmesi sorun yaratacaktır.
    // Bunu önlemek için columnManager gibi dış komponentler, verilerini fieldsDepot'a kaydeder.
    // _fieldApi de kurulum esnasında, kendisini ilgileren diren bir veri var mı diye, fieldsDepot'u kontrol eder.
    // Öncelik sırası fieldın kendisindedir. Ancak field verisi boşsa, fieldsDepot'tan veri çeker.
    const form = store?.[formName] || {};
    const fieldDepot = form.fieldsDepot?.[renderedConfig.name.defaultValue] || {};
    Object.keys(fieldDepot).forEach((key) => {
        if (!_fieldApi[key] && fieldDepot[key]) _fieldApi[key] = fieldDepot[key];
    });

    return [_fieldApi, restInputProps];
};
