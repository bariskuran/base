import { useVars } from "./useVars";

const Preserve = ({ visible, content, children }) => {
    const { Activity, isVisible, activityMode, resolvedContent } = useVars({
        visible,
        content,
        children,
    });

    if (Activity) {
        return <Activity mode={activityMode}>{resolvedContent}</Activity>;
    }

    return <div style={{ display: isVisible ? "contents" : "none" }}>{resolvedContent}</div>;
};

const Mount = ({ visible, content, children }) => {
    const { isVisible, resolvedContent } = useVars({ visible, content, children });
    return isVisible ? resolvedContent : null;
};

export const Visibility = Preserve;

Visibility.preserve = Preserve;
Visibility.mount = Mount;
Visibility.displayName = "Visibility";
Mount.displayName = "Visibility.mount";
