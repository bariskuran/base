import { forwardRef } from "react";
import { baseStore } from "../baseStore";
import { useNestedBaseUiContext } from "../NestedBaseUi";

export const componentCreator = ({
    name,
    BaseComp,
    DefaultVariant,
    PlainVariant,
    variants = {},
}) => {

    const resolveVariant = (candidate) => {
        if (candidate == null || candidate === false) return DefaultVariant;
        if (typeof candidate === "string") {
            const preset = variants[candidate];
            return preset != null ? preset : DefaultVariant;
        }
        return candidate;
    };

    const Main = forwardRef(function Main(props, forwardedRef) {
        const {
            variant: variantFromProps,
            __hasParentUiComponent: hasParentFromProps,
            ...rest
        } = props || {};

        const uiContext = useNestedBaseUiContext();
        const __hasParentUiComponent =
            name === "FloatingUi"
                ? false
                : hasParentFromProps ?? uiContext.__hasParentUiComponent;

        const globalData = baseStore.globalData?.get?.() || {};
        const globalDefaultVariant = globalData?.defaultVariants?.[name];

        const canUsePlainVariant =
            !variantFromProps && __hasParentUiComponent && PlainVariant != null;

        const incomingVariant =
            variantFromProps ??
            (canUsePlainVariant ? PlainVariant : undefined) ??
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
                    forwardedRef={forwardedRef}
                    Variant={resolveVariant(nestedVariant)}
                />
            );
        }

        return (
            <BaseComp
                {...rest}
                __hasParentUiComponent={__hasParentUiComponent}
                forwardedRef={forwardedRef}
                Variant={resolveVariant(incomingVariant)}
            />
        );
    });

    Object.defineProperty(Main, "displayName", {
        value: name,
        writable: false,
        configurable: false,
    });

    Object.entries(variants || {}).forEach(([key, presetValue]) => {
        const Preset = forwardRef(function Preset(props, forwardedRef) {
            const { __hasParentUiComponent, ...restProps } = props || {};

            const presetProps =
                typeof presetValue === "function" ? presetValue(restProps) : presetValue || {};

            const { variant: nestedVariant, ...otherPresetProps } = presetProps || {};

            return (
                <BaseComp
                    {...otherPresetProps}
                    {...restProps}
                    __hasParentUiComponent={__hasParentUiComponent}
                    forwardedRef={forwardedRef}
                    Variant={resolveVariant(nestedVariant)}
                />
            );
        });

        Object.defineProperty(Preset, "displayName", {
            value: `${name}.${key}`,
            writable: false,
            configurable: false,
        });

        Main[key] = Preset;
    });

    return Main;
};
