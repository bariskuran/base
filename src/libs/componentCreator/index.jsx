import { baseStore } from "../@baseStore";
import { useUiComponentsContext } from "../ContextProviderForUiComponents";

export const componentCreator = ({
    name,
    BaseComp,
    DefaultVariant,
    CleanVariant,
    variants = {},
}) => {
    function Main(props) {
        const {
            variant: variantFromProps,
            __hasParentUiComponent: hasParentFromProps,
            ...rest
        } = props || {};

        const uiContext = useUiComponentsContext();
        const __hasParentUiComponent = hasParentFromProps ?? uiContext.__hasParentUiComponent;

        const globalData = baseStore.globalData?.get?.() || {};
        const globalDefaultVariant = globalData?.defaultVariants?.[name];

        const canUseCleanVariant =
            !variantFromProps && __hasParentUiComponent && CleanVariant != null;

        const incomingVariant =
            variantFromProps ??
            (canUseCleanVariant ? CleanVariant : undefined) ??
            globalDefaultVariant ??
            DefaultVariant;

        if (typeof incomingVariant === "string" && variants[incomingVariant]) {
            const presetValue = variants[incomingVariant];
            const presetProps =
                typeof presetValue === "function" ? presetValue(rest) : presetValue || {};

            const { variant: nestedVariant, ...otherPresetProps } = presetProps || {};

            return (
                <BaseComp
                    {...otherPresetProps}
                    {...rest}
                    __hasParentUiComponent={__hasParentUiComponent}
                    Variant={nestedVariant || DefaultVariant}
                />
            );
        }

        return (
            <BaseComp
                {...rest}
                __hasParentUiComponent={__hasParentUiComponent}
                Variant={incomingVariant || DefaultVariant}
            />
        );
    }

    Object.defineProperty(Main, "displayName", {
        value: name,
        writable: false,
        configurable: false,
    });

    Object.entries(variants || {}).forEach(([key, presetValue]) => {
        const Preset = function Preset(props) {
            const { __hasParentUiComponent, ...restProps } = props || {};

            const presetProps =
                typeof presetValue === "function" ? presetValue(restProps) : presetValue || {};

            const { variant: nestedVariant, ...otherPresetProps } = presetProps || {};

            return (
                <BaseComp
                    {...otherPresetProps}
                    {...restProps}
                    __hasParentUiComponent={__hasParentUiComponent}
                    Variant={nestedVariant || DefaultVariant}
                />
            );
        };

        Object.defineProperty(Preset, "displayName", {
            value: `${name}.${key}`,
            writable: false,
            configurable: false,
        });

        Main[key] = Preset;
    });

    return Main;
};
