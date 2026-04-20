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
                        props={{
                            props: {
                                description: "prop description",
                                type: "prop type",
                                required: true,
                                defaultValue: "prop default value",
                            }
                        }}
                    />`}
        />
        <Ds.api
            props={{
                props: {
                    description: "prop description",
                    type: "prop type",
                    required: true,
                    defaultValue: "prop default value",
                },
            }}
        />
    </Ds.page>
);
export default X;
