import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getText } from ".";
import { Typo } from "../Typo";

const customLib = {
    save: { tr: "Kaydet", en: "Save" },
    cancel: { tr: "Iptal", en: "Cancel" },
};

const X = () => (
    <Ds.page title="<getText>" releasedOn="1.0.0" description="Resolves localized text entries.">
        <Ds.block
            title="Basic Usage"
            code={`import { getText } from "${SYS.basePath}";

getText("save", { save: { tr: "Kaydet", en: "Save" } });
getText({ tr: "Merhaba", en: "Hello" });`}
            example={
                <>
                    <Typo.span children={`key+library: ${getText("save", customLib)}`} />
                    <Typo.span
                        children={`entry object: ${getText({ tr: "Merhaba", en: "Hello" })}`}
                    />
                </>
            }
        />
        <Ds.api
            props={{
                keyOrEntry: {
                    description: "Text key string or language object.",
                    type: "string | object",
                    required: true,
                    defaultValue: "undefined",
                },
                overrideLibrary: {
                    description: "Optional text library override.",
                    type: "object",
                    required: false,
                    defaultValue: "undefined",
                },
                return: {
                    description: "Resolved text string.",
                    type: "string",
                    required: true,
                    defaultValue: '""',
                },
            }}
        />
    </Ds.page>
);

export default X;
