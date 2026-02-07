import { V1 } from "./versions/V1";
import { V2 } from "./versions/V2";
import { Field } from "../../Field";

const versions = { V1, V2 };

const ButtonAreaField = (p) => <Field Component={ButtonArea} fieldType="buttonArea" {...p} />;
export default ButtonAreaField;

export const ButtonArea = ({
    fromField,
    fieldVersion,
    children,
    direction,
    justify,
    align,
    gap,
    margin,
    width,
    inputProps: {
        buttonAreaVersion,
        direction2,
        justify2,
        align2,
        gap2,
        margin2,
        width2,
        ...restInputProps
    } = {},
    ...p
}) => {
    const Version = versions?.[buttonAreaVersion || fieldVersion] || versions.V1;

    return (
        <Version
            $align={fromField ? align2 : align}
            $justify={fromField ? justify2 : justify}
            $gap={fromField ? gap2 : gap}
            $margin={fromField ? margin2 : margin}
            $direction={fromField ? direction2 : direction}
            $width={fromField ? width2 : width}
            aria-label="Button Area"
            {...(fromField ? restInputProps : p)}
        >
            {children}
        </Version>
    );
};
