import { Field } from "../../Field";
import { Select } from "./index";

const SelectMultipleField = (p) => (
    <Field Component={Select} fieldType="select" allowMultiple {...p} />
);
export default SelectMultipleField;
