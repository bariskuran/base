import { baseStore } from "../@baseStore";
import { isValidElement } from "react";
import { isPlainObject } from "../isPlainObject";

const isRenderableNotificationValue = (value) => {
    if (typeof value === "string" || typeof value === "number") return true;
    if (isValidElement(value)) return true;
    return false;
};

const normalizeNotificationInput = (notification, extra = {}) => {
    const { queueId, bgColor, variant, ...rest } = extra;

    if (isRenderableNotificationValue(notification)) {
        return {
            value: notification,
            queueId,
            bgColor,
            variant,
            ...rest,
        };
    }

    if (isPlainObject(notification)) {
        if (!isRenderableNotificationValue(notification.value)) {
            return null;
        }

        const {
            value,
            bgColor: notificationBgColor,
            variant: notificationVariant,
        } = notification;

        return {
            value,
            queueId,
            bgColor: bgColor ?? notificationBgColor,
            variant: variant ?? notificationVariant,
            ...rest,
        };
    }

    return null;
};

let __notifierSeq = 0;
const __killTimers = new Map();
const __removeTimers = new Map();

/**
 * Seconds by default; values >= 20 treated as milliseconds (legacy settings).
 */
export const toDurationMs = (value, fallbackSeconds) => {
    const n = Number(value ?? fallbackSeconds);
    if (!Number.isFinite(n) || n <= 0) return fallbackSeconds * 1000;
    return n < 20 ? n * 1000 : n;
};

export const toClosingDelayMs = (value, fallbackSeconds = 0.5) =>
    toDurationMs(value, fallbackSeconds);

export const toKillAfterMs = (value, fallbackSeconds = 5) => toDurationMs(value, fallbackSeconds);

const clearKillTimer = (id) => {
    const t = __killTimers.get(id);
    if (t) clearTimeout(t);
    __killTimers.delete(id);
};

const clearRemoveTimer = (id) => {
    const t = __removeTimers.get(id);
    if (t) clearTimeout(t);
    __removeTimers.delete(id);
};

const clearAllTimers = (id) => {
    clearKillTimer(id);
    clearRemoveTimer(id);
};

const findQueueIndex = (queue, id) => {
    const existingQueue = Array.isArray(queue) ? queue : [];
    return existingQueue.findIndex((n) => Number(n?.queueId) === id);
};

const removeFromQueue = (queueId) => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const { queue = [], count } = _notifier;

    const id = Number(queueId);
    if (!id) return false;

    clearAllTimers(id);

    const existingQueue = Array.isArray(queue) ? queue : [];
    const index = findQueueIndex(existingQueue, id);
    if (index === -1) return false;

    const newQueue = existingQueue.filter((n) => Number(n?.queueId) !== id);
    const newCount = Math.max(0, (count || 0) - 1);

    set((d) => {
        d._notifier.queue = newQueue;
        d._notifier.count = newCount;
    });

    return true;
};

const changeStatus = (id, status, closingDelayMs) => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const { queue = [] } = _notifier;
    const index = findQueueIndex(queue, id);
    if (index === -1) return false;

    clearKillTimer(id);

    set((d) => {
        d._notifier.queue = d._notifier.queue.map((entry, i) =>
            i === index ? { ...entry, status } : entry,
        );
    });

    if (status === "closing") {
        clearRemoveTimer(id);
        const t = setTimeout(() => {
            __removeTimers.delete(id);
            removeFromQueue(id);
        }, closingDelayMs);
        __removeTimers.set(id, t);
    }

    return true;
};

const scheduleAutoKill = (id, killAfterMs, closingDelayMs) => {
    const { _notifier } = baseStore.globalData.get();
    const { queue = [] } = _notifier;

    clearKillTimer(id);

    const index = findQueueIndex(queue, id);
    if (index === -1) return false;

    const item = queue[index];
    const shownAt = item?.shownAt || Date.now();
    const remaining = Math.max(0, killAfterMs - (Date.now() - shownAt));

    const t = setTimeout(() => {
        __killTimers.delete(id);
        changeStatus(id, "closing", closingDelayMs);
    }, remaining);

    __killTimers.set(id, t);
    return true;
};

const remove = (queueId) => {
    const { _notifier } = baseStore.globalData.get();
    const { queue = [] } = _notifier;
    const id = Number(queueId);
    if (!id) return false;

    const index = findQueueIndex(queue, id);
    if (index === -1) return false;

    const item = queue[index];
    if (item?.status === "active") {
        return changeStatus(id, "closing", toClosingDelayMs(item?.closingDelay, 0.5));
    }

    return removeFromQueue(id);
};

const add = (notification, options = {}) => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const {
        queue = [],
        count,
        killAfter: killAfterGlobal,
        closingDelay: closingDelayGlobal,
        disableNotifier: disableNotifierGlobal,
        disableAutoKill: disableAutoKillGlobal,
    } = _notifier;

    const { killAfter, closingDelay, disableAutoKill, bgColor, variant } = options;

    const variantKey =
        typeof variant === "string"
            ? variant
            : variant != null && typeof variant === "object" && typeof variant.variant === "string"
              ? variant.variant
              : null;

    const totalKillAfterMs = toKillAfterMs(killAfter ?? killAfterGlobal, 5);
    const totalClosingDelayMs = toClosingDelayMs(closingDelay ?? closingDelayGlobal, 0.5);
    const totalDisable =
        disableNotifierGlobal ||
        disableAutoKill ||
        disableAutoKillGlobal ||
        totalKillAfterMs <= 100;

    const id = ++__notifierSeq;

    const shownAt = Date.now();

    const item = normalizeNotificationInput(notification, {
        queueId: id,
        bgColor,
        variant: variantKey,
        shownAt,
        remove: () => changeStatus(id, "closing", totalClosingDelayMs),
        disableAutoKill: totalDisable,
        killAfter: totalKillAfterMs,
        closingDelay: totalClosingDelayMs,
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

    if (!totalDisable) scheduleAutoKill(id, totalKillAfterMs, totalClosingDelayMs);

    return id;
};

const clear = () => {
    const { _notifier } = baseStore.globalData.get();
    const set = baseStore.globalData.set;
    const { queue = [] } = _notifier;

    const q = Array.isArray(queue) ? queue : [];
    for (const n of q) clearAllTimers(Number(n?.queueId));

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
