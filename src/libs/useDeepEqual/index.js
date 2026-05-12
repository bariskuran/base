import { useMemo } from "react";
import { isDeepEqual } from "../isDeepEqual";

export const useDeepEqual = (a, b, settings) => {
    return useMemo(() => isDeepEqual(a, b, settings), [a, b, settings]);
};
