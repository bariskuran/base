import { V1 } from "./versions/V1";
import { V2 } from "./versions/V2";
import { Field } from "../../Field";

const versions = { V1, V2 };

const FooterField = (p) => <Field Component={Footer} fieldType="footer" disableHelper {...p} />;
export default FooterField;

//
export const Footer = (p = {}) => {
    const { fieldVersion, ...rest } = p;
    const Version = versions?.[fieldVersion] || versions.V1;
    return <Version {...rest} />;
};
