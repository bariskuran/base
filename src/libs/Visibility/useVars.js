import * as React from "react";

export const useVars = ({ visible, content, children } = {}) => {
    const isVisible = Boolean(visible);

    return {
        Activity: React.Activity,
        isVisible,
        activityMode: isVisible ? "visible" : "hidden",
        resolvedContent: content !== undefined ? content : children,
    };
};
