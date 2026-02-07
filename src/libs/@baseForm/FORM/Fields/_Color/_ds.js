import S, { Syntax } from "../../DesignSystem/navigationStyles";

const title = "<Color>";
const syn1 = `
// If you want to use tooltip, confirmation etc use FORM version.
    import { FORM } from "dash";
    <FORM.color form = {[label, name, ver]} // ... other props

    import { Color } from "dash";
    <Color ver, value, onChange, inputProps = {{}} /> // Put field props inside inputProps.

// JOINT PROPS
`;

export const Ds = () => (
    <S.container>
        <S.title>{title}</S.title>
        <Syntax>{syn1}</Syntax>
    </S.container>
);
