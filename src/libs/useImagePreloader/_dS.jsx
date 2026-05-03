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
        title="<useImagePreloader>"
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
            props={{
                images: {
                    description: "List of image URLs.",
                    type: "string[]",
                    required: false,
                    defaultValue: "[]",
                },
                options: {
                    description: "Preloader options.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "options.delayAfterLoad": {
                    description: "Extra delay after load completes.",
                    type: "number",
                    required: false,
                    defaultValue: "0",
                },
                return: {
                    description: "All image load process completed.",
                    type: "boolean",
                    required: true,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
