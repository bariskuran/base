// Flag/index.jsx
import { useMemo } from "react";
import { flags } from "../Icon/flags";
import { Icon } from "../Icon";

export const Flag = ({ flag, ...props }) => {
    const resolvedFlag = useMemo(() => {
        if (!flag) return flags.global || null;
        return flags[flag] || flags[String(flag).toLowerCase()] || flags.global || null;
    }, [flag]);

    if (!resolvedFlag) return null;

    return <Icon {...props} icon={resolvedFlag} />;
};
