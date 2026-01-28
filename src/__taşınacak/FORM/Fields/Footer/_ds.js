import S, { Syntax, versionsToArray } from "../../DesignSystem/navigationStyles";
import { versions } from "../ButtonArea";
import { useDC } from "../../useDashStore";
import { versions as buttonVersions } from "../Button";
import { FORM } from "../../FORM";

const areaVers = versionsToArray(versions);
const vers = versionsToArray(buttonVersions);
const title = "<FORM.formFooter>";
const desc1 = (
    <p>
        <span>
            FormFooter has 3 defined buttons and triggers formStore's <S.h>onSubmit</S.h>,{" "}
            <S.h>onCancel</S.h>, <S.h>onReset</S.h>. Flex-direction is important for button's
            placement. In V1 version the buttons are right-centred, in V2 version they are
            left-centred.
        </span>
        <span>
            Other styling props overrides <S.h>buttonAreaVer</S.h>
        </span>
    </p>
);

const syn1 = `
import { FORM } from "dash";

<FORM.formFooter 
    buttonAreaVer, // default is V1
    buttonVer, // default is V1
    errorTextAlign, // default is right.
/>
`;

const formStore = FORM.createFormStore();
export const Ds = () => {
    const [ver1, ver2] = useDC(formStore, (s) => [s?.values?.ver1, s?.values?.ver2]);

    /* Return */
    return (
        <S.container>
            <S.title>{title}</S.title>
            <S.description>{desc1}</S.description>
            <Syntax>{syn1}</Syntax>
            <FORM.manager
                settings={{
                    storeFile: formStore,
                    version: undefined,
                    onCancel: () => {
                        console.log("onCancel arrived.");
                    },
                    onReset: () => {
                        console.log("onReset arrived.");
                    },
                    onSubmit: () => {
                        console.log("onSubmit arrived.");
                    },
                }}
            >
                <FORM.select
                    form={["ButtonArea Versions", "ver1"]}
                    options={areaVers}
                    defaultValue="V1"
                />
                <FORM.select form={["Button Versions", "ver2"]} options={vers} defaultValue="V1" />
                <FORM.formFooter form={[]} buttonAreaVer={ver1} buttonVer={ver2} />
            </FORM.manager>
        </S.container>
    );
};
