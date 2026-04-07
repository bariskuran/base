import { baseStore } from "../@baseStore";

export const componentCreator = (name, BaseComp, DefaultVariant, variants = {}) => {
    function Main(props) {
        const { variant: variantFromProps, ...rest } = props || {};

        const globalData = baseStore.globalData?.get?.() || {};
        const globalDefaultVariant = globalData?.defaultVariants?.[name];

        const incomingVariant = variantFromProps ?? globalDefaultVariant ?? DefaultVariant;

        if (typeof incomingVariant === "string" && variants[incomingVariant]) {
            const presetValue = variants[incomingVariant];
            const presetProps =
                typeof presetValue === "function" ? presetValue(rest) : presetValue || {};

            const { variant: nestedVariant, ...otherPresetProps } = presetProps || {};

            return (
                <BaseComp
                    {...rest}
                    {...otherPresetProps}
                    Variant={nestedVariant || DefaultVariant}
                />
            );
        }

        return <BaseComp {...rest} Variant={incomingVariant || DefaultVariant} />;
    }

    Object.defineProperty(Main, "displayName", {
        value: name,
        writable: false,
        configurable: false,
    });

    Object.entries(variants || {}).forEach(([key, presetValue]) => {
        const Preset = function Preset(props) {
            const presetProps =
                typeof presetValue === "function" ? presetValue(props) : presetValue || {};

            const { variant: nestedVariant, ...otherPresetProps } = presetProps || {};

            return (
                <BaseComp
                    {...props}
                    {...otherPresetProps}
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
