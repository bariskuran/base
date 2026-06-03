import { useCallback, useEffect, useMemo, useState } from "react";

const pickSnapshot = (item) => ({
    queueId: item.queueId,
    bgColor: item.bgColor,
    value: item.value,
    disableAutoKill: item.disableAutoKill,
    remove: item.remove,
    killAfter: item.killAfter,
    closingDelay: item.closingDelay,
    status: item.status,
    shownAt: item.shownAt,
});

const snapshotChanged = (a, b) => {
    if (!a || !b) return true;
    return (
        a.status !== b.status ||
        a.value !== b.value ||
        a.bgColor !== b.bgColor ||
        a.disableAutoKill !== b.disableAutoKill ||
        a.killAfter !== b.killAfter ||
        a.closingDelay !== b.closingDelay ||
        a.shownAt !== b.shownAt
    );
};

const mergeSnapshots = (prev, queue) => {
    const next = { ...prev };
    const queueIds = new Set();
    let changed = false;

    queue.forEach((item) => {
        queueIds.add(item.queueId);
        const incoming = pickSnapshot(item);
        const existing = prev[item.queueId];

        if (snapshotChanged(existing, incoming)) {
            next[item.queueId] = incoming;
            changed = true;
        }
    });

    Object.keys(prev).forEach((key) => {
        const id = Number(key);
        if (!queueIds.has(id) && prev[id]?.status !== "closing") {
            next[id] = { ...prev[id], status: "closing" };
            changed = true;
        }
    });

    return changed ? next : prev;
};

export const useDisplayQueue = (queue = []) => {
    const [snapshots, setSnapshots] = useState({});

    const queueToken = useMemo(
        () =>
            queue
                .map((item) => `${item.queueId}:${item.status}:${String(item.value)}`)
                .join("|"),
        [queue],
    );

    useEffect(() => {
        setSnapshots((prev) => mergeSnapshots(prev, queue));
    }, [queueToken]);

    const onExitComplete = useCallback((queueId) => {
        setSnapshots((prev) => {
            if (!prev[queueId]) return prev;
            const next = { ...prev };
            delete next[queueId];
            return next;
        });
    }, []);

    const displayQueue = useMemo(
        () => Object.values(snapshots).filter((item) => item?.value),
        [snapshots],
    );

    return { displayQueue, onExitComplete };
};
