import { baseStore } from "../@baseStore";

export const notifier = {
    add: (notification, options) => {
        const { _notifier } = baseStore.globalData.get();
        _notifier.add(notification, options);
    },
    remove: (queueId) => {
        const { _notifier } = baseStore.globalData.get();
        _notifier.remove(queueId);
    },
    clear: () => {
        const { _notifier } = baseStore.globalData.get();
        _notifier.clear();
    },
};
