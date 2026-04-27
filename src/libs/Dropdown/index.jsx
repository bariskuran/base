import { useMemo, useState } from "react";
import S from "./_styled.js";
import { sortBy } from "../sortBy";

const DEFAULT_GET_LABEL = (item) => item?.label ?? "";
const DEFAULT_GET_VALUE = (item) => item?.value;
const PLACEHOLDER_VALUE = "__dropdown_placeholder__";
const toValueKey = (value) => `${typeof value}:${String(value)}`;

export const dropdownDefault = "";
export const Dropdown = ({
    options = [],
    value,
    onChange,
    getLabel = DEFAULT_GET_LABEL,
    getValue = DEFAULT_GET_VALUE,
    sortBy: sortOrder = "asc",
    placeholder = "Select an option",
    disabled = false,
}) => {
    const normalized = useMemo(() => {
        const unique = [];
        const seen = new Set();

        for (const item of options || []) {
            const rawValue = getValue(item);
            if (rawValue == null) continue;

            const key = toValueKey(rawValue);
            if (seen.has(key)) continue;
            seen.add(key);

            unique.push({
                key,
                value: rawValue,
                label: String(getLabel(item) ?? ""),
                item,
            });
        }

        if (sortOrder === "none") return unique;
        if (sortOrder === "desc") return [...unique].sort((a, b) => sortBy.desc(a.label, b.label));
        return [...unique].sort((a, b) => sortBy.asc(a.label, b.label));
    }, [getLabel, getValue, options, sortOrder]);

    const selectedKey = value == null ? null : toValueKey(value);
    const selectedOption = selectedKey ? normalized.find((o) => o.key === selectedKey) : null;
    const availableOptions = normalized.filter((o) => o.key !== selectedKey);

    const handleChange = (e) => {
        const key = e.target.value;
        if (!key || key === PLACEHOLDER_VALUE) return;
        const next = availableOptions.find((o) => o.key === key);
        if (!next) return;
        onChange?.(next.value);
    };

    return (
        <S.container>
            <S.select value={PLACEHOLDER_VALUE} onChange={handleChange} disabled={disabled}>
                <option value={PLACEHOLDER_VALUE} disabled>
                    {selectedOption ? selectedOption.label : placeholder}
                </option>
                {availableOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.label}
                    </option>
                ))}
            </S.select>
            {/* <S.helper>
                Selected value: {selectedOption ? String(selectedOption.value) : "-"}
            </S.helper> */}
        </S.container>
    );
};

export const DropdownControlledExample = () => {
    const [value, setValue] = useState("tr");

    return (
        <Dropdown
            value={value}
            onChange={setValue}
            sortBy="asc"
            options={[
                { label: "Turkey", value: "tr" },
                { label: "Germany", value: "de" },
                { label: "France", value: "fr" },
                { label: "Germany Duplicate (hidden)", value: "de" },
            ]}
        />
    );
};
