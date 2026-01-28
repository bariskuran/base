import { Select } from "../Select";
import { Field } from "../../Field";

const BooleanField = (p) => <Field Component={Boolean} fieldType="select" {...p} />;
export default BooleanField;

//
export const Boolean = (p) => {
    const options = [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
    ];

    /* Return */
    return <Select {...p} inputProps={{ ...p.inputProps, options }} />;
};
