import S, { Syntax } from "../../DesignSystem/navigationStyles";

const title = "<Radio>";
const syn1 = `
// If you want to use tooltip, confirmation etc use FORM version.

    <FORM.radio
                nameAndLabel="method"
                options={[
                    { value: "copyUrl", label: "Copy Url" },
                    { value: "copyShortenUrl", label: "Copy Shorten Url" },
                ]}

`;

export const Ds = () => (
    <S.container>
        <S.title>{title}</S.title>
        <Syntax>{syn1}</Syntax>
    </S.container>
);
