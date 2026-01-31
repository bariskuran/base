import { create } from "../create";

let __notifierSeq = 0;
const __timers = new Map();

const clearTimer = (id) => {
    const t = __timers.get(id);
    if (t) clearTimeout(t);
    __timers.delete(id);
};

const scheduleAutoKill = (id) => {
    const st = notifierData.get();
    const sec = Number(st?.settings?.killAfter || 0);
    const enabled = !!st?.settings?.enable;

    if (!enabled) return;
    if (!sec || sec <= 0) return;

    clearTimer(id);

    const t = setTimeout(() => {
        notifierData.get()?.removeFromNotifier?.(id, { reason: "auto" });
    }, sec * 1000);

    __timers.set(id, t);
};

const callFn = (fn, payload) => {
    try {
        fn?.(payload.notification, payload);
    } catch (e) {
        console.error("notifier callback error:", e);
    }
};

export const notifierData = create({
    queue: [],
    count: 0,

    onAdd: null,
    onRemove: null,
    onClear: null,
    setHandlers: (handlers = {}) => {
        notifierData.set((s) => {
            if (!handlers || typeof handlers !== "object") return;

            const trySet = (key) => {
                if (!(key in handlers)) return;

                const incoming = handlers[key] || null;

                if (s[key] != null) {
                    console.error(
                        `Notifier: "${key}" is already set. You cannot override an existing handler.`,
                    );
                    return;
                }

                s[key] = incoming;
            };

            trySet("onAdd");
            trySet("onRemove");
            trySet("onClear");
        });
    },

    settings: {
        killAfter: 5,
        enable: true,
    },

    addToNotifier: (notification, { disableAutoKill = false, type = "info" }) => {
        const st = notifierData.get();
        if (!st?.settings?.enable) return null;

        const id = ++__notifierSeq;

        const item =
            notification && typeof notification === "object"
                ? { ...notification, queueId: id, type }
                : { value: notification, queueId: id, type };

        notifierData.set((d) => {
            d.queue = Array.isArray(d.queue) ? d.queue : [];
            d.queue.push(item);
            d.count = (d.count || 0) + 1;
        });

        const ctx = { reason: "add", notification: item, queueId: id };
        const next = notifierData.get();

        callFn(next?.onAdd, ctx);
        callFn(next?.onStart, ctx);

        if (!disableAutoKill) scheduleAutoKill(id);

        return id;
    },

    removeFromNotifier: (queueId, { reason = null } = {}) => {
        const id = Number(queueId);
        if (!id) return false;

        clearTimer(id);

        const prev = notifierData.get();
        const q = Array.isArray(prev?.queue) ? prev.queue : [];
        const idx = q.findIndex((n) => Number(n?.queueId) === id);
        if (idx === -1) return false;

        const removed = q[idx];

        notifierData.set((d) => {
            d.queue = d.queue.filter((n) => Number(n?.queueId) !== id);
        });

        const after = notifierData.get();
        notifierData.set({ count: Array.isArray(after.queue) ? after.queue.length : 0 });

        const ctx = { reason: reason || "remove", notification: removed, queueId: id };
        const next = notifierData.get();

        callFn(next?.onRemove, ctx);
        callFn(next?.onEnd, ctx);

        return true;
    },

    clearNotifier: ({ reason = null } = {}) => {
        const prev = notifierData.get();
        const q = Array.isArray(prev?.queue) ? prev.queue : [];

        for (const n of q) clearTimer(Number(n?.queueId));

        notifierData.set((d) => {
            d.queue = [];
            d.count = 0;
        });

        const ctx = { reason: reason || "clear", notification: null, queueId: null };
        const next = notifierData.get();

        try {
            next?.onClear?.(ctx);
        } catch (e) {
            console.error("notifier callback error:", e);
        }

        return true;
    },
});
