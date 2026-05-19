import { useMemo } from "react";
import { baseStore } from "../../@baseStore";
import { DefaultHelper } from "../DefaultHelper";
import { cleanFalsyValues } from "../../cleanFalsyValues";

/**
 *
 * helper ayarları globalData içerisinde, _baseFormSettings içerisinde tutulur.
 * helperMode "enabled" | "disabled" | "auto"
 * HelperComponent
 *
 */

const Passthrough = ({ children }) => children ?? null;

export const useHelper = ({
    storeFile,
    field = {},
    itemProps: {
        helperMode: helperModeFromItem,
        HelperComponent: HelperComponentFromItem,
        label,
        componentName,
        onKeyEnter,
        onKeyDown,
        onKeyUp,
        onMouseEnter,
        onMouseLeave,
        prefix,
        suffix,
        disabled,
        hidden,
        description,
        tooltip,
        variant,
        flexColumn,
        /* eslint-disable */
        children,
        /* eslint-enable */
        ...rest
    } = {},
}) => {
    const [baseFormSettings] = baseStore.useGlobal((s) => [s._baseFormSettings]);
    const { helperMode: helperModeGlobal = "auto", HelperComponent: HelperComponentGlobal } =
        baseFormSettings || {};

    const helperProps = useMemo(() => {
        const helperMode = helperModeFromItem ?? helperModeGlobal ?? "auto";

        const shouldUseHelper =
            helperMode === "enabled"
                ? true
                : helperMode === "disabled"
                  ? false
                  : !!field?.isMainItem;

        return cleanFalsyValues(
            {
                helperMode,
                shouldUseHelper,
                storeFile,
                name: field.name,
                field,
                label,
                componentName,
                prefix,
                suffix,
                disabled,
                hidden,
                description,
                tooltip,
                flexColumn,
                rest,
            },
            { only: ["undefined"] },
        );
    }, [label, prefix, suffix, disabled, hidden, description, tooltip, variant, field]);

    // const HelperComponent = helperProps.shouldUseHelper
    //     ? HelperComponentFromItem || HelperComponentGlobal || DefaultHelper
    //     : Passthrough;
    const HelperComponent = HelperComponentFromItem || HelperComponentGlobal || DefaultHelper;

    return {
        HelperComponent,
        helperProps,
    };
};
