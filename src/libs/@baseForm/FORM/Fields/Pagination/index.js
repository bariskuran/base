import { useEffect, useMemo } from "react";
import { Field } from "../../Field";
import SelectField from "../Select";
import { useDC } from "../../../useDashStore";
import { useBase } from "../../../useBase";
import { definePageOptions, Line, Container, defaults } from "./_functions";
import { limitOptions, directionOptions } from "./_functions";

export const Pagination = ({
    defaultPage,
    defaultLimit,
    defaultOrderBy,
    defaultOrderByDirection,
    ...props
}) => {
    /* */
    return (
        <Field
            label="Pagination"
            {...props}
            Component={PaginationBase}
            fieldType="pagination"
            hideClear
            multipleFields={{
                page: { defaultValue: defaultPage || defaults.page },
                limit: { defaultValue: defaultLimit || defaults.limit },
                orderBy: { defaultValue: defaultOrderBy || defaults.orderBy },
                orderByDirection: {
                    defaultValue: defaultOrderByDirection || defaults.orderByDirection,
                },
            }}
        />
    );
};
export default Pagination;

// This can not be used as a seperate component. It needs Field.
const PaginationBase = (props = {}) => {
    const {
        _formApi: { storeFile, setValues, setDefaultValues, setLastSubmittedValues } = {},
        formState: {
            fields: { orderBy: { defaultValue: defaultValueForOrderBy } = {} } = {},
            values: { limit, orderBy, orderByDirection, page, columnOrder } = {},
        } = {},
        inputProps: { totalKey } = {},
    } = props;
    const [columns, total] = useDC(storeFile, (s) => [s.pageSettings?.columns, s.meta?.[totalKey]]);
    const [isApiLoading] = useBase((s) => [s.isApiLoading]);
    const pageOptions = useMemo(() => definePageOptions(total, limit), [total, limit]);

    /* update page value, if page is bigger than 1 and limit is higher than total */
    useEffect(() => {
        if (total && limit && !isApiLoading && page > 1 && limit > total) {
            setValues({ page: 1 }, { submitAfterSet: true });
        }
    }, [total, limit]);

    /** Auto Correction for orderBy.value and orderBy.defaultValue
     * orderByOptions is dynamic. Therefore, it should be checked whether the default values are in dynamic orderByOptions at the first start.
     * The orderBy value requested by the FE or the component's own defaults.orderBy value is assigned as default when the field is mounted.
     * However, this should be checked later as "orderByOptions" are assigned.
     * Also, if the orderByOptions change, the same effect must trigger again.
     */
    useEffect(() => {
        // seçili orderBy visible mı kontrol et.
        const find1 = columns?.find((o) => o.name === orderBy);
        if (find1?.visible) return;

        const getNewOrderBy = () => {
            // defaultOrderBy visible mı kontrol et.
            const find2 = columns?.find((o) => o.name === defaultValueForOrderBy);
            if (find2?.visible) return defaultValueForOrderBy;

            // sistem defaultu visible mı kontrol et.
            const find3 = columns?.find((o) => o.name === defaults.orderBy);
            if (find3?.visible) return defaults.orderBy;

            // hiçbiri değilse, ilk görünen visible'ı dön.
            return columns?.filter((it) => it.visible)?.[0]?.label;
        };

        const newOrderBy = getNewOrderBy();
        const pack = { orderBy: newOrderBy, limit, orderByDirection, page };
        setDefaultValues?.(pack);
        setLastSubmittedValues?.(pack);
        setValues?.(pack);
    }, [columnOrder]);

    /* */
    return (
        <Container>
            <SelectField
                disableHelper
                nameAndLabel="page"
                options={pageOptions}
                enableAbsoluteLabel
                hideClear
            />
            <Line />
            <SelectField
                disableHelper
                nameAndLabel="limit"
                options={limitOptions}
                enableAbsoluteLabel
                hideClear
            />
            <Line />
            <SelectField
                nameAndLabel="orderBy"
                disableHelper
                options={columns?.filter((it) => it.visible)}
                valueKey="name"
                labelKey="label"
                enableAbsoluteLabel
                hideClear
            />
            <Line />
            <SelectField
                disableHelper
                name="orderByDirection"
                label="Direction"
                options={directionOptions}
                enableAbsoluteLabel
                hideClear
            />
        </Container>
    );
};

/**
 *
 *
 *
 * PAGINATION VERSION1 - This is an example to how to use inner FORM.context for complex components.
 * But, if you need to just place couple of fields under the same Field Helper, you can use PAGINATION2 approach.
 *
 *
 *  */

// import { useMemo, useEffect } from "react";
// import styled, { css } from "styled-components";
// import { FORM } from "../../index";
// import { useDS } from "../../../useDashStore";

// const defaults = {
//     orderBy: "id",
//     limit: 50,
//     orderByDirection: "desc",
// };
// const S = {
//     conName: "paginationContext",
//     defaultOrderBy: "id",
//     defaultValues: (defaultOrderBy, defaultLimit, defaultOrderByDirection) => ({
//         page: 1,
//         limit: defaultLimit || defaults.limit,
//         orderBy: defaultOrderBy || defaults.orderBy,
//         orderByDirection: defaultOrderByDirection || defaults.orderByDirection,
//     }),
//     limitOptions: [
//         { value: 10, label: 10 },
//         { value: 50, label: 50 },
//         { value: 100, label: 100 },
//     ],
//     directionOptions: [
//         { value: "asc", label: "Ascending" },
//         { value: "desc", label: "Descending" },
//     ],
//     getIndex: (o, columnOrder) => {
//         const index = columnOrder.findIndex((c) => c.name === o.value);
//         return index === -1 ? Infinity : index;
//     },
//     container: styled.div`
//         ${() => css`
//             display: flex;
//             gap: 10rem;
//         `}
//     `,
//     definePageOptions: (total, limit) => {
//         if (!total || !limit) return [];
//         const maxPageNumber = Math.ceil(total / limit);
//         if (maxPageNumber <= 0 || maxPageNumber > 1000) return [];
//         return Array.from({ length: maxPageNumber }, (_, i) => ({
//             value: i + 1,
//             label: i + 1,
//         }));
//     },
// };

// export const Pagination = ({ defaultOrderBy, defaultLimit, defaultOrderByDirection, ...props }) => {
//     return (
//         <FORM.field
//             nameAndLabel="pagination"
//             defaultValue={S.defaultValues(defaultOrderBy, defaultLimit, defaultOrderByDirection)}
//             {...props}
//             Component={PaginationContext}
//             fieldType="pagination"
//         />
//     );
// };

// const PaginationContext = (props = {}) => {
//     const {
//         fieldVersion,
//         onChange,
//         name,
//         defaultValue,
//         value,
//         value: { limit, orderBy, orderByDirection, page } = {},
//         _formApi: { setValues, setDefaultValues, setLastSubmittedValues } = {},
//         inputProps: { total, columns: { columnOrder, orderByOptions = {} } = {} } = {},
//     } = props;
//     const [innerState, innerStoreFile] = useDS({}, { returnStoreFile: true });
//     const form = innerState?.[S.conName];
//     const {
//         _formApi: { setValues: innerSetValues } = {},
//         values: {
//             page: innerPage,
//             limit: innerLimit,
//             orderBy: innerOrderBy,
//             orderByDirection: innerOrderByDirection,
//         } = {},
//     } = form || {};
//     const pageOptions = useMemo(() => S.definePageOptions(total, limit), [total, limit]);

//     /**
//      * onChange
//      */
//     const handleChange = ({ values }) => {
//         onChange(values, name);
//     };

//     /**
//      * orderByOptions is dynamic. Therefore, it should be checked whether the default values are in dynamic orderByOptions at the first start.
//      * The orderBy value requested by the FE or the component's own defaults.orderBy value is assigned as default when the field is mounted. However, this should be checked later as "orderByOptions" are assigned.
//      * Also, if the orderByOptions change, the same effect must trigger again.
//      * */
//     useEffect(() => {
//         const findIndex = orderByOptions.findIndex((o) => o.value === orderBy);
//         if (findIndex < 0) {
//             const findIndexForDefault = orderByOptions.findIndex(
//                 (o) => o.value === defaults.orderBy,
//             );
//             const newOrderBy = findIndexForDefault ? defaults.orderBy : orderByOptions[0].value;

//             setDefaultValues({
//                 pagination: {
//                     orderBy: newOrderBy,
//                     limit,
//                     orderByDirection,
//                     page,
//                 },
//             });
//             setLastSubmittedValues({
//                 pagination: {
//                     orderBy: newOrderBy,
//                     limit,
//                     orderByDirection,
//                     page,
//                 },
//             });
//             setValues({
//                 pagination: {
//                     orderBy: newOrderBy,
//                     limit,
//                     orderByDirection,
//                     page,
//                 },
//             });
//         }
//     }, [orderByOptions]);

//     /**
//      *
//      */
//     useEffect(() => {
//         if (
//             !innerSetValues ||
//             (orderBy === innerPage &&
//                 orderByDirection === innerLimit &&
//                 page === innerOrderBy &&
//                 limit === innerOrderByDirection)
//         ) {
//             return;
//         }

//         innerSetValues({ orderBy, orderByDirection, page, limit });
//     }, [value]);

//     /* */
//     return (
//         <FORM.context
//             storeFile={innerStoreFile}
//             formName={S.conName}
//             fieldVersion={fieldVersion || "V2"}
//             helperVersion="V2"
//             disableHelper
//             onChange={handleChange}
//             flexDirection="row"
//             flexGap={0}
//             flexJustify="center"
//             flexAlign="center"
//         >
//             <FORM.select
//                 nameAndLabel="page"
//                 options={pageOptions}
//                 defaultValue={defaultValue.page}
//                 style={{ width: 75 }}
//                 enableAbsoluteLabel
//                 hideClear
//             />
//             <FORM.verLine />
//             <FORM.select
//                 nameAndLabel="limit"
//                 options={S.limitOptions}
//                 defaultValue={defaultValue.limit}
//                 style={{ width: 75 }}
//                 enableAbsoluteLabel
//                 hideClear
//             />
//             <FORM.verLine />
//             <FORM.select
//                 nameAndLabel="orderBy"
//                 options={orderByOptions}
//                 defaultValue={defaultValue.orderBy}
//                 filterSort={(a, b) => S.getIndex(a, columnOrder) - S.getIndex(b, columnOrder)}
//                 enableAbsoluteLabel
//                 hideClear
//             />
//             <FORM.verLine />
//             <FORM.select
//                 nameAndLabel="orderByDirection"
//                 options={S.directionOptions}
//                 defaultValue={defaultValue.orderByDirection}
//                 enableAbsoluteLabel
//                 hideClear
//                 isLast
//             />
//         </FORM.context>
//     );
// };
