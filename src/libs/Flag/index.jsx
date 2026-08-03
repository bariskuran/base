
import { useMemo } from "react";
import { hasBuiltInFlag } from "./flags";
import { Icon } from "../Icon";

export const Flag = ({ flag, ...props }) => {
    const resolvedFlag = useMemo(() => {
        if (!flag) return "global";
        const normalized = String(flag).toLowerCase();
        return hasBuiltInFlag(normalized) ? normalized : "global";
    }, [flag]);

    if (!resolvedFlag) return null;

    return <Icon {...props} icon={resolvedFlag} isFlag />;
};
