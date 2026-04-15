import { baseStore } from "../../@baseStore";
import { isValidElement } from "react";
import { isPlainObject } from "../../isPlainObject";

const isRenderableNotificationValue = (value) => {
    if (typeof value === "string" || typeof value === "number") return true;
    if (isValidElement(value)) return true;
    return false;
};

const normalizeNotificationInput = (notification, extra = {}) => {
    const { queueId, bgColor, ...rest } = extra;

    if (isRenderableNotificationValue(notification)) {
        return {
            value: notification,
            queueId,
            bgColor,
            ...rest,
        };
    }

    if (isPlainObject(notification)) {
        if (!isRenderableNotificationValue(notification.value)) {
            return null;
        }

        return {
            ...notification,
            queueId,
            bgColor,
            ...rest,
        };
    }

    return null;
};

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

const remove = (queueId) => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const { queue = [], count } = _notifier;

    const id = Number(queueId);
    if (!id) return false;

    clearTimer(id);

    const existingQueue = Array.isArray(queue) ? queue : [];
    const index = existingQueue.findIndex((n) => Number(n?.queueId) === id);
    if (index === -1) return false;

    const newQueue = existingQueue.filter((n) => Number(n?.queueId) !== id);
    const newCount = (count || 0) - 1;

    set((d) => {
        d._notifier.queue = newQueue;
        d._notifier.count = newCount;
    });

    return true;
};

const changeStatus = (id, status, closingDelay) => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;

    const { queue = [] } = _notifier;
    const existingQueue = Array.isArray(queue) ? queue : [];
    const index = existingQueue.findIndex((n) => Number(n?.queueId) === id);
    if (index === -1) return false;

    set((d) => {
        d._notifier.queue[index].status = status;
    });

    setTimeout(() => {
        remove(id);
    }, closingDelay);

    return true;
};

const scheduleAutoKill = (id, killAfter, closingDelay) => {
    const { _notifier } = baseStore.globalData.get();
    const { queue = [] } = _notifier;

    clearTimer(id);

    const existingQueue = Array.isArray(queue) ? queue : [];
    const index = existingQueue.findIndex((n) => Number(n?.queueId) === id);
    if (index === -1) return false;

    const t = setTimeout(() => {
        changeStatus(id, "closing", closingDelay);
    }, killAfter);

    __timers.set(id, t);
};

const add = (notification, options = {}) => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const {
        queue = [],
        count,
        //
        killAfter: killAfterGlobal,
        closingDelay: closingDelayGlobal,
        disableNotifier: disableNotifierGlobal,
        disableAutoKill: disableAutoKillGlobal,
    } = _notifier;

    const { killAfter, closingDelay, disableAutoKill, ...rest } = options;

    const totalKillAfter = (killAfter || killAfterGlobal || 5) * 1000;
    const totalDisable =
        disableNotifierGlobal || disableAutoKill || disableAutoKillGlobal || totalKillAfter <= 0.1;
    const totalClosingDelay = (closingDelay || closingDelayGlobal || 0.5) * 1000;

    const id = ++__notifierSeq;

    const item = normalizeNotificationInput(notification, {
        queueId: id,
        ...rest,
        remove: () => changeStatus(id, "closing", totalClosingDelay),
        disableAutoKill: totalDisable,
        killAfter: totalKillAfter,
        closingDelay: totalClosingDelay,
        status: "active",
    });

    if (!item) {
        console.warn("notifier.add ignored invalid notification:", notification);
        return null;
    }

    const existingQueue = Array.isArray(queue) ? queue : [];
    const newQueue = [...existingQueue, item];
    const newCount = (count || 0) + 1;
    set((d) => {
        d._notifier.queue = newQueue;
        d._notifier.count = newCount;
    });

    if (!disableAutoKill) scheduleAutoKill(id, totalKillAfter, totalClosingDelay);

    return id;
};

const clear = () => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const { queue = [] } = _notifier;

    const q = Array.isArray(queue) ? queue : [];
    for (const n of q) clearTimer(Number(n?.queueId));

    set((d) => {
        d._notifier.queue = [];
        d._notifier.count = 0;
    });
    return true;
};

export const notifierFunctions = {
    add,
    remove,
    clear,
};
