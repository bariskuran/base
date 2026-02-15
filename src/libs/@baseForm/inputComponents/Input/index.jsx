export const Input = ({
    value,
    onChange,
    onPressEnter, // ignore
    onClear, // ignore
    isDirty, // ignore
    isTouched, // ignore
    isFocused, // ignore
    isHovered, // ignore
    fieldType, // ignore
    ...rest
}) => {
    return (
        <input
            {...rest}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") onPressEnter?.(e);
            }}
        />
    );
};
