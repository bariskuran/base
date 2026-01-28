import S, { Syntax } from "../../DesignSystem/navigationStyles";

const title = "<ButtonCancel> <ButtonReset> <ButtonSubmit>";
const desc1 = (
    <p>
        <span>
            When these 3 components are used under FORM.manager, they can trigger the manager's
            specified functions such as submit, reset.
        </span>
    </p>
);

const syn1 = `
    import { FORM } from "dash";
    <FORM.buttonSubmit />
    <FORM.buttonReset />
    <FORM.buttonCancel />
/>
`;

export const Ds = () => (
    <S.container>
        <S.title>{title}</S.title>
        <S.description>{desc1}</S.description>
        <Syntax>{syn1}</Syntax>
    </S.container>
);
