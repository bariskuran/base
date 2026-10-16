import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useShellDrag } from './useShellDrag';

function setup() {
    const shell = document.createElement('div');
    const content = document.createElement('div');
    content.setPointerCapture = vi.fn();
    content.releasePointerCapture = vi.fn();
    const shellRef = { current: shell };
    const contentRef = { current: content };
    const view = renderHook(() => useShellDrag({
        enabled: true, shellRef, contentRef,
    }));
    return { ...view, shell, content };
}
describe('ScrollFlex touch scrolling', () => {
    it.each(['touch', 'pen'])('leaves %s gestures native on thumbnails and empty space', (pointerType) => {
        const { result, content, unmount } = setup();
        expect(result.current.shellSurfaceStyle.touchAction).toBe('auto');
        const button = document.createElement('button');
        content.append(button);
        for (const target of [content, button]) {
            const event = { pointerType, button: 0, currentTarget: content, target, cancelable: true, preventDefault: vi.fn() };
            act(() => result.current.shellPointerHandlers.onPointerDown(event));
            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(content.setPointerCapture).not.toHaveBeenCalled();
        }
        unmount();
    });
    it('retains mouse drag scrolling on non-interactive content', () => {
        const { result, shell, content, unmount } = setup();
        const down = { pointerType: 'mouse', button: 0, currentTarget: content, target: content, pointerId: 1, clientX: 100, clientY: 0, cancelable: true, preventDefault: vi.fn() };
        act(() => result.current.shellPointerHandlers.onPointerDown(down));
        expect(down.preventDefault).toHaveBeenCalledOnce();
        act(() => result.current.shellPointerHandlers.onPointerMove({ clientX: 50, clientY: 0, cancelable: true, preventDefault: vi.fn() }));
        expect(shell.scrollLeft).toBe(50);
        unmount();
    });
});
