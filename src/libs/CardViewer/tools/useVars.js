import { useMemo } from "react";
import { getText as t } from "../../getText";

export const useVars = ({
    items,
    data,
    page = 1,
    pageSize,
    offset = 0,
    emptyText,
    total,
}) => {
    const rawItems = items || data || [];
    const list = Array.isArray(rawItems) ? rawItems : [];

    const visibleItems = useMemo(() => {
        if (!pageSize) return list;
        const start = offset || (Math.max(page, 1) - 1) * pageSize;
        return list.slice(start, start + pageSize);
    }, [list, offset, page, pageSize]);

    const resolvedTotal = total ?? list.length;
    const totalPages = pageSize ? Math.max(Math.ceil(resolvedTotal / pageSize), 1) : 1;

    return {
        list,
        visibleItems,
        isEmpty: list.length === 0,
        resolvedEmptyText: t(emptyText || "emptyCardMap"),
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};
