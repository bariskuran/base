import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTrackpadNavigation } from "./useTrackpadNavigation";

function Example({ enabled = true, onNavigate, observerRef, nodeKey = "initial" }) {
    const attachRoot = useTrackpadNavigation({
        onRootChange: observerRef,
        enabled,
        onNavigate,
    });
    return (
        <div key={nodeKey} ref={attachRoot} data-testid="slider">
            <input data-testid="input" />
        </div>
    );
}
function wheel(element, values = {}) {
    const event = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaX: 65,
        ...values,
    });
    fireEvent(element, event);
    return event;
}
afterEach(() => vi.restoreAllMocks());
describe("Slider trackpad navigation", () => {
    it("attaches to a callback observer ref and reattaches when the DOM node changes", () => {
        const observerRef = vi.fn();
        const onNavigate = vi.fn();
        const view = render(<Example observerRef={observerRef} onNavigate={onNavigate} />);
        const oldRoot = view.getByTestId("slider");
        expect(observerRef).toHaveBeenLastCalledWith(oldRoot);
        wheel(oldRoot);
        expect(onNavigate).toHaveBeenCalledExactlyOnceWith(1);
        view.rerender(
            <Example observerRef={observerRef} onNavigate={onNavigate} nodeKey="replacement" />,
        );
        const newRoot = view.getByTestId("slider");
        expect(newRoot).not.toBe(oldRoot);
        expect(observerRef).toHaveBeenLastCalledWith(newRoot);
        expect(wheel(oldRoot).defaultPrevented).toBe(false);
        wheel(newRoot, { deltaX: -65 });
        expect(onNavigate).toHaveBeenCalledTimes(2);
        expect(onNavigate).toHaveBeenLastCalledWith(-1);
        view.unmount();
        expect(observerRef).toHaveBeenLastCalledWith(null);
    });
    it.each([
        [65, 1],
        [-65, -1],
    ])("navigates for horizontal delta %i", (deltaX, direction) => {
        const onNavigate = vi.fn();
        const view = render(<Example onNavigate={onNavigate} />);
        expect(wheel(view.getByTestId("slider"), { deltaX }).defaultPrevented).toBe(true);
        expect(onNavigate).toHaveBeenCalledExactlyOnceWith(direction);
    });
    it("accumulates small deltas and ignores momentum across rerenders", () => {
        let now = 0;
        vi.spyOn(performance, "now").mockImplementation(() => now);
        const first = vi.fn();
        const next = vi.fn();
        const view = render(<Example onNavigate={first} />);
        const root = view.getByTestId("slider");
        wheel(root, { deltaX: 25 });
        expect(first).not.toHaveBeenCalled();
        wheel(root, { deltaX: 40 });
        expect(first).toHaveBeenCalledExactlyOnceWith(1);
        view.rerender(<Example onNavigate={next} />);
        for (let i = 0; i < 30; i++) {
            now += 40;
            wheel(root);
        }
        expect(next).not.toHaveBeenCalled();
        now += 300;
        wheel(root, { deltaX: -65 });
        expect(next).toHaveBeenCalledExactlyOnceWith(-1);
    });
    it("leaves vertical gestures native even if the gesture later drifts sideways", () => {
        const onNavigate = vi.fn();
        const view = render(<Example onNavigate={onNavigate} />);
        const root = view.getByTestId("slider");
        expect(wheel(root, { deltaX: 4, deltaY: 70 }).defaultPrevented).toBe(false);
        expect(wheel(root).defaultPrevented).toBe(false);
        expect(onNavigate).not.toHaveBeenCalled();
    });
    it("leaves pinch zoom, editing, and outside events untouched", () => {
        const onNavigate = vi.fn();
        const view = render(<Example onNavigate={onNavigate} />);
        expect(wheel(view.getByTestId("slider"), { ctrlKey: true }).defaultPrevented).toBe(false);
        expect(wheel(view.getByTestId("input")).defaultPrevented).toBe(false);
        expect(wheel(document.body).defaultPrevented).toBe(false);
        expect(onNavigate).not.toHaveBeenCalled();
    });
    it("removes the listener when disabled or unmounted", () => {
        const onNavigate = vi.fn();
        const view = render(<Example onNavigate={onNavigate} />);
        const root = view.getByTestId("slider");
        view.rerender(<Example enabled={false} onNavigate={onNavigate} />);
        expect(wheel(root).defaultPrevented).toBe(false);
        view.unmount();
        wheel(root);
        expect(onNavigate).not.toHaveBeenCalled();
    });
    it("normalizes line-based wheel deltas", () => {
        const onNavigate = vi.fn();
        const view = render(<Example onNavigate={onNavigate} />);
        wheel(view.getByTestId("slider"), { deltaX: 4, deltaMode: 1 });
        expect(onNavigate).toHaveBeenCalledExactlyOnceWith(1);
    });
});
