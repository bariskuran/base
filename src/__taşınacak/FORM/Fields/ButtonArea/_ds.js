import S, { Syntax } from "../../DesignSystem/navigationStyles";
import { FORM } from "../../FORM";

const title = "<FORM.buttonArea>";
const desc1 = (
    <p>
        <span>
            A basic flex container for buttons. It is defined as a component to display the buttons
            in the same way in the whole system.
        </span>
    </p>
);

const syn1 = `import {FORM} from "dash";

<FORM.buttonArea>
    ver="", // default is V1
  // below overrides ver
    direction="row" // row is default
    justify="", // flex-end is default
    align="", // center is default
    gap="", // 10 is default
    margin="", // 10 is default. margin top and bottom 
/>
`;

export const Ds = () => {
    /* Return */
    return (
        <S.container>
            <S.title>{title}</S.title>
            <S.description>{desc1}</S.description>
            <Syntax>{syn1}</Syntax>
            <FORM.buttonArea ver="V1">
                <div>but1</div>
                <div>but2</div>
                <div>but3</div>
            </FORM.buttonArea>
            <S.subtitle>gap 50. Other props then ver, overrides ver.</S.subtitle>
            <FORM.buttonArea ver="V1" gap={50}>
                <div>but1</div>
                <div>but2</div>
                <div>but3</div>
            </FORM.buttonArea>
        </S.container>
    );
};
