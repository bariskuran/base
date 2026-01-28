import S, { Syntax } from "../../DesignSystem/navigationStyles";

const title = "<Date> <DateTime>";
const syn1 = `
// If you want to use tooltip, confirmation etc use FORM version.
    import { FORM } from "dash";
    <FORM.date form = {[label, name, ver]} // ... other props
    <FORM.dateTime form = {[label, name, ver]} // ... other props

    import { Date, DateTime } from "dash";
    <Date ver, value, onChange, inputProps = {{}} /> // Put field props inside inputProps.

// JOINT PROPS
    enableTime // false by default. true for dateTime
`;

export const Ds = () => (
    <S.container>
        <S.title>{title}</S.title>
        <Syntax>{syn1}</Syntax>
    </S.container>
);
