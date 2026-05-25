import Ds from "../";
import { SYS } from "../../../constants/SYS";

const X = () => (
    <Ds.page
        title="DSCodeViewer"
        releasedOn="1.0.0"
        description="Renders formatted code via Typo.code (dedent, JSX/call formatting, copy). Shell adds monospace font, tab size, and optional max height."
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
            args='<Ds.codeViewer code="" />'
            props={{
                code: {
                    description: "Code content to render. If not provided, children will be used.",
                    type: "string",
                    required: true,
                },
                children: {
                    description: "Alternative content source for the code area.",
                    type: "node",
                },
                as: {
                    description: "Root element type.",
                    type: "string",
                    defaultValue: "pre",
                },
                tabSize: {
                    description: "Controls the visual tab size of the rendered code.",
                    type: "number",
                    defaultValue: "4",
                },
                padding: {
                    description: "Inner spacing of the viewer.",
                    type: "number",
                    defaultValue: "12",
                },
                radius: {
                    description: "Border radius of the viewer.",
                    type: "number",
                    defaultValue: "12",
                },
                bg: {
                    description: "Background color of the viewer.",
                    type: "string",
                },
                color: {
                    description: "Text color of the code content.",
                    type: "string",
                },
                maxHeight: {
                    description: "Maximum height of the viewer before scrolling.",
                    type: "number | string",
                },
                wrap: {
                    description: "Enables line wrapping for long code lines.",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
