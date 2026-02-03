import { baseStore } from "../../@baseStore";

/**
 * Example usage of `useNotifier` inside a component.
 *
 * - Registers notification lifecycle handlers (`onAdd`, `onRemove`)
 * - Triggers a notification via `add`
 * - Removes a notification via `remove` This can be used when disableAutoKill is true.
 * - Type is optional and define by the user.
 *
 * @example
 * const Bell = () => {
 *   const [_notifier] = useGlobal(s=>[s._notifier]);
 *
 *   useEffect(() => {
 *     _notifier.setHandlers({
 *       onAdd: (ctx) => {
 *         console.log("onAdd", ctx);
 *       },
 *       onRemove: (ctx) => {
 *         console.log("onRemove", ctx);
 *       },
 *       onClear: (ctx) => {
 *         console.log("onClear", ctx);
 *       },
 *     });
 *   }, []);
 *
 * useEffect(()=>{
 *    _notifier.add("Bell1 notification", { type: "success", disableAutoKill: true });
 *    _notifier.remove(id, { reason: "autoKill" });
 *    _notifier.clear({ reason: "clearAll" });
 * },[])
 *
 *   return (
 *     <button
 *       onClick={() => {
 *         _notifier.add("Bell1 notification", { type: "success", disableAutoKill: true });
 *         _notifier.remove(id, { reason: "autoKill" });
 *         _notifier.clear({ reason: "clearAll" });
 *       }}
 *     >
 *       ACTION 1
 *     </button>
 *   );
 * };
 */

let __notifierSeq = 0;
const __timers = new Map();

const clearTimer = (id) => {
    const t = __timers.get(id);
    if (t) clearTimeout(t);
    __timers.delete(id);
};

const get = () => baseStore.globalData.get()._notifier;
const set = (updater) =>
    baseStore.globalData.set((d) => {
        d._notifier = {
            ...d._notifier,
            ...updater,
        };
    });

const scheduleAutoKill = (id) => {
    const { killAfter, disable: disabled } = get();

    if (disabled) return;
    if (!killAfter || killAfter <= 0) return;

    clearTimer(id);

    const t = setTimeout(() => {
        notifierFunctions.remove(id, { reason: "autoKill" });
    }, killAfter * 1000);

    __timers.set(id, t);
};

const callFn = (fn, payload) => {
    try {
        fn?.(payload.notification, payload);
    } catch (e) {
        console.error("notifier callback error:", e);
    }
};

export const notifierFunctions = {
    add: (notification, { disableAutoKill = false, type = "info" }) => {
        const { disable: disabled, queue, count, onAdd } = get();
        if (disabled) return null;

        const id = ++__notifierSeq;

        const item =
            notification && typeof notification === "object"
                ? { ...notification, queueId: id, type }
                : { value: notification, queueId: id, type };

        const existingQueue = Array.isArray(queue) ? queue : [];
        existingQueue.push(item);
        const newCount = (count || 0) + 1;
        set({ queue: existingQueue, count: newCount });

        const ctx = { reason: "add", notification: item, queueId: id };
        callFn(onAdd, ctx);

        if (!disableAutoKill) scheduleAutoKill(id);

        return id;
    },
    remove: (queueId, { reason = null } = {}) => {
        const { queue, count, onRemove } = get();

        const id = Number(queueId);
        if (!id) return false;

        clearTimer(id);

        const existingQueue = Array.isArray(queue) ? queue : [];
        const index = existingQueue.findIndex((n) => Number(n?.queueId) === id);
        if (index === -1) return false;

        const removed = existingQueue[index];

        const newQueue = existingQueue.filter((n) => Number(n?.queueId) !== id);
        const newCount = (count || 0) - 1;

        set({ queue: newQueue, count: newCount });

        const ctx = { reason: reason || "remove", notification: removed, queueId: id };
        callFn(onRemove, ctx);

        return true;
    },
    clear: ({ reason = null } = {}) => {
        const { queue, onClear } = get();

        const q = Array.isArray(queue) ? queue : [];
        for (const n of q) clearTimer(Number(n?.queueId));

        set({ queue: [], count: 0 });

        const ctx = { reason: reason || "clear", notification: null, queueId: null };
        callFn(onClear, ctx);

        return true;
    },
    setHandlers: ({ onAdd, onRemove, onClear } = {}) => {
        if (typeof onAdd === "function") set({ onAdd });
        if (typeof onRemove === "function") set({ onRemove });
        if (typeof onClear === "function") set({ onClear });
    },
};
