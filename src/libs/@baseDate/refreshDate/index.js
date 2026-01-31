import { baseStore } from "../baseStore";
import { getDate } from "../getDate";

export const refreshDate = () => {
    const { BASE_SETTINGS, set } = baseStore?.getState() || {};
    const { dateManager } = BASE_SETTINGS || {};
    const { dateFormat, firstDayOfWeek } = dateManager || {};
    set({ date: getDate(dateFormat, firstDayOfWeek) });
};
