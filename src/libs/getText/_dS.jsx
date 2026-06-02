import { useMemo } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getText, getText as t } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../baseStore";

const customLib = {
    save: { tr: "Kaydet", en: "Save" },
    cancel: { tr: "İptal", en: "Cancel" },
};
const customObj = { tr: "Kaydet", en: "Save" };

const X = () => {
    const [language, languageList, textLibrary] = baseStore.useGlobal((s) => [
        s.language,
        s.languageList,
        s.textLibrary,
    ]);
    const { output, output2, output3, set } = baseStore.useLocal({
        output: null,
        output2: null,
        output3: null,
    });
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    const prettyTextLibrary = useMemo(
        () => JSON.stringify(textLibrary ?? {}, null, 2),
        [textLibrary],
    );

    return (
        <Ds.page
            title="getText()"
            releasedOn="1.0.0"
            description={
                <>
                    Resolves localized text entries.
                    <br />
                    <br />
                    The text library is located at <i>'constants.TEXT_LIBRARY'</i> in the base code.
                    Users can override the default text library with{" "}
                    <i>'PROJECT_SETTINGS.textLibrary'</i>. There is no language limit; only matching
                    language codes are needed. Project language settings are defined by{" "}
                    <i>'PROJECT_SETTINGS.globalBaseStoreVariables.defaultlanguage'</i> and{" "}
                    <i>'PROJECT_SETTINGS.globalBaseStoreVariables.languageList'</i>.
                    <br />
                    <br />
                    You can access the text library directly via <i>'globalData.textLibrary'</i>.
                    Language Library and codes are available at <i>'constants.LANGUAGES'</i>. Check
                    out the <Button.string to="/design-system/languages" label="<LANGUAGES>" /> page
                    for more details.
                    <br />
                    <br />
                    getText can also be used as the shortcut function <i>'t()'</i>.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                code={`import { getText } from "${SYS.basePath}";

                        getText("copyContent");
                        t("copyContent");`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex.column gap={0}>
                            <Typo.span>Current Language: "{language}"</Typo.span>
                            <Typo.span>Language List: {JSON.stringify(languageList)}</Typo.span>
                        </Flex.column>
                        <Flex gap={10}>
                            <Button.plain
                                label="getText('copyContent')"
                                {...outputButtonProps({
                                    path: "block1",
                                    activeLabel: "bt1",
                                    fn: getText("copyContent"),
                                })}
                            />
                            <Button.plain
                                label="t('backToHome')"
                                {...outputButtonProps({
                                    path: "block1",
                                    activeLabel: "bt2",
                                    fn: t("backToHome"),
                                })}
                            />
                            <Button.plain
                                label="Unknown text -> t('49')"
                                {...outputButtonProps({
                                    path: "block1",
                                    activeLabel: "bt3",
                                    fn: t("49"),
                                })}
                            />
                        </Flex>
                        <Space size="l" />
                        <Output path="block1" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Using a custom library"
                code={`import { getText } from "${SYS.basePath}";

                        getText("save", customLib);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex.column gap={0}>
                            <Typo.span>const customLib = {JSON.stringify(customLib)}</Typo.span>
                        </Flex.column>
                        <Button.plain
                            label='getText("save", customLib)'
                            {...outputButtonProps({
                                path: "block2",
                                activeLabel: "bt1",
                                fn: getText("save", customLib),
                            })}
                        />
                        <Space size="l" />
                        <Output path="block2" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Using a custom object"
                code={`import { getText } from "${SYS.basePath}";

                        getText(customObj);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex.column gap={0}>
                            <Typo.span>const customObj = {JSON.stringify(customObj)}</Typo.span>
                        </Flex.column>
                        <Button.plain
                            label="getText(customObj)"
                            {...outputButtonProps({
                                path: "block3",
                                activeLabel: "bt1",
                                fn: getText(customObj),
                            })}
                        />
                        <Space size="l" />
                        <Output path="block3" />
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const text = getText(keyOrEntry, overrideLibrary);"
                props={{
                    keyOrEntry: {
                        description: "Text key string or language object.",
                        type: "string | object",
                        required: true,
                    },
                    overrideLibrary: {
                        description: "Optional text library override.",
                        type: "object",
                    },
                }}
                returnProps={{
                    text: {
                        description: "Resolved localized string for the current language.",
                        type: "string",
                    },
                }}
            />
            <Ds.block
                lastBlock
                title="Current textLibrary"
                description="The merged text library from the project settings and the global data."
                code={`import { baseStore } from "${SYS.basePath}";

                       // in react
                       const textLibrary = baseStore.useGlobal(s=>s.textLibrary);

                       // in non-react
                       const textLibrary = baseStore.globalData.get().textLibrary;`}
                example={<Typo.code codeFormat={false}>{prettyTextLibrary}</Typo.code>}
            />
        </Ds.page>
    );
};

export default X;
