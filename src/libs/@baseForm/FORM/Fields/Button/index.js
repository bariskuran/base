import { useBase } from "../../../useBase";
import { V1 } from "./versions/V1";
import { V2 } from "./versions/V2";
import { V2_narrow } from "./versions/V2";
import { V3 } from "./versions/V3";
import { Field } from "../../Field";

export const versions = { V1, V2, V2_narrow, V3 };

const ButtonField = (p) => <Field Component={Button} fieldType="button" {...p} />;
export default ButtonField;

export const Button = (props) => {
    const { fieldVersion, fieldRef, inputProps, ...p } = props;
    const [isMenuOpen] = useBase((s) => [s.isMenuOpen]);
    const isMobile = isMenuOpen === "mobile";
    const Version = versions?.[fieldVersion] || versions.V1;

    /* Return */
    return (
        <Version
            ariaLabel={fieldVersion}
            fieldRef={fieldRef}
            isMobile={isMobile}
            inputProps={inputProps}
            {...p}
        />
    );
};
