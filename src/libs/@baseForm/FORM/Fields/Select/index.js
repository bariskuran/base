import { useEffect } from "react";
import { V1 } from "./versions/V1";
import { V2 } from "./versions/V2";
import { Icon } from "../../../Icon";
import { useDS } from "../../../useDashStore";
import { useEffectAfterMount } from "../../../useEffectAfterMount";
import { useDebouncedFunction } from "../../../useDebouncedFunction";
import { fn } from "./_functions";
import { Field } from "../../Field";

export const versions = { V1, V2 };

const SelectField = (p) => <Field Component={Select} fieldType="select" {...p} />;
export default SelectField;

export const SelectMultipleField = (p) => (
    <Field Component={Select} fieldType="select" allowMultiple {...p} />
);

export const Select = (props = {}) => {
    const {
        fromField,
        focusManually,
        fieldRef,
        isDropdownOpen,
        name,
        label,
        enableAbsoluteLabel,
        value,
        fieldVersion,
        onBlur,
        onChange,
        onClick,
        onFocus,
        onClear,
        onDropdownVisibleChange,
        searchAt,
        valueKey = "value",
        labelKey = "label",
        sortOrderBy, // to enable auto sort for options, use this.
        sortOrderByDirection, // asc is default

        // dropdownActions,
        inputProps: {
            options = [],
            allowMultiple,
            maxTagCount = "multiple",
            dropdownRender,
            // filterOption: externalFilterOption,
            filterSort: externalFilterSort,
            ...restInput
        } = {},
        //
        ...restP
    } = props;
    const Comp = versions?.[fieldVersion] || versions.V1;
    /* Inner State */
    const { allOptions, displayedOptions, set } = useDS({ allOptions: [], displayedOptions: [] });

    /* Functions */
    const filterOption = (searchInput, option) =>
        fn.filterOption({ searchInput, option, searchAt, labelKey });
    const filterSort = (a, b) =>
        fn.filterSort({ a, b, value, labelKey, valueKey, sortOrderBy, sortOrderByDirection });
    const dropdownRenderFn = (menu) => fn.dropdownRender({ menu, props });

    /* Debounced Search */
    const debouncedSearch = useDebouncedFunction(
        (searchInput) => {
            if (!searchInput) {
                set({ displayedOptions: allOptions.slice(0, 50) });
            } else {
                const filtered = allOptions.filter((option) => filterOption(searchInput, option));
                set({ displayedOptions: filtered.slice(0, 50) });
            }
        },
        { debounceDelay: 500 },
    );

    /* Effects */
    useEffect(() => {
        set({ allOptions: options, displayedOptions: options.slice(0, 50) });
    }, [options]);

    useEffectAfterMount(() => {
        if (focusManually === 0) return;
        fieldRef?.current?.focus();
    }, [focusManually]);

    /* Return */
    return (
        <Comp
            ref={fieldRef}
            fieldNames={{ label: labelKey, value: valueKey }}
            showSearch
            autoClearSearchValue
            value={value}
            options={displayedOptions}
            enableAbsoluteLabel={enableAbsoluteLabel}
            suffixIcon={<Icon icon={isDropdownOpen ? "arrowLeft" : "arrowDown"} width={11} />}
            //
            onClick={onClick}
            onChange={(v) => {
                onChange(v, name);
            }}
            onClear={onClear}
            onFocus={onFocus}
            onBlur={onBlur}
            onDropdownVisibleChange={onDropdownVisibleChange}
            showAction={["focus"]} // dışarıdan gelen focusManually'de dropdown'un açılmasını sağlıyor.
            //
            // filterOption={externalFilterOption || filterOption}
            filterOption={false}
            onSearch={(searchInput) => debouncedSearch(searchInput)}
            filterSort={externalFilterSort || filterSort}
            //
            mode={allowMultiple ? "multiple" : undefined}
            maxTagCount={maxTagCount}
            dropdownRender={dropdownRender || dropdownRenderFn}
            popupMatchSelectWidth={false}
            //
            placeholder={label}
            style={{ width: "100%", minWidth: "50rem" }}
            {...(fromField ? restInput : restP)}
        />
    );
};
