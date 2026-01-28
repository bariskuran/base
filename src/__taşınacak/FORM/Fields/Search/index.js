import { Input } from "../Input";
import { Field } from "../../Field";

const SearchField = (p) => (
    <Field
        {...p}
        name="search"
        fieldType="input"
        label="Search"
        labelIcon="search"
        Component={Input}
        // triggerSubmitOnEnter
    />
);
export default SearchField;
