import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    registerLayoutControllerFactory,
    useLayout,
    useLayoutControllerOwner,
} from "./controllerRegistry";
import {
    createBasicLayoutController,
    createFooterAmedistController,
    createHeaderAmedistController,
} from "./controllers";

describe("Layout controller registry", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("supports single and ordered multi-controller selectors", () => {
        registerLayoutControllerFactory("testMain", createBasicLayoutController);
        registerLayoutControllerFactory("testFooter", createBasicLayoutController);

        const { result: single } = renderHook(() =>
            useLayout("testMain", { controllerId: "main" }),
        );
        expect(single.current.controllerId).toBe("main");

        const { result: multiple } = renderHook(() =>
            useLayout([
                { name: "testMain", controllerId: "main" },
                { name: "testFooter", controllerId: "secondary" },
            ]),
        );
        expect(multiple.current.map((controller) => controller.controllerId)).toEqual([
            "main",
            "secondary",
        ]);
    });

    it("marks every mounted owner when name and controllerId are duplicated", async () => {
        const Probe = () => {
            const { hasDuplicateController } = useLayoutControllerOwner("duplicateTest", "same");
            return <div>{hasDuplicateController ? "duplicate" : "ok"}</div>;
        };

        render(
            <>
                <Probe />
                <Probe />
            </>,
        );

        expect(await screen.findAllByText("duplicate")).toHaveLength(2);
    });

    it("combines menu, search, and hidden header sources in headerAmedist", () => {
        vi.useFakeTimers();
        let notifications = 0;
        const controller = createHeaderAmedistController({
            notify: () => {
                notifications += 1;
            },
        });

        controller.setSearchValue("sur");
        expect(controller.getPublicState().searchValue).toBe("sur");
        expect(controller.getPublicState().menuStatus).toBe("opening");

        act(() => vi.advanceTimersByTime(500));
        expect(controller.getPublicState().menuStatus).toBe("open");

        controller.hideHeader();
        controller.hideHeaderFromProp(true);
        controller.showHeader();
        expect(controller.getPublicState().headerStatus).toBe("hidden");

        controller.hideHeaderFromProp(false);
        expect(controller.getPublicState().headerStatus).toBe("extended");
        expect(notifications).toBeGreaterThan(0);
    });

    it("combines hidden footer sources without clearing other consumers", () => {
        let notifications = 0;
        const controller = createFooterAmedistController({
            notify: () => {
                notifications += 1;
            },
        });

        controller.hideFooter("storyteller");
        controller.hideFooter("modal");
        controller.showFooter("storyteller");
        expect(controller.getPublicState().visible).toBe(false);

        controller.showFooter("modal");
        expect(controller.getPublicState().visible).toBe(true);
        expect(notifications).toBe(4);
    });
});
