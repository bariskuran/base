import { useMemo } from "react";
import { debouncedFunction } from "../debouncedFunction";

export const useDebouncedFunction = (fn, settings = {}) =>
    useMemo(() => debouncedFunction(fn, settings), [fn, settings]);
