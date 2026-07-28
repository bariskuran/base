import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardViewer } from ".";

describe("CardViewer", () => {
    it("unmounts when items are missing or empty", () => {
        const missing = render(<CardViewer />);
        const empty = render(<CardViewer items={[]} />);

        expect(missing.container).toBeEmptyDOMElement();
        expect(empty.container).toBeEmptyDOMElement();
    });
});
