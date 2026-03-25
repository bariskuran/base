import { debouncedFunction } from "../../debouncedFunction";

export const validateForm = debouncedFunction(
    ({ set, get }) => {
        const state = get();
        const { fields, values } = state;

        console.log(
            "validateForm",
            // fields, values
        );
    },
    {
        delay: 500,
        isThrottle: false,
        getFirst: false,
        functionName: "validateForm",
    },
);

// export const createValidateForm = ({ formName }) =>
//     debouncedFunction(
//         ({ set, get }) => {
//             const state = get();
//             const { fields, values } = state;

//             console.log("validateForm", formName, fields, values);
//         },
//         {
//             delay: 500,
//             isThrottle: false,
//             getFirst: false,
//             functionName: `validateForm-${formName}`,
//         },
//     );

// const validateForm = createValidateForm({ formName });

// return {
//     validateForm: () => validateForm({ set, get }),
// };
