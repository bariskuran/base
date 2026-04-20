import Ds from "../";
import { SYS } from "../../../constants/SYS";

const X = () => (
    <Ds.page
        title="DSCodeViewer"
        releasedOn="1.0.0"
        description="DSCodeViewer renders formatted code content inside a scrollable area and includes a built-in copy button."
    >
        <Ds.block
            title="Usage"
            code={`import { Ds } from "${SYS.basePath}";

                <Ds.codeViewer
                    code={\`const hello = "world";
                        function test() {
                        console.log(hello);
                    }}\`}
                />`}
        />
        <Ds.api
            props={{
                code: {
                    description: "Code content to render. If not provided, children will be used.",
                    type: "string",
                    required: true,
                    defaultValue: "null",
                },
                children: {
                    description: "Alternative content source for the code area.",
                    type: "node",
                    required: false,
                    defaultValue: "null",
                },
                as: {
                    description: "Root element type.",
                    type: "string",
                    required: false,
                    defaultValue: "pre",
                },
                tabSize: {
                    description: "Controls the visual tab size of the rendered code.",
                    type: "number",
                    required: false,
                    defaultValue: "4",
                },
                padding: {
                    description: "Inner spacing of the viewer.",
                    type: "number",
                    required: false,
                    defaultValue: "12",
                },
                radius: {
                    description: "Border radius of the viewer.",
                    type: "number",
                    required: false,
                    defaultValue: "12",
                },
                bg: {
                    description: "Background color of the viewer.",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                color: {
                    description: "Text color of the code content.",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                maxHeight: {
                    description: "Maximum height of the viewer before scrolling.",
                    type: "number | string",
                    required: false,
                    defaultValue: "null",
                },
                wrap: {
                    description: "Enables line wrapping for long code lines.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
