import { ButtonArea } from "../ButtonArea";
import { Button } from "../Button";
import { Field } from "../../Field";
import styled from "styled-components";
import { sortFunctionAsc } from "../../../sortFunctionAsc";
import { sortFunctionDesc } from "../../../sortFunctionDesc";

const Line = styled.div`
    width: 100%;
    height: 1rem;
    background: ${({ theme }) => theme.foreground};
    margin: 10rem 0;
`;

export const fn = {
    filterOption: ({ searchInput, option, labelKey, searchAt }) => {
        const getLabel = () => option?.[labelKey] || "";
        const searchAtArray = searchAt
            ? typeof searchAt === "object"
                ? searchAt
                : [searchAt]
            : [labelKey];

        if (searchAtArray.length === 0) {
            return getLabel().toString().toLowerCase().includes(searchInput.toLowerCase());
        }

        for (let i = 0; i < searchAtArray.length; i++) {
            const searchAtItem = searchAtArray[i];
            const value = option?.[searchAtItem];
            if (
                typeof value === "string" &&
                value.toLowerCase().includes(searchInput.toLowerCase())
            )
                return true;
            else if (typeof value === "number" && value.toString().includes(searchInput))
                return true;
        }
        return false;
    },
    filterSort: ({ a, b, value, valueKey, sortOrderBy, sortOrderByDirection }) => {
        // Show selectedOptions first.
        if (value) {
            const selectedValues = Array.isArray(value) ? value : [value];
            const isASelected = selectedValues.includes(a[valueKey]);
            const isBSelected = selectedValues.includes(b[valueKey]);

            if (isASelected && !isBSelected) return -1;
            if (!isASelected && isBSelected) return 1;
        }

        // sortOrderBy yoksa sıralamayı durdur
        if (!sortOrderBy) return 0;

        // Then show others in selected orderBy and orderByDirection.
        const [vA, vB] = [a?.[sortOrderBy] || "", b?.[sortOrderBy] || ""];
        const [tVA, tVB, allowed] = [typeof vA, typeof vB, ["string", "number"]];

        // labellar bazen Komponent gelebiliyor. geos'da olduğu gibi. böyle bir durumda sıralama yapamayız.
        if (!allowed.includes(tVA) || !allowed.includes(tVB)) return 0;

        if (sortOrderByDirection === "asc") return sortFunctionAsc(vA, vB);
        return sortFunctionDesc(vA, vB);
    },
    dropdownRender: ({ menu, props }) => {
        const { dropdownActions, inputProps = {} } = props;
        const { dropdownRender } = inputProps;

        if (dropdownRender) return dropdownRender;
        if (!dropdownActions || dropdownActions.length < 1) return menu;

        return (
            <div>
                <ButtonArea justify="flex-start">
                    {dropdownActions.map((action = {}, i) => {
                        return <Field Component={Button} fieldType="button" key={i} {...action} />;
                    })}
                </ButtonArea>
                <Line />
                {menu}
            </div>
        );
    },
};
