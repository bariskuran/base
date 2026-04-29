import { useRef } from "react";
import { useExportData } from "../../useExportedData";
// import { generateProps } from "./generateProps";
import { baseStore } from "../../@baseStore";
import { useExportedData } from "../../useExportedData";
const sysDefaults = {
    direction: "row",
    width: "100%",
    gap: 0,
};

const calcValues = ({ exportedData: { top, left, bottom, right, edgeMargin, thickness } = {} }) => {
    const extraPaddingValue = edgeMargin * 2 + thickness;

    return { extraPaddingValue };
};

export const useVars = ({ props }) => {
    const [currentBreakpoint] = baseStore.useGlobal((s) => [s._clientData.currentBreakpoint]);
    const contentRef = useRef(null);
    const { exportData: exportDataForScrollBar, ...exportedData } = useExportedData();

    const calculatedValues = calcValues({ exportedData });

    const { width, height, direction, gap } = props || {};

    /**
     *
     *
     * RETURN
     *
     *
     */
    return useExportData(
        {
            exportData: props.exportData,
            exportDataForScrollBar,
            contentRef,
            ...calculatedValues,
            width,
            height,
            direction,
            gap,
        },
        {},
    );
};
