import { useEffect, useMemo } from "react";
import { BaseForm as BaseFormOriginal } from "./BaseForm";
import { BaseFormItem as BaseFormItemOriginal } from "./BaseFormItem";
import { useDefineStore } from "./tools/useDefineStore";
import { mountForm } from "./tools/mountForm";
import { unmountForm } from "./tools/unmountForm";

/**
 *
 * @example
 * useForm({
 *  storeFile, // optional
 *  disableHelper: true, // default false
 *  helperProps: {
 *     HelperComponent: null, // default DefaultHelper
 *     disableActions: true, // default false
 *     disableTitle: true, // default false
 *     disableDescription: true, // default false
 *     disableErrors: true, // default false
 *     helperPropsAltinaKonulanHerseyHelperComponenteAktarılır.
 *     Aynı şekilde BaseFromGroup ve BaseFromItem icin de geçerlidir.
 *     Item > Group > use şeklinde üst üstüste yazılır.
 *  },
 * })
 * @example
 * <BaseForm
 *  StyledContainer={StyledContainer} // Optional
 * >
 *
 * @example
 * <BaseFormGroup
 *  disableHelper: true, // default false
 *   helperProps: ... use'daki ayarlar.
 * >
 *
 * @example
 * <BaseFormItem
 *  disableHelper: true, // default false
 *   helperProps: ... use'daki ayarlar.
 * >
 */

export const useBaseForm = ({ store: storeFile, ...formProps }) => {
    const { store, ...state } = useDefineStore({ store: storeFile });

    /**
     * -------------------------------------------------
     *
     * MOUNT FORM
     *
     * -------------------------------------------------
     */
    useEffect(() => {
        mountForm({ store, formProps });
        return () => unmountForm({ set: store.set });
    }, []);

    /**
     * -------------------------------------------------
     *
     * PREPARE COMPONENTS
     *
     * -------------------------------------------------
     */
    const [BaseForm, BaseFormItem] = useMemo(
        () => [
            (p) => <BaseFormOriginal {...p} storeFile={store} />,
            (p) => <BaseFormItemOriginal {...p} storeFile={store} />,
        ],
        [store],
    );

    /**
     * -------------------------------------------------
     *
     * MOUNT is DONE. TRIGGER FIRST VALIDATION CHECK.
     *
     * -------------------------------------------------
     */
    useEffect(() => {
        if (!state?.isFormMounted || !state?.areFieldsMounted) return;
        state?.validateForm();
    }, [state?.areFieldsMounted]);

    /**
     * -------------------------------------------------
     *
     * RETURN
     *
     * -------------------------------------------------
     */
    if (!state?.isFormMounted) return { BaseForm: () => <></> };
    return {
        ...state,
        storeFile: store,
        BaseForm,
        BaseFormItem,
        BaseFormGroup: BaseFormItem,
    };
};
