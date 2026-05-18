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
        title="useImagesReady()"
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
            args="useImagesReady(fn, { includeErrors, selector })"
            returns="Boolean ready state for matched images."
            props={{
                fn: {
                    description: "Called once after images are ready.",
                    type: "function",
                },
                options: {
                    description: "Detection options.",
                    type: "object",
                    defaultValue: "{}",
                },
                "options.selector": {
                    description: "CSS selector for image elements.",
                    type: "string",
                    defaultValue: '"img"',
                },
                "options.includeErrors": {
                    description: "Treat errored images as ready.",
                    type: "boolean",
                    defaultValue: "true",
                },
            }}
        />
    </Ds.page>
);

export default X;
