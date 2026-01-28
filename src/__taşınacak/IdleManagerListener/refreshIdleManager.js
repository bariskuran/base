import { baseStore } from "../baseStore";

export const refreshIdleManager = () => {
    const { refreshManuallyTriggerer, set } = baseStore?.getState() || {};
    set({ refreshManuallyTriggerer: refreshManuallyTriggerer + 1 });
};
