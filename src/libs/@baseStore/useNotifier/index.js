import { useEffect } from "react";
import { use } from "../use";
import { notifierData } from "../notifierData";

/**
 * Example usage of `useNotifier` inside a component.
 *
 * - Registers notification lifecycle handlers (`onAdd`, `onRemove`)
 * - Triggers a notification via `addToNotifier`
 * - Removes a notification via `removeFromNotifier` This can be used when disableAutoKill is true.
 * - Type is optional and define by the user.
 *
 * @example
 * const Bell = () => {
 *   const { addToNotifier,
 *          queue,
 *          count,
 *          setHandlers,
 *          addToNotifier,
 *          removeFromNotifier,
 *          clearNotifier,
 *          settings } = baseStore.useNotifier({
 *                setHandlers: {
 *                    onAdd: (ctx) => {
 *                         //...
 *                    },
 *                    onRemove: (ctx) => {
 *                         //...
 *                   },
 *               },
 *       },
 *     }
 *   );
 *
 *   return (
 *     <button
 *       onClick={() => {
 *         addToNotifier("Bell1 notification", { type: "success", disableAutoKill: true });
 *       }}
 *     >
 *       ACTION 1
 *     </button>
 *   );
 * };
 */
export const useNotifier = ({ setHandlers } = {}) => {
    const state = use(notifierData);

    useEffect(() => {
        if (setHandlers) state.setHandlers(setHandlers);
        return () => state.setHandlers({ onAdd: null, onRemove: null, onClear: null });
    }, []);

    return state;
};
