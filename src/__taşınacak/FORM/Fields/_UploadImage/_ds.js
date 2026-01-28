import S, { Syntax } from "../../DesignSystem/navigationStyles";

const title = "<UploadImage>";
const syn1 = `
// If you want to use tooltip, confirmation etc use FORM version.
    import { FORM } from "dash";
    <FORM.uploadImage form = {[label, name, ver]} // ... other props

    import { UploadImage } from "dash";
    <UploadImage ver, value, onChange, inputProps = {{}} /> // Put field props inside inputProps.

`;

export const Ds = () => (
    <S.container>
        <S.title>{title}</S.title>
        <Syntax>{syn1}</Syntax>
    </S.container>
);
