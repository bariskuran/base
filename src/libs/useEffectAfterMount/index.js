import { useEffect, useRef } from "react";

export const useEffectAfterMount = (effect, deps = []) => {
    const didMount = useRef(false);
    const effectRef = useRef(effect);
    effectRef.current = effect;

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        return effectRef.current?.();
    }, deps);
};
