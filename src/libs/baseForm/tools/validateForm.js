import { debouncedFunction } from "../../debouncedFunction";

export const validateForm = debouncedFunction(
    ({ set, get }) => {
        const state = get();
        const { fields, values } = state;

        console.log(
            "validateForm",

        );
    },
    {
        delay: 500,
        isThrottle: false,
        getFirst: false,
        functionName: "validateForm",
    },
);

