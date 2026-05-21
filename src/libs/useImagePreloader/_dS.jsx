import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useImagePreloader } from ".";
import { Typo } from "../Typo";

const Demo = () => {
    const isLoaded = useImagePreloader(
        ["https://picsum.photos/80/80?random=1", "https://picsum.photos/80/80?random=2"],
        { delayAfterLoad: 200 },
    );

    return <Typo.span>{`images loaded: ${String(isLoaded)}`}</Typo.span>;
};

const X = () => (
    <Ds.page
        title="useImagePreloader()"
        releasedOn="1.0.0"
        description="Preloads image URLs and returns readiness state."
    >
        <Ds.block
            title="Preload Image List"
            code={`import { useImagePreloader } from "${SYS.basePath}";

                        const isLoaded = useImagePreloader(["/a.png", "/b.png"], { delayAfterLoad: 150 });`}
            example={<Demo />}
        />
        <Ds.api
            args="const isLoaded = useImagePreloader(images, { delayAfterLoad });"
            props={{
                images: {
                    description: "List of image URLs.",
                    type: "string[]",
                    required: true,
                },
                delayAfterLoad: {
                    description: "Extra delay after load completes.",
                    type: "number",
                    defaultValue: "0",
                },
            }}
            returnProps={{
                isLoaded: {
                    description: "True when all images finished loading (or preload completed).",
                    type: "boolean",
                },
            }}
        />
    </Ds.page>
);

export default X;
