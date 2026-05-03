import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useImagesReady } from ".";
import { Typo } from "../Typo";

const Demo = () => {
    const ready = useImagesReady(() => {}, { selector: "img", includeErrors: true });
    return <Typo.span>{`document images ready: ${String(ready)}`}</Typo.span>;
};

const X = () => (
    <Ds.page
        title="<useImagesReady>"
        releasedOn="1.0.0"
        description="Detects when selected DOM images are ready."
    >
        <Ds.block
            title="Watch DOM Images"
            code={`import { useImagesReady } from "${SYS.basePath}";

const isReady = useImagesReady(onReady, { selector: "img", includeErrors: true });`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                fn: {
                    description: "Called once after images are ready.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                options: {
                    description: "Detection options.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "options.selector": {
                    description: "CSS selector for image elements.",
                    type: "string",
                    required: false,
                    defaultValue: '"img"',
                },
                "options.includeErrors": {
                    description: "Treat errored images as ready.",
                    type: "boolean",
                    required: false,
                    defaultValue: "true",
                },
                return: {
                    description: "Ready state.",
                    type: "boolean",
                    required: true,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
