import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Base, normalizeGalleryImages } from "./_Base";
import { IMAGE_CATALOG_GLOBAL_KEY } from "../createImageCatalog";
import { baseStore } from "../baseStore";

describe("ImageGalery", () => {
    it("normalizes catalog keys, paths, and image sets", () => {
        const imageSet = {
            small: { src: "/small.jpg", naturalWidth: 320, naturalHeight: 200 },
            large: { src: "/large.jpg", naturalWidth: 1600, naturalHeight: 1000 },
        };

        expect(
            normalizeGalleryImages([
                "i5283",
                "/photo.jpg",
                { externalSet: imageSet, alt: "Museum" },
            ]),
        ).toEqual([
            {
                key: "i5283-0",
                alt: undefined,
                full: { catalogSet: "i5283" },
                thumbnail: { catalogSet: "i5283" },
            },
            {
                key: "/photo.jpg-1",
                alt: undefined,
                full: { src: "/photo.jpg" },
                thumbnail: { src: "/photo.jpg" },
            },
            {
                key: "gallery-image-2",
                alt: "Museum",
                full: { externalSet: imageSet },
                thumbnail: { externalSet: imageSet },
            },
        ]);
    });

    it("resolves alt from the image catalog for catalog keys", () => {
        baseStore.globalData.set?.((s) => {
            s[IMAGE_CATALOG_GLOBAL_KEY] = {
                i5283: { alt: { tr: "Müze", en: "Museum" } },
            };
        });

        expect(normalizeGalleryImages(["i5283"])[0].alt).toEqual({
            tr: "Müze",
            en: "Museum",
        });

        baseStore.globalData.set?.((s) => {
            s[IMAGE_CATALOG_GLOBAL_KEY] = {};
        });
    });

    it("does not mount its variant without images", () => {
        const Variant = vi.fn(() => <div>Gallery</div>);
        const { container } = render(<Base images={[]} Variant={Variant} />);

        expect(container).toBeEmptyDOMElement();
        expect(Variant).not.toHaveBeenCalled();
    });
});
