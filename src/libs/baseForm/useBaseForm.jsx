import { useEffect, useMemo } from "react";
import { BaseForm as BaseFormOriginal } from "./BaseForm";
import { BaseFormItem as BaseFormItemOriginal } from "./BaseFormItem";
import { useDefineStore } from "./tools/useDefineStore";
import { mountForm } from "./tools/mountForm";
import { unmountForm } from "./tools/unmountForm";
import { inputComponents } from "./inputComponents";

export const useBaseForm = ({ store: storeFile, ...formProps }) => {
    const { store, ...state } = useDefineStore({ store: storeFile });


    useEffect(() => {
        mountForm({ store, formProps });
        return () => unmountForm({ set: store.set });
    }, []);


    const [BaseForm, BaseFormItem] = useMemo(() => {
        const BoundBaseForm = (p) => <BaseFormOriginal {...p} storeFile={store} />;

        const BoundBaseFormItem = Object.assign(
            (p) => <BaseFormItemOriginal {...p} storeFile={store} />,
            Object.fromEntries(
                Object.entries(inputComponents).map(([key, config]) => [
                    key,
                    (p) => (
                        <BaseFormItemOriginal
                            {...p}
                            storeFile={store}
                            inputComponentProps={{ name: key, ...config }}
                        />
                    ),
                ]),
            ),
        );

        return [BoundBaseForm, BoundBaseFormItem];
    }, [store]);

    const EmptyBaseFormItem = useMemo(
        () =>
            Object.assign(
                () => null,
                Object.fromEntries(Object.keys(inputComponents).map((key) => [key, () => null])),
            ),
        [],
    );


    if (!state?.isFormMounted) {
        return {
            BaseForm: () => null,
            BaseFormItem: EmptyBaseFormItem,
            BaseFormGroup: EmptyBaseFormItem,
        };
    }
    return {
        ...state,
        storeFile: store,
        BaseForm,
        BaseFormItem,
        BaseFormGroup: BaseFormItem,
    };
};
