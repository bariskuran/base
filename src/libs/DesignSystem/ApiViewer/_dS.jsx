import Ds from "../";
import { SYS } from "../../../constants/SYS";

const X = () => (
    <Ds.page
        title="DSApiViewer"
        releasedOn="1.0.0"
        description="DSApiViewer renders a structured API table for design system documentation, displaying component props with their name, type, description, and default values in a consistent layout."
    >
        <Ds.block
            title="Usage"
            code={`import { Ds } from "${SYS.basePath}";

                    <Ds.api
                        args="myFn(a, b);"
                        returns="Description of return value."
                        props={{
                            a: {
                                description: "prop description",
                                type: "prop type",
                                required: true,
                                defaultValue: "prop default value",
                            },
                        }}
                    />`}
        />
        <Ds.api
            args='<Ds.api props={{}} args="signature;" returns="…" />'
            props={{
                props: {
                    description: "API table keyed by argument/property name.",
                    type: "object",
                    required: true,
                    defaultValue: "prop default value",
                },
                args: {
                    description: "Callable signature line(s): string or array of strings.",
                    type: "string | string[]",
                },
                returns: {
                    description: "One-line return value summary (functions and hooks).",
                    type: "string",
                },
            }}
        />
    </Ds.page>
);
export default X;
