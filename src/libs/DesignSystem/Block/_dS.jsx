import Ds from "../";
import { SYS } from "../../../constants/SYS";

const X = () => (
    <Ds.page
        title="DSBlock"
        releasedOn="1.0.0"
        description="DSBlock renders a block with a title, description, code, and example. Desing System uses this component to render the blocks in the page."
    >
        <Ds.block
            title="Usage"
            code={`import { Ds } from "${SYS.basePath}";

                    <Ds.block
                        title="Usage"
                        description="This is a description"
                        code={\`import { Ds } from "${SYS.basePath}";\`}
                        example={<div>This is an example</div>}
                    />`}
        />
        <Ds.api
            props={{
                title: {
                    description: "Block's title",
                    type: "string",
                    required: true,
                    defaultValue: "null",
                },
                description: {
                    description: "Block's description",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                code: {
                    description: "Block's code",
                    type: "template literal",
                    required: false,
                    defaultValue: "null",
                },
                example: {
                    description: "Block's example",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                lastBlock: {
                    description:
                        "Whether the block is the last block in the page. ApiViewer uses this automatically to add a circle to the end of the visual.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);
export default X;
