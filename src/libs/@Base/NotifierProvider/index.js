import { useEffect } from "react";
import { typeOf } from "../../typeOf";
import { baseStore } from "../../@baseStore";

export const NotifierProvider = ({ notifierSettings, onAdd, onRemove, onClear }) => {
    const { set } = baseStore.useNotifier();

    useEffect(() => {
        if (typeOf(notifierSettings) === "object") {
            set((s) => {
                s.settings = {
                    ...(s.settings || {}),
                    ...notifierSettings,
                };
            });
        }
    }, [notifierSettings, set]);

    useEffect(() => {
        if (typeof onAdd === "function") set({ onAdd });
        if (typeof onRemove === "function") set({ onRemove });
        if (typeof onClear === "function") set({ onClear });
    }, [onAdd, onRemove, onClear, set]);

    return null;
};
