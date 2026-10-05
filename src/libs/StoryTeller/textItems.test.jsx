import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StoryTextList } from "./textItems";

vi.mock("../getText", () => ({
    getText: (value) => (typeof value === "object" ? value?.tr || "" : value || ""),
}));
vi.mock("../Typo", () => ({
    Typo: {
        h1: ({ children }) => <h1>{children}</h1>,
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <h3>{children}</h3>,
        p: ({ children }) => <p>{children}</p>,
        storySubTitle: ({ children }) =>
            children ? (
                <section>
                    <p>{children}</p>
                    <div />
                </section>
            ) : null,
    },
}));

describe("Story heading dividers", () => {
    it.each(["h1", "h2"])(
        "always shows a divider for %s, including empty localized subtitles",
        (as) => {
            for (const data of [undefined, "", null, { tr: "", en: "" }]) {
                const view = render(
                    <StoryTextList
                        items={[
                            { as, data: "Başlık" },
                            { as: "storySubTitle", data },
                        ]}
                    />,
                );
                expect(view.container.querySelectorAll("div")).toHaveLength(1);
                view.unmount();
            }
            const view = render(<StoryTextList items={[{ as, data: "Başlık" }]} />);
            expect(view.container.querySelectorAll("div")).toHaveLength(1);
        },
    );
    it("keeps exactly one divider below a populated subtitle", () => {
        const view = render(
            <StoryTextList
                items={[
                    { as: "h1", data: "Başlık" },
                    { as: "storySubTitle", data: "Spot" },
                ]}
            />,
        );
        expect(view.container.querySelectorAll("div")).toHaveLength(1);
        expect(view.container.querySelector("section div")).not.toBeNull();
    });
    it("does not add a heading divider to h3", () => {
        const view = render(<StoryTextList items={[{ as: "h3", data: "Başlık" }]} />);
        expect(view.container.querySelectorAll("div")).toHaveLength(0);
    });
});
