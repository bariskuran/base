import { stringCaseConverter as strCon } from "../../stringCaseConverter";

export const _mountField = (_formApi = {}, _fieldApi = {}) => {
    const { storeFile, formName, checkIsReady } = _formApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;
    const form = store?.[formName] || {};
    const { name, multipleFields, syncWith, isLast } = _fieldApi;
    const field = form?.fields?.[name] || {};

    // eğer context kullanmak istemiyorsak, disableField özelliği true olur. bu durumda mount yapılmaz.
    if (_fieldApi.useAntDirectly) return;

    // daha önceden kurulum yapılmış olabilir. ya da field deactive olabilir. kontrol et ve çık. üzerine yazmaları engellemiş olalım.
    if (field.isFieldMounted) return;
    if (field.isReadyAfterFieldSet) return;
    if (_fieldApi.deactivate) return;

    // Bu type'lar field kurulumu gerektirmez.
    if (_fieldApi.fieldType === "button") return;
    if (_fieldApi.fieldType === "buttonArea") return;

    // FOOTER field kurulumu gerektirmez ancak isLast ise bazı ek işlemler isteyebilir.
    if (_fieldApi.fieldType === "footer" && isLast) {
        set({ [formName + ".isLastFieldMounted"]: true });
        checkIsReady({ sender: "mountField" });
        return;
    }

    /**
     * multipleFieldlar için ayrı bir kurulum yapılması gerekir. Bunlar birden fazla field'ı içerdiği için çoklu bir bir field kurulumu gerektirir.
     * Buradaki temel amaç, bir tane field helper ile birden fazla alanın kontrol edilmesidir.
     * Mesela FORM.pagination içinde page - limit - orderBy gibi alt alanlar barındırır. Ve bunlar pagination:{} altında toplanmadığı için kurulumu biraz farklıdır.
     * fields içerisinde pagination kurulmaz. page, limit vs. kurulur.
     * Ancak, yardımcı fonksiyonlar bu noktada birden fazla field'ı tetiklemelidir.
     */
    if (multipleFields) {
        const multipleFieldKeys = Object.keys(multipleFields);
        multipleFieldKeys.forEach((singleFieldKey) => {
            const { defaultValue, label, isLast, ...rest } = multipleFields[singleFieldKey];

            setupField({
                set,
                form,
                _formApi,
                fieldKeys: {
                    name: singleFieldKey,
                    label: label || strCon(name, "title", "camel"),
                    defaultValue,
                    isLast,
                    ...rest,
                },
            });
        });

        isLast && checkIsReady({ sender: "mountField" });
        return;
    }

    // bu aşamaya kadar name olup olmadığını kontrol etmedik. Çünkü footer ve multipleFieldların name'i olmuyor. Ancak bu adımdan sonra name gerektiği için kontrolümüzü burada yapıyoruz.
    if (!name) return;

    /**
     * syncWith, bir field'ın bağımsız olarak çalışması yerine, başka bir field içerisindeki belirlenmiş bir path'den veri almasını ve o path'i güncellemesini sağlar.
     * backupDomains içerisinde ilk örneği var. backupDomains örneğini verirsek backupDomains = [{domain:"", geo:""},{domain:"", geo:""}] gibi bir değer taşır.
     * syncWith={`${name}.[${index}]`} değeri veriyoruz. Buradaki name aslında backupDomains. field'ın kendi isimlerini zaten FORM.context biliyor.
     * Bu field gidip backupDomains içerisindeki veriyi günceller.
     */
    if (syncWith) {
        if (isLast) {
            set({ [formName + ".isLastFieldMounted"]: true });
            checkIsReady({ sender: "mountField" });
        }
        return;
    }

    // field'a mounttan önce dışarıdan bilgi girilmiş olabilir. Böyle bir durumda standart mountun girilen verinin üzerine yazmaması gerekir. Özellikle defaultValue ve value değerleri başka bir çok şeyi de etkilediği için kontrol edilmesi gerekir.
    // Mesela columnOrder'ın default verisi sayfaya göre hesaplanıp, form'a useEffect ile yazılıyor. Mount.set fonksiyonu bu defaultValue'yu ve values folder'ındaki değeri ezebiliyor.
    // Sorunu çözmek için fields.name objesinin en altında ...field ve values değerinin de öncesinde form.values.[name] değerini ekledik. Bu sayede daha önce dışarıdan bir set yapıldıysa bunun üzerine yazılmasını engellemiş olduk.

    setupField({
        set,
        form,
        _formApi,
        fieldKeys: {
            name,
            label: _fieldApi.label,
            defaultValue: _fieldApi.defaultValue,
            isLast,
            rules: _fieldApi.rules,
            ...field,
        },
    });
};

const setupField = (p = {}) => {
    const { set, form, _formApi, fieldKeys = {} } = p;
    const { name, label, defaultValue, isLast, ...restFieldKeys } = fieldKeys;
    const { formName, checkIsReady } = _formApi;

    set({
        [formName + ".fields." + name]: {
            label,
            defaultValue: defaultValue || null,
            value: defaultValue || null,
            lastSubmittedValue: defaultValue || null,
            previousValue: defaultValue || null,
            unconfirmedValue: null,
            isTouched: false,
            isDirty: false,
            enableResetToLastSubmitted: false,
            enableResetToDefault: false,
            isLastSubmittedDiffThenDefault: false,
            errors: [],
            isValid: true,
            focusManually: 0,
            isFieldMounted: true,
            ...restFieldKeys,
        },
        [formName + ".values." + name]: form.values?.[name]
            ? form.values?.[name]
            : defaultValue || null,
        [formName + ".lastSubmittedValues." + name]: form.values?.[name]
            ? form.values?.[name]
            : defaultValue || null,
        ...(isLast && { [formName + ".isLastFieldMounted"]: true }),
    });

    isLast && checkIsReady({ sender: "mountField" });
};
