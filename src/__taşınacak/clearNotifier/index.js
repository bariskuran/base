import { baseStore } from "../baseStore";

export const clearNotifier = () => {
    const { set } = baseStore?.getState?.() || {};

    set({
        notifierQueue: [],
    });
};
