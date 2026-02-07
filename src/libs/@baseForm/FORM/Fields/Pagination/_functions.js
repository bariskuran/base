import styled from "styled-components";

export const definePageOptions = (total, limit) => {
    if (!total || !limit) return [{ value: 1, label: 1 }];
    const maxPageNumber = Math.ceil(total / limit);
    if (maxPageNumber <= 0 || maxPageNumber > 1000) return [];
    return Array.from({ length: maxPageNumber }, (_, i) => ({ value: i + 1, label: i + 1 }));
};

export const Line = styled.div`
    width: 1px;
    min-width: 1px;
    background: ${({ theme }) => theme.greyB5};
    height: 100%;
    min-height: 50rem;
`;

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
`;

export const defaults = {
    page: 1,
    orderBy: "id",
    limit: 50,
    orderByDirection: "desc",
};

export const limitOptions = [
    { value: 10, label: 10 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
];

export const directionOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];
