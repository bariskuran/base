import { baseStore } from "../baseStore";

export const removeFromNotifier = (queueId) => {
    const { set, notifierQueue } = baseStore?.getState?.() || {};

    set({
        notifierQueue: notifierQueue.filter((it) => it.id !== queueId),
    });
};
