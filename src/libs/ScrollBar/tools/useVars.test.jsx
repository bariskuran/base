import { renderHook, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useVars from './useVars';

const state = vi.hoisted(() => ({ set: vi.fn() }));
vi.mock('../../baseStore', () => ({
    baseStore: {
        useGlobal: () => [{ foreground: '#000000' }],
        useLocal: (initial) => ({
            ...initial,
            resolvedHost: document.documentElement,
            resolvedSource: document.documentElement,
            set: state.set,
        }),
    },
}));
vi.mock('../../colorGet', () => ({ colorGet: () => ({}) }));
vi.mock('helpers/useExportedData', () => ({
    useExportData: (props, values) => ({ ...props, ...values }),
}));

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
});

describe('ScrollBar native document scrolling', () => {
    it('does not attach non-passive wheel listeners when both axes remain enabled', () => {
        const add = vi.spyOn(window, 'addEventListener');
        renderHook(() => useVars({ body: true }));
        expect(add.mock.calls.filter(([type, , options]) =>
            type === 'wheel' && options?.passive === false,
        )).toHaveLength(0);
    });

    it('preserves document overscroll settings on mount and unmount', () => {
        document.documentElement.style.overscrollBehavior = 'auto';
        document.body.style.overscrollBehavior = 'auto';
        const view = renderHook(() => useVars({ body: true }));
        expect(document.documentElement.style.overscrollBehavior).toBe('auto');
        expect(document.body.style.overscrollBehavior).toBe('auto');
        view.unmount();
        expect(document.documentElement.style.overscrollBehavior).toBe('auto');
        expect(document.body.style.overscrollBehavior).toBe('auto');
    });

    it('blocks a disabled horizontal axis while allowing vertical wheel input and cleans up', () => {
        const add = vi.spyOn(window, 'addEventListener');
        const view = renderHook(() => useVars({ body: true, disableX: true }));
        expect(add.mock.calls.filter(([type, , options]) =>
            type === 'wheel' && options?.passive === false,
        )).toHaveLength(1);
        const vertical = new WheelEvent('wheel', { deltaY: 100, cancelable: true });
        window.dispatchEvent(vertical);
        expect(vertical.defaultPrevented).toBe(false);
        const horizontal = new WheelEvent('wheel', { deltaX: 100, cancelable: true });
        window.dispatchEvent(horizontal);
        expect(horizontal.defaultPrevented).toBe(true);
        view.unmount();
        const after = new WheelEvent('wheel', { deltaX: 100, cancelable: true });
        window.dispatchEvent(after);
        expect(after.defaultPrevented).toBe(false);
    });
});
