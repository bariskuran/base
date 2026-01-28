import { Tooltip as TooltipOrj } from "antd";
import { useContext, useState, useEffect } from "react";
import { FieldContext } from "../FieldContext";
import { useBase } from "../../../useBase";

export const Tooltip = ({ children }) => {
    const { _fieldApi: { tooltip, popoverId, tooltipPlacement } = {} } = useContext(FieldContext);
    const [activePopover] = useBase((s) => [s.activePopover]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!tooltip || !isOpen || activePopover !== popoverId) return;
        setIsOpen(false);
    }, [activePopover, popoverId]);

    /* Return */
    return (
        <TooltipOrj
            title={tooltip}
            mouseEnterDelay={0.6}
            mouseLeaveDelay={0}
            open={isOpen}
            placement={tooltipPlacement}
            onOpenChange={(boo) => {
                if (boo && activePopover === popoverId) setIsOpen(false);
                else setIsOpen(boo);
            }}
        >
            <>{children}</>
        </TooltipOrj>
    );
};
