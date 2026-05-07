import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getText } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const customLib = {
    save: { tr: "Kaydet", en: "Save" },
    cancel: { tr: "Iptal", en: "Cancel" },
};

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="getText()"
            releasedOn="1.0.0"
            description="Resolves localized text entries."
        >
            <Ds.block
                title="Basic usage"
                code={`import { getText } from "${SYS.basePath}";

getText("save", { save: { tr: "Kaydet", en: "Save" } });

getText({ tr: "Merhaba", en: "Hello" });`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label='Run getText("save", library)'
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = getText("save", customLib);
                                })
                            }
                        />
                        <Button.string
                            label="Run getText({ tr, en })"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = getText({ tr: "Merhaba", en: "Hello" });
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.code>{output}</Typo.code>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="getText(keyOrEntry, overrideLibrary);"
                returns="Resolved localized string."
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
            />
        </Ds.page>
    );
};

export default X;
