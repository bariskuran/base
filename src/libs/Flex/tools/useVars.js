import { useMemo } from "react";
import { useExportData } from "../../useExportedData";
import { generateProps } from "./generateProps";
import { baseStore } from "../../@baseStore";

const sysDefaults = {
    direction: "row",
    width: "100%",
    xAlign: "center",
    yAlign: "center",
    gap: 0,
};

export const useVars = ({ props, childrenCount }) => {
    const [currentBreakpoint] = baseStore.useGlobal((s) => [s._clientData.currentBreakpoint]);

    /**
     *
     * VARS
     *
     */
    const generatedProps = useMemo(
        () =>
            generateProps({
                props,
                currentBreakpoint,
                sysDefaults,
                childrenCount,
            }),
        [props, currentBreakpoint],
    );

    console.log(generatedProps);

    /**
     *
     *
     * RETURN
     *
     *
     */
    return useExportData({ exportData: props.exportData, ...generatedProps }, {});
};
