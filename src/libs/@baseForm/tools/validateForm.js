import { debouncedFunction } from "../../debouncedFunction";

export const validateForm = debouncedFunction(
    ({ set, get }) => {
        const state = get();
        const { fields, values } = state;

        const validateLevel = () => {};
    },
    { isThrottle: true },
);
