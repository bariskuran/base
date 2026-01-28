/* eslint-disable no-useless-escape */
import { LOWER_CASE_ALPHABET, UPPER_CASE_ALPHABET, NUMBERS, SYMBOLS } from "../../CHARSETS";
import { typeOf } from "../../typeOf";

/*
    Each rule can get rule({value, form, field})
    and should return [isValid, msg]
    Msg string gets name automatically. const msg = "has to be filled."; -> "Search field has to be filled."
*/

export const RULES = {
    /* HAS TO BE FILLED */
    hasToBeFilled: ({ value }) => {
        let [isValid, msg] = [true, "has to be filled."];

        const type = value && typeOf(value);
        if (!value) isValid = false;
        else if ((type === "array" || type === "string") && value.length < 1) isValid = false;
        else if (type === "object" && Object.keys(value).length < 1) isValid = false;
        else if (type === "number") isValid = true;

        return [isValid, msg, { setRequired: true }];
    },

    /* HAS TO BE A VALID PASSWORD - Basic Version */
    hasToBeAValidPasswordBasic: ({ value }) => {
        let [isValid, msg] = [true, "has to be min 8 characters."];

        if (!value) isValid = false;
        else if (value.length < 8) isValid = false;

        return [isValid, msg];
    },

    /* HAS TO BE A VALID PASSWORD - Advanced Version */
    hasToBeAValidPasswordAdvanced: ({ value }) => {
        let [isValid, msg] = [
            true,
            "has to be min 12 characters includes min 1 uppercase, 1 symbol, 1 number.",
        ];

        if (!value) isValid = false;
        else if (value.length < 12) isValid = false;
        else if (!value.split("").some((char) => LOWER_CASE_ALPHABET.includes(char)))
            isValid = false;
        else if (!value.split("").some((char) => UPPER_CASE_ALPHABET.includes(char)))
            isValid = false;
        else if (!value.split("").some((char) => NUMBERS.includes(char))) isValid = false;
        else if (!value.split("").some((char) => SYMBOLS.includes(char))) isValid = false;

        return [isValid, msg];
    },

    /* HAS TO BE A VALID PHONE NUMBER */
    hasToBeAValidPhoneNumber: ({ value }) => {
        let [isValid, msg] = [true, "has to be a valid phone number."];

        const validatePhone = (str) => {
            const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return regex.test(str);
        };

        if (!validatePhone(value)) isValid = false;

        return [isValid, msg];
    },

    /* HAS TO BE A VALID EMAIL */
    hasToBeAValidEmail: ({ value }) => {
        let [isValid, msg] = [true, "has to be a valid e-mail"];

        const reg = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

        if (!value) isValid = false;
        else if (!reg.test(String(value).toLowerCase())) isValid = false;

        return [isValid, msg];
    },

    /* HAS TO BE A VAILD URL */
    hasToBeAValidUrl: ({ value }) => {
        let [isValid, msg] = [true, "has to be a valid url."];
        const validURL = () => {
            const pattern = new RegExp(
                "^(https?:\\/\\/)?" +
                    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
                    "((\\d{1,3}\\.){3}\\d{1,3}))" +
                    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                    "(\\?[;&a-z\\d%_.~+=-]*)?" +
                    "(\\#[-a-z\\d_]*)?$",
                "i",
            );
            return !!pattern.test(value);
        };

        if (!value) isValid = false;
        else if (!value.includes("https://")) {
            isValid = false;
            msg = "has to include https://";
        } else if (!validURL()) isValid = false;

        return [isValid, msg];
    },

    /* HAS TO BE A VALID POSTBACK */
    hasToBeAValidPostback: ({ value }) => {
        let [isValid, msg] = [true, "has to be a valid postback url which includes https://"];
        const reg = new RegExp("^(https?:\\/\\/)", "i");

        if (!value) isValid = false;
        else if (!reg.test(value)) isValid = false;

        return [isValid, msg];
    },
};
