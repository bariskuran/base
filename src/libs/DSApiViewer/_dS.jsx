import { DSBlock } from "../DSBlock";
import { DSPageLayout } from "../DSPageLayout";
import { DSApiViewer } from "./";

const X = () => {
    /* RETURN */
    return (
        <DSPageLayout
            title="DSApiViewer"
            releasedOn="1.0.0"
            description="DSApiViewer Design System dökümantasyon sayfalarında kullanılan Api Tablosu dökümanıdır."
        >
            <DSBlock
                title="Basic Usage"
                code={`import { DSApiViewer } from "base";

<DSApiViewer
    api={[
        {
            name: "prop name",
            description: "prop description",
            type: "prop string",
            required: true,
            defaultValue: "prop default value",
        },
    ]}
/>`}
            />
            <DSApiViewer
                api={[
                    {
                        name: "api",
                        type: "array of objects",
                        description: "Props to be displayed in the table.",
                        required: true,
                        defaultValue: "null",
                    },
                ]}
            />
            <DSBlock
                title="Basic Usage"
                description="The DSApiViewer component is used to display a table of API properties."
                example={<div>test</div>}
                code={`import { DSApiViewer } from "base";

<DSApiViewer
    api={[
        {
            name: "prop name",
            description: "prop description",
            type: "prop string",
            required: true,
            defaultValue: "prop default value",
        },
    ]}
/>`}
            />
        </DSPageLayout>
    );
};
export default X;
