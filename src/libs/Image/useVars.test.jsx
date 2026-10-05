import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useVars } from "./useVars";

const { clientData } = vi.hoisted(() => ({ clientData: { winW: 2560, dpr: 1 } }));

vi.mock("../baseStore", () => ({
    baseStore: { useGlobal: () => clientData, globalData: { get: () => ({}) } },
}));
vi.mock("../getText", () => ({ getText: (value) => value }));
vi.mock("../useCatalogImage", () => ({ useCatalogImage: () => null }));

const externalSet = Object.fromEntries(
    [200, 640, 2000, 4000].map((width) => [
        width,
        {
            src: `/${width}.webp`,
            naturalWidth: width,
            naturalHeight: width / 2,
            sizeBytes: width,
        },
    ]),
);
let measured = 0;
let resize;
function Example(props) {
    const vars = useVars({ externalSet, progressive: false, ...props });
    return <div ref={vars.wrapperRef} data-testid="image" data-src={vars.imgSrc} />;
}
function setup(width) {
    measured = width;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({
        width: measured,
    }));
    vi.stubGlobal(
        "ResizeObserver",
        class {
            constructor(callback) {
                resize = callback;
            }
            observe() {}
            disconnect() {}
        },
    );
}
afterEach(() => {
    clientData.dpr = 1;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});
describe("Image responsive catalog selection", () => {
    it.each([
        [2000, 2000],
        [2100, 2000],
        [2200, 2000],
        [2201, 4000],
    ])("selects %i pixels as %i", (width, expected) => {
        setup(width);
        const view = render(<Example />);
        expect(view.getByTestId("image").dataset.src).toBe(`/${expected}.webp`);
    });
    it("waits for actual layout instead of starting a viewport/ultra request", () => {
        setup(0);
        const view = render(<Example />);
        expect(view.getByTestId("image").dataset.src).toBe("");
        act(() => {
            measured = 600;
            resize();
        });
        expect(view.getByTestId("image").dataset.src).toBe("/640.webp");
    });
    it("uses a lightweight preview before measuring", () => {
        setup(0);
        const view = render(<Example progressive />);
        expect(view.getByTestId("image").dataset.src).toBe("/200.webp");
    });
    it("uses the measured width when CSS constrains an explicit width", () => {
        setup(600);
        const view = render(<Example width={2000} />);
        expect(view.getByTestId("image").dataset.src).toBe("/640.webp");
    });
    it("applies tolerance after converting CSS width to device pixels", () => {
        setup(1050);
        clientData.dpr = 2;
        const view = render(<Example />);
        expect(view.getByTestId("image").dataset.src).toBe("/2000.webp");
    });
    it("preserves explicit variant selection", () => {
        setup(600);
        const view = render(<Example variant="4000" />);
        expect(view.getByTestId("image").dataset.src).toBe("/4000.webp");
    });
});
