import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useImagesReady } from ".";
import { Typo } from "../Typo";

const X = () => {
    const ready = useImagesReady(() => {}, { selector: "img", includeErrors: true });

    return (
        <Ds.page
            title="useImagesReady()"
            releasedOn="1.0.0"
            description="Detects when selected DOM images are ready."
        >
            <Ds.block
                title="Watch DOM Images"
                code={`import { useImagesReady } from "${SYS.basePath}";

                       const isReady = useImagesReady(onReady, { selector: "img", includeErrors: true });`}
                example={<Typo.span>{`document images ready: ${String(ready)}`}</Typo.span>}
            />
            <Ds.api
                args="const isReady = useImagesReady(fn, { includeErrors, selector });"
                props={{
                    fn: {
                        description: "Called once after images are ready.",
                        type: "fn",
                    },
                    includeErrors: {
                        description: "Treat errored images as ready.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    selector: {
                        description: "CSS selector for image elements.",
                        type: "string",
                        defaultValue: '"img"',
                    },
                }}
                returnProps={{
                    isReady: {
                        description: "True once all matched images are considered ready.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
