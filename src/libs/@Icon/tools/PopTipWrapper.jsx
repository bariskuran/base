import { PopTip } from "../../PopTip";

export const PopTipWrapper = ({ popTipProps, children }) => {
    if (!popTipProps || !popTipProps.content) return children;
    return <PopTip {...popTipProps}>{children}</PopTip>;
};
