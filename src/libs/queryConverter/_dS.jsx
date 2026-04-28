import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { queryConverter } from ".";
import { Typography } from "../Typography";

const obj = { page: 2, filter: { q: "test" }, list: ["a", "b"] };
const qs = queryConverter.export(obj);
const parsed = queryConverter.import(qs);

const X = () => (
    <Ds.page title="<queryConverter>" releasedOn="1.0.0" description="Nested object/query converter.">
        <Ds.block
            title="Export / Import"
            code={`import { queryConverter } from "${SYS.basePath}";

const qs = queryConverter.export({ page: 2, filter: { q: "test" } });
const obj = queryConverter.import(qs);`}
            example={
                <>
                    <Typography.span children={`query: ${qs}`} />
                    <Typography.span children={`parsed: ${JSON.stringify(parsed)}`} />
                </>
            }
        />
        <Ds.api
            props={{
                "queryConverter.export(obj, settings)": {
                    description: "Converts nested object to query string.",
                    type: "(object, object?) => string",
                    required: true,
                    defaultValue: "function",
                },
                "settings.preserveEmpty": { description: "Keeps null/undefined/empty values.", type: "boolean", required: false, defaultValue: "false" },
                "settings.prefix": { description: "Prefix root key.", type: "string", required: false, defaultValue: "undefined" },
                "settings.ignoreEncode": { description: "Skips encodeURIComponent.", type: "boolean", required: false, defaultValue: "false" },
                "queryConverter.import(str, settings)": {
                    description: "Parses query string back to object.",
                    type: "(string, object?) => object",
                    required: true,
                    defaultValue: "function",
                },
                "settings.preserveBooleans": { description: "Keeps boolean-like values as strings.", type: "boolean", required: false, defaultValue: "false" },
                "settings.preserveNumbers": { description: "Keeps number-like values as strings.", type: "boolean", required: false, defaultValue: "false" },
            }}
        />
    </Ds.page>
);

export default X;
