import Ds from "../DesignSystem";
import { ImageGalery } from ".";
import { SYS } from "../../constants/SYS";

const sampleImages = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
];

const X = () => (
    <Ds.page
        title="<ImageGalery>"
        releasedOn="1.0.0"
        description="Thumbnail gallery with a full-size PopUp viewer. When thumbs fit the viewport they align via alignX (default center) without ScrollFlex; overflow enables horizontal scroll."
    >
        <Ds.block
            title="Amedist"
            description="Strings may be direct paths/URLs or image-catalog keys. Image source objects and external image sets are also supported."
            code={`import { ImageGalery } from "${SYS.basePath}";

                    <ImageGalery images={[
                        "/images/photo-1.jpg",
                        "i5283",
                        { externalSet: imageSet, alt: "Museum detail" }
                    ]} />`}
            example={<ImageGalery images={sampleImages} />}
        />
        <Ds.block
            title="alignX"
            description="When all thumbnails fit the viewport, ScrollFlex is skipped and thumbs align with alignX (default center). left/start and right/end are aliases. Overflow still enables horizontal scroll."
            code={`import { ImageGalery } from "${SYS.basePath}";

                    <ImageGalery images={images} alignX="center" />
                    <ImageGalery images={images} alignX="start" />`}
            example={<ImageGalery images={sampleImages} alignX="center" />}
        />
        <Ds.api
            args="<ImageGalery />"
            props={{
                images: {
                    description:
                        "Direct paths, URLs, image catalog keys, Image props objects, or external image sets. Alt comes from the item or, for catalog keys, from the image catalog; shown as t(alt) in the PopUp when present.",
                    type: "array",
                    required: true,
                },
                thumbnailHeight: {
                    description: "Shared thumbnail row height. Width follows each image aspect ratio.",
                    type: "number",
                    defaultValue: "150",
                },
                gap: {
                    description: "Space between thumbnails.",
                    type: "number",
                    defaultValue: "10",
                },
                alignX: {
                    description:
                        "Horizontal alignment when thumbnails fit without scrolling. center | start | end (left→start, right→end). ScrollFlex is used only when content overflows.",
                    type: '"center" | "start" | "end" | "left" | "right"',
                    defaultValue: '"center"',
                },
                marginToEdge: {
                    description:
                        "Leading/trailing spacer when the thumbnail row scrolls (ignored when all thumbs fit).",
                    type: "number | string",
                    defaultValue: "150",
                },
            }}
        />
    </Ds.page>
);

export default X;
