/* eslint-disable no-useless-escape */
import { LOWER_CASE_ALPHABET } from "./LOWER_CASE_ALPHABET";
import { UPPER_CASE_ALPHABET } from "./UPPER_CASE_ALPHABET";
import { NUMBERS } from "./NUMBERS";
import { SYMBOLS } from "./SYMBOLS";
import { typeOf } from "../libs/typeOf";

/*
    Each rule can get rule({value, form, field})
    and should return [isValid, msg]
    Msg string gets name automatically. const msg = "has to be filled."; -> "Search field has to be filled."
*/
export const VALIDATION_RULES = {
    /**
     * -------------------------------------------------
     *
     * HAS TO BE FILLED
     *
     * -------------------------------------------------
     *
     * This field is required.
     */
    hasToBeFilled: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Bu alan zorunludur.",
                en: "This field is required.",
                fr: "Ce champ est obligatoire.",
                de: "Dieses Feld ist erforderlich.",
                es: "Este campo es obligatorio.",
                it: "Questo campo è obbligatorio.",
            },
        ];

        if (value === null || value === undefined) return [false, msg, { setRequired: true }];

        const type = typeOf(value);

        if (type === "string") isValid = value.trim().length > 0;
        else if (type === "array") isValid = value.length > 0;
        else if (type === "object") isValid = Object.keys(value).length > 0;
        else if (type === "boolean") isValid = true;
        else if (type === "number") isValid = true;
        else isValid = !!value; // fallback

        return [isValid, msg, { setRequired: true }];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE NOT EMPTY STRING
     *
     * -------------------------------------------------
     *
     * Must be a non-empty string (not just spaces).
     */
    hasToBeNotEmptyString: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Boş bir metin olamaz (sadece boşluk da olamaz).",
                en: "Must be a non-empty text (not only spaces).",
                fr: "Le texte ne peut pas être vide (pas seulement des espaces).",
                de: "Darf nicht leer sein (nicht nur Leerzeichen).",
                es: "No puede estar vacío (no solo espacios).",
                it: "Non può essere vuoto (non solo spazi).",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (value.trim().length < 1) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO HAVE MIN LENGTH 3
     *
     * -------------------------------------------------
     *
     * Must be at least 3 characters.
     */
    hasToHaveMinLength3: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az 3 karakter olmalıdır.",
                en: "Must be at least 3 characters.",
                fr: "Doit contenir au moins 3 caractères.",
                de: "Muss mindestens 3 Zeichen lang sein.",
                es: "Debe tener al menos 3 caracteres.",
                it: "Deve avere almeno 3 caratteri.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (value.length < 3) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO HAVE MIN LENGTH 8
     *
     * -------------------------------------------------
     *
     * Must be at least 8 characters.
     */
    hasToHaveMinLength8: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az 8 karakter olmalıdır.",
                en: "Must be at least 8 characters.",
                fr: "Doit contenir au moins 8 caractères.",
                de: "Muss mindestens 8 Zeichen lang sein.",
                es: "Debe tener al menos 8 caracteres.",
                it: "Deve avere almeno 8 caratteri.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (value.length < 8) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO HAVE MAX LENGTH 20
     *
     * -------------------------------------------------
     *
     * Must be at most 20 characters.
     */
    hasToHaveMaxLength20: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En fazla 20 karakter olmalıdır.",
                en: "Must be at most 20 characters.",
                fr: "Doit contenir au maximum 20 caractères.",
                de: "Darf höchstens 20 Zeichen lang sein.",
                es: "Debe tener como máximo 20 caracteres.",
                it: "Deve avere al massimo 20 caratteri.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (value.length > 20) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO HAVE EXACT LENGTH 6
     *
     * -------------------------------------------------
     *
     * Must be exactly 6 characters.
     */
    hasToHaveExactLength6: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Tam olarak 6 karakter olmalıdır.",
                en: "Must be exactly 6 characters.",
                fr: "Doit contenir exactement 6 caractères.",
                de: "Muss genau 6 Zeichen lang sein.",
                es: "Debe tener exactamente 6 caracteres.",
                it: "Deve avere esattamente 6 caratteri.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (value.length !== 6) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE ALPHABETIC ONLY
     *
     * -------------------------------------------------
     *
     * Only letters are allowed.
     */
    hasToBeAlphabeticOnly: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Sadece harf kullanılabilir.",
                en: "Only letters are allowed.",
                fr: "Seules les lettres sont autorisées.",
                de: "Nur Buchstaben sind erlaubt.",
                es: "Solo se permiten letras.",
                it: "Sono consentite solo lettere.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/^[A-Za-z]+$/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE ALPHANUMERIC ONLY
     *
     * -------------------------------------------------
     *
     * Only letters and numbers are allowed.
     */
    hasToBeAlphanumericOnly: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Sadece harf ve rakam kullanılabilir.",
                en: "Only letters and numbers are allowed.",
                fr: "Seules les lettres et les chiffres sont autorisés.",
                de: "Nur Buchstaben und Zahlen sind erlaubt.",
                es: "Solo se permiten letras y números.",
                it: "Sono consentite solo lettere e numeri.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/^[A-Za-z0-9]+$/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE NUMERIC STRING ONLY
     *
     * -------------------------------------------------
     *
     * Only digits are allowed.
     */
    hasToBeNumericStringOnly: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Sadece rakam girilebilir.",
                en: "Only digits are allowed.",
                fr: "Seuls les chiffres sont autorisés.",
                de: "Nur Ziffern sind erlaubt.",
                es: "Solo se permiten dígitos.",
                it: "Sono consentite solo cifre.",
            },
        ];
        if (typeof value !== "string" && typeof value !== "number") isValid = false;
        else if (!/^\d+$/.test(String(value))) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO CONTAIN NO SPACES
     *
     * -------------------------------------------------
     *
     * Spaces are not allowed.
     */
    hasToContainNoSpaces: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Boşluk kullanılamaz.",
                en: "Spaces are not allowed.",
                fr: "Les espaces ne sont pas autorisés.",
                de: "Leerzeichen sind nicht erlaubt.",
                es: "No se permiten espacios.",
                it: "Gli spazi non sono consentiti.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (/\s/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO START WITH LETTER
     *
     * -------------------------------------------------
     *
     * Must start with a letter.
     */
    hasToStartWithLetter: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Bir harf ile başlamalıdır.",
                en: "Must start with a letter.",
                fr: "Doit commencer par une lettre.",
                de: "Muss mit einem Buchstaben beginnen.",
                es: "Debe comenzar con una letra.",
                it: "Deve iniziare con una lettera.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/^[A-Za-z]/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO START WITH UPPERCASE
     *
     * -------------------------------------------------
     *
     * Must start with an uppercase letter.
     */
    hasToStartWithUppercase: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Büyük harf ile başlamalıdır.",
                en: "Must start with an uppercase letter.",
                fr: "Doit commencer par une majuscule.",
                de: "Muss mit einem Großbuchstaben beginnen.",
                es: "Debe comenzar con una letra mayúscula.",
                it: "Deve iniziare con una lettera maiuscola.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/^[A-Z]/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO CONTAIN A NUMBER
     *
     * -------------------------------------------------
     *
     * Must include at least one number.
     */
    hasToContainANumber: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az bir rakam içermelidir.",
                en: "Must include at least one number.",
                fr: "Doit contenir au moins un chiffre.",
                de: "Muss mindestens eine Zahl enthalten.",
                es: "Debe incluir al menos un número.",
                it: "Deve includere almeno un numero.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/\d/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO CONTAIN AN UPPERCASE LETTER
     *
     * -------------------------------------------------
     *
     * Must include at least one uppercase letter.
     */
    hasToContainAnUppercaseLetter: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az bir büyük harf içermelidir.",
                en: "Must include at least one uppercase letter.",
                fr: "Doit contenir au moins une majuscule.",
                de: "Muss mindestens einen Großbuchstaben enthalten.",
                es: "Debe incluir al menos una letra mayúscula.",
                it: "Deve includere almeno una lettera maiuscola.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/[A-Z]/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO CONTAIN A LOWERCASE LETTER
     *
     * -------------------------------------------------
     *
     * Must include at least one lowercase letter.
     */
    hasToContainALowercaseLetter: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az bir küçük harf içermelidir.",
                en: "Must include at least one lowercase letter.",
                fr: "Doit contenir au moins une minuscule.",
                de: "Muss mindestens einen Kleinbuchstaben enthalten.",
                es: "Debe incluir al menos una letra minúscula.",
                it: "Deve includere almeno una lettera minuscola.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/[a-z]/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO CONTAIN A SYMBOL
     *
     * -------------------------------------------------
     *
     * Must include at least one symbol.
     */
    hasToContainASymbol: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az bir sembol içermelidir.",
                en: "Must include at least one symbol.",
                fr: "Doit contenir au moins un symbole.",
                de: "Muss mindestens ein Symbol enthalten.",
                es: "Debe incluir al menos un símbolo.",
                it: "Deve includere almeno un simbolo.",
            },
        ];
        if (typeof value !== "string") isValid = false;
        else if (!/[^\w\s]/.test(value)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID PASSWORD - BASIC
     *
     * -------------------------------------------------
     *
     * Must be at least 8 characters.
     */
    hasToBeAValidPasswordBasic: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az 8 karakter olmalıdır.",
                en: "Must be at least 8 characters.",
                fr: "Doit contenir au moins 8 caractères.",
                de: "Muss mindestens 8 Zeichen lang sein.",
                es: "Debe tener al menos 8 caracteres.",
                it: "Deve avere almeno 8 caratteri.",
            },
        ];
        if (!value) isValid = false;
        else if (String(value).length < 8) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID PASSWORD - ADVANCED
     *
     * -------------------------------------------------
     *
     * Must be 12+ characters and include uppercase, lowercase, number, and symbol.
     */
    hasToBeAValidPasswordAdvanced: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "En az 12 karakter olmalı; büyük/küçük harf, rakam ve sembol içermelidir.",
                en: "Must be 12+ characters and include uppercase, lowercase, number, and symbol.",
                fr: "Doit contenir au moins 12 caractères et inclure majuscule, minuscule, chiffre et symbole.",
                de: "Muss mindestens 12 Zeichen lang sein und Groß-/Kleinbuchstaben, Zahl und Symbol enthalten.",
                es: "Debe tener 12+ caracteres e incluir mayúscula, minúscula, número y símbolo.",
                it: "Deve avere 12+ caratteri e includere maiuscola, minuscola, numero e simbolo.",
            },
        ];

        const v = String(value || "");
        if (v.length < 12) isValid = false;
        else if (!v.split("").some((c) => LOWER_CASE_ALPHABET.includes(c))) isValid = false;
        else if (!v.split("").some((c) => UPPER_CASE_ALPHABET.includes(c))) isValid = false;
        else if (!v.split("").some((c) => NUMBERS.includes(c))) isValid = false;
        else if (!v.split("").some((c) => SYMBOLS.includes(c))) isValid = false;

        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID PHONE NUMBER
     *
     * -------------------------------------------------
     *
     * Must be a valid phone number format.
     */
    hasToBeAValidPhoneNumber: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir telefon numarası olmalıdır.",
                en: "Must be a valid phone number.",
                fr: "Doit être un numéro de téléphone valide.",
                de: "Muss eine gültige Telefonnummer sein.",
                es: "Debe ser un número de teléfono válido.",
                it: "Deve essere un numero di telefono valido.",
            },
        ];
        const str = String(value || "");
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!regex.test(str)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID INTERNATIONAL PHONE (E.164-ish)
     *
     * -------------------------------------------------
     *
     * Must look like an international phone number.
     */
    hasToBeAValidInternationalPhone: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir uluslararası telefon numarası olmalıdır.",
                en: "Must be a valid international phone number.",
                fr: "Doit être un numéro de téléphone international valide.",
                de: "Muss eine gültige internationale Telefonnummer sein.",
                es: "Debe ser un número de teléfono internacional válido.",
                it: "Deve essere un numero di telefono internazionale valido.",
            },
        ];
        const str = String(value || "");
        if (!/^\+\d{8,15}$/.test(str.replace(/\s+/g, ""))) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID EMAIL
     *
     * -------------------------------------------------
     *
     * Must be a valid email address.
     */
    hasToBeAValidEmail: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir e-posta adresi olmalıdır.",
                en: "Must be a valid e-mail address.",
                fr: "Doit être une adresse e-mail valide.",
                de: "Muss eine gültige E-Mail-Adresse sein.",
                es: "Debe ser una dirección de correo válida.",
                it: "Deve essere un indirizzo e-mail valido.",
            },
        ];

        const reg = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

        const v = String(value || "");
        if (!v) isValid = false;
        else if (!reg.test(v.toLowerCase())) isValid = false;

        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID URL (HTTPS REQUIRED)
     *
     * -------------------------------------------------
     *
     * Must be a valid URL and include https://
     */
    hasToBeAValidUrl: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir URL olmalı ve https:// içermelidir.",
                en: "Must be a valid URL and include https://",
                fr: "Doit être une URL valide et inclure https://",
                de: "Muss eine gültige URL sein und https:// enthalten.",
                es: "Debe ser una URL válida e incluir https://",
                it: "Deve essere un URL valido e includere https://",
            },
        ];

        const v = String(value || "");
        if (!v) isValid = false;
        else if (!v.startsWith("https://")) isValid = false;
        else {
            const pattern = new RegExp(
                "^(https?:\\/\\/)?" +
                    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
                    "((\\d{1,3}\\.){3}\\d{1,3}))" +
                    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                    "(\\?[;&a-z\\d%_.~+=-]*)?" +
                    "(\\#[-a-z\\d_]*)?$",
                "i",
            );
            if (!pattern.test(v)) isValid = false;
        }

        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID POSTBACK (HTTPS)
     *
     * -------------------------------------------------
     *
     * Must start with https://
     */
    hasToBeAValidPostback: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir postback URL'i olmalı ve https:// ile başlamalıdır.",
                en: "Must be a valid postback URL that includes https://",
                fr: "Doit être une URL de postback valide et inclure https://",
                de: "Muss eine gültige Postback-URL sein und https:// enthalten.",
                es: "Debe ser una URL de postback válida e incluir https://",
                it: "Deve essere un URL di postback valido e includere https://",
            },
        ];
        const v = String(value || "");
        const reg = new RegExp("^(https:\\/\\/)", "i");
        if (!v) isValid = false;
        else if (!reg.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE AN INTEGER
     *
     * -------------------------------------------------
     *
     * Must be an integer number.
     */
    hasToBeAnInteger: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Tam sayı olmalıdır.",
                en: "Must be an integer.",
                fr: "Doit être un nombre entier.",
                de: "Muss eine ganze Zahl sein.",
                es: "Debe ser un número entero.",
                it: "Deve essere un numero intero.",
            },
        ];
        const n = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(n) || !Number.isInteger(n)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A POSITIVE NUMBER
     *
     * -------------------------------------------------
     *
     * Must be greater than 0.
     */
    hasToBePositiveNumber: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Pozitif bir sayı olmalıdır.",
                en: "Must be a positive number.",
                fr: "Doit être un nombre positif.",
                de: "Muss eine positive Zahl sein.",
                es: "Debe ser un número positivo.",
                it: "Deve essere un numero positivo.",
            },
        ];
        const n = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(n) || n <= 0) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE ZERO OR POSITIVE NUMBER
     *
     * -------------------------------------------------
     *
     * Must be 0 or greater.
     */
    hasToBeZeroOrPositiveNumber: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "0 veya pozitif bir sayı olmalıdır.",
                en: "Must be zero or a positive number.",
                fr: "Doit être zéro ou un nombre positif.",
                de: "Muss null oder positiv sein.",
                es: "Debe ser cero o un número positivo.",
                it: "Deve essere zero o un numero positivo.",
            },
        ];
        const n = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(n) || n < 0) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE IN RANGE 0 - 100
     *
     * -------------------------------------------------
     *
     * Must be between 0 and 100.
     */
    hasToBeInRange0To100: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "0 ile 100 arasında olmalıdır.",
                en: "Must be between 0 and 100.",
                fr: "Doit être entre 0 et 100.",
                de: "Muss zwischen 0 und 100 liegen.",
                es: "Debe estar entre 0 y 100.",
                it: "Deve essere tra 0 e 100.",
            },
        ];
        const n = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(n) || n < 0 || n > 100) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID DATE (YYYY-MM-DD)
     *
     * -------------------------------------------------
     *
     * Must be a valid date formatted as YYYY-MM-DD.
     */
    hasToBeAValidDateYMD: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir tarih olmalıdır (YYYY-AA-GG).",
                en: "Must be a valid date (YYYY-MM-DD).",
                fr: "Doit être une date valide (AAAA-MM-JJ).",
                de: "Muss ein gültiges Datum sein (JJJJ-MM-TT).",
                es: "Debe ser una fecha válida (AAAA-MM-DD).",
                it: "Deve essere una data valida (AAAA-MM-GG).",
            },
        ];

        const v = String(value || "");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return [false, msg];

        const [y, m, d] = v.split("-").map((x) => Number(x));
        const dt = new Date(Date.UTC(y, m - 1, d));
        if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
            isValid = false;
        }
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A FUTURE DATE (ISO parseable)
     *
     * -------------------------------------------------
     *
     * Must be a date in the future.
     */
    hasToBeAFutureDate: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Gelecekte bir tarih olmalıdır.",
                en: "Must be a future date.",
                fr: "Doit être une date dans le futur.",
                de: "Muss ein Datum in der Zukunft sein.",
                es: "Debe ser una fecha en el futuro.",
                it: "Deve essere una data futura.",
            },
        ];
        const t = Date.parse(String(value || ""));
        if (!Number.isFinite(t)) isValid = false;
        else if (t <= Date.now()) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A PAST DATE (ISO parseable)
     *
     * -------------------------------------------------
     *
     * Must be a date in the past.
     */
    hasToBeAPastDate: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçmişte bir tarih olmalıdır.",
                en: "Must be a past date.",
                fr: "Doit être une date dans le passé.",
                de: "Muss ein Datum in der Vergangenheit sein.",
                es: "Debe ser una fecha en el pasado.",
                it: "Deve essere una data passata.",
            },
        ];
        const t = Date.parse(String(value || ""));
        if (!Number.isFinite(t)) isValid = false;
        else if (t >= Date.now()) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID IPV4 ADDRESS
     *
     * -------------------------------------------------
     *
     * Must be a valid IPv4 address.
     */
    hasToBeAValidIPv4: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir IPv4 adresi olmalıdır.",
                en: "Must be a valid IPv4 address.",
                fr: "Doit être une adresse IPv4 valide.",
                de: "Muss eine gültige IPv4-Adresse sein.",
                es: "Debe ser una dirección IPv4 válida.",
                it: "Deve essere un indirizzo IPv4 valido.",
            },
        ];
        const v = String(value || "");
        const parts = v.split(".");
        if (parts.length !== 4) isValid = false;
        else {
            for (const p of parts) {
                if (!/^\d+$/.test(p)) {
                    isValid = false;
                    break;
                }
                const n = Number(p);
                if (n < 0 || n > 255) {
                    isValid = false;
                    break;
                }
            }
        }
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID UUID (v4-ish)
     *
     * -------------------------------------------------
     *
     * Must be a valid UUID.
     */
    hasToBeAValidUUID: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir UUID olmalıdır.",
                en: "Must be a valid UUID.",
                fr: "Doit être un UUID valide.",
                de: "Muss eine gültige UUID sein.",
                es: "Debe ser un UUID válido.",
                it: "Deve essere un UUID valido.",
            },
        ];
        const v = String(value || "");
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) {
            isValid = false;
        }
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID HEX COLOR
     *
     * -------------------------------------------------
     *
     * Must be a valid hex color (#RGB or #RRGGBB).
     */
    hasToBeAValidHexColor: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir hex renk olmalıdır (örn. #FFAA00).",
                en: "Must be a valid hex color (e.g. #FFAA00).",
                fr: "Doit être une couleur hex valide (ex. #FFAA00).",
                de: "Muss eine gültige Hex-Farbe sein (z. B. #FFAA00).",
                es: "Debe ser un color hex válido (p. ej. #FFAA00).",
                it: "Deve essere un colore hex valido (es. #FFAA00).",
            },
        ];
        const v = String(value || "");
        if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID USERNAME
     *
     * -------------------------------------------------
     *
     * 3-20 chars, letters/numbers/._ only, no spaces.
     */
    hasToBeAValidUsername: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir kullanıcı adı olmalıdır (3-20 karakter, harf/rakam/._).",
                en: "Must be a valid username (3-20 chars, letters/numbers/._).",
                fr: "Doit être un nom d'utilisateur valide (3-20 caractères, lettres/chiffres/._).",
                de: "Muss ein gültiger Benutzername sein (3–20 Zeichen, Buchstaben/Zahlen/._).",
                es: "Debe ser un nombre de usuario válido (3-20 caracteres, letras/números/._).",
                it: "Deve essere un nome utente valido (3-20 caratteri, lettere/numeri/._).",
            },
        ];
        const v = String(value || "");
        if (!/^[a-zA-Z0-9._]{3,20}$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID SLUG
     *
     * -------------------------------------------------
     *
     * Lowercase letters, numbers, hyphens only.
     */
    hasToBeAValidSlug: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir slug olmalıdır (küçük harf, rakam, tire).",
                en: "Must be a valid slug (lowercase, numbers, hyphens).",
                fr: "Doit être un slug valide (minuscules, chiffres, tirets).",
                de: "Muss ein gültiger Slug sein (klein, Zahlen, Bindestriche).",
                es: "Debe ser un slug válido (minúsculas, números, guiones).",
                it: "Deve essere uno slug valido (minuscole, numeri, trattini).",
            },
        ];
        const v = String(value || "");
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID CREDIT CARD NUMBER (LUHN)
     *
     * -------------------------------------------------
     *
     * Must pass Luhn checksum validation.
     */
    hasToBeAValidCreditCardNumber: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir kredi kartı numarası olmalıdır.",
                en: "Must be a valid credit card number.",
                fr: "Doit être un numéro de carte bancaire valide.",
                de: "Muss eine gültige Kreditkartennummer sein.",
                es: "Debe ser un número de tarjeta válido.",
                it: "Deve essere un numero di carta di credito valido.",
            },
        ];
        const v = String(value || "").replace(/\s+/g, "");
        if (!/^\d{12,19}$/.test(v)) return [false, msg];

        let sum = 0;
        let shouldDouble = false;
        for (let i = v.length - 1; i >= 0; i--) {
            let digit = Number(v[i]);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        if (sum % 10 !== 0) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID IBAN (BASIC)
     *
     * -------------------------------------------------
     *
     * Basic IBAN format check (not full country-specific).
     */
    hasToBeAValidIBANBasic: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir IBAN olmalıdır (temel kontrol).",
                en: "Must be a valid IBAN (basic format).",
                fr: "Doit être un IBAN valide (format de base).",
                de: "Muss eine gültige IBAN sein (Basisformat).",
                es: "Debe ser un IBAN válido (formato básico).",
                it: "Deve essere un IBAN valido (formato base).",
            },
        ];
        const v = String(value || "")
            .replace(/\s+/g, "")
            .toUpperCase();
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID SWIFT / BIC (BASIC)
     *
     * -------------------------------------------------
     *
     * Basic SWIFT/BIC format check.
     */
    hasToBeAValidSwiftBicBasic: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir SWIFT/BIC kodu olmalıdır.",
                en: "Must be a valid SWIFT/BIC code.",
                fr: "Doit être un code SWIFT/BIC valide.",
                de: "Muss ein gültiger SWIFT/BIC-Code sein.",
                es: "Debe ser un código SWIFT/BIC válido.",
                it: "Deve essere un codice SWIFT/BIC valido.",
            },
        ];
        const v = String(value || "")
            .trim()
            .toUpperCase();
        if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID JSON STRING
     *
     * -------------------------------------------------
     *
     * Must be a valid JSON.
     */
    hasToBeAValidJsonString: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir JSON metni olmalıdır.",
                en: "Must be a valid JSON string.",
                fr: "Doit être une chaîne JSON valide.",
                de: "Muss ein gültiger JSON-String sein.",
                es: "Debe ser una cadena JSON válida.",
                it: "Deve essere una stringa JSON valida.",
            },
        ];
        if (typeof value !== "string") return [false, msg];
        try {
            JSON.parse(value);
        } catch (e) {
            isValid = false;
        }
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID BASE64 STRING (BASIC)
     *
     * -------------------------------------------------
     *
     * Must look like base64.
     */
    hasToBeAValidBase64Basic: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir base64 metni olmalıdır.",
                en: "Must be a valid base64 string.",
                fr: "Doit être une chaîne base64 valide.",
                de: "Muss ein gültiger Base64-String sein.",
                es: "Debe ser una cadena base64 válida.",
                it: "Deve essere una stringa base64 valida.",
            },
        ];
        const v = String(value || "").trim();
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v)) {
            isValid = false;
        }
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID POSTAL CODE (US BASIC)
     *
     * -------------------------------------------------
     *
     * Must be a valid US ZIP (12345 or 12345-6789).
     */
    hasToBeAValidPostalCodeUS: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir ABD posta kodu (ZIP) olmalıdır.",
                en: "Must be a valid US ZIP code.",
                fr: "Doit être un code postal US (ZIP) valide.",
                de: "Muss ein gültiger US-Postleitzahlcode (ZIP) sein.",
                es: "Debe ser un código postal ZIP válido de EE. UU.",
                it: "Deve essere un CAP/ZIP USA valido.",
            },
        ];
        const v = String(value || "");
        if (!/^\d{5}(-\d{4})?$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID COUNTRY CODE (ISO2)
     *
     * -------------------------------------------------
     *
     * Must be a 2-letter country code (e.g. TR, GR, UK).
     */
    hasToBeAValidCountryCodeISO2: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "2 harfli bir ülke kodu olmalıdır (örn. TR, GR, UK).",
                en: "Must be a valid ISO2 country code (2 letters).",
                fr: "Doit être un code pays ISO2 valide (2 lettres).",
                de: "Muss ein gültiger ISO2-Ländercode sein (2 Buchstaben).",
                es: "Debe ser un código de país ISO2 válido (2 letras).",
                it: "Deve essere un codice paese ISO2 valido (2 lettere).",
            },
        ];
        const v = String(value || "")
            .trim()
            .toUpperCase();
        if (!/^[A-Z]{2}$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID TIME (HH:MM)
     *
     * -------------------------------------------------
     *
     * Must be a valid time (24-hour format).
     */
    hasToBeAValidTimeHHMM: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir saat olmalıdır (SS:DD, 24 saat formatı).",
                en: "Must be a valid time (HH:MM).",
                fr: "Doit être une heure valide (HH:MM).",
                de: "Muss eine gültige Uhrzeit sein (HH:MM).",
                es: "Debe ser una hora válida (HH:MM).",
                it: "Deve essere un orario valido (HH:MM).",
            },
        ];
        const v = String(value || "");
        if (!/^\d{2}:\d{2}$/.test(v)) return [false, msg];
        const [hh, mm] = v.split(":").map(Number);
        if (hh < 0 || hh > 23 || mm < 0 || mm > 59) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID MAC ADDRESS
     *
     * -------------------------------------------------
     *
     * Must be a valid MAC address.
     */
    hasToBeAValidMacAddress: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Geçerli bir MAC adresi olmalıdır.",
                en: "Must be a valid MAC address.",
                fr: "Doit être une adresse MAC valide.",
                de: "Muss eine gültige MAC-Adresse sein.",
                es: "Debe ser una dirección MAC válida.",
                it: "Deve essere un indirizzo MAC valido.",
            },
        ];
        const v = String(value || "").trim();
        if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(v)) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO MATCH SIMPLE NAME (LETTERS + SPACE)
     *
     * -------------------------------------------------
     *
     * Must contain only letters and spaces.
     */
    hasToMatchSimpleName: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: "Sadece harf ve boşluk içermelidir.",
                en: "Must contain only letters and spaces.",
                fr: "Doit contenir uniquement des lettres et des espaces.",
                de: "Darf nur Buchstaben und Leerzeichen enthalten.",
                es: "Debe contener solo letras y espacios.",
                it: "Deve contenere solo lettere e spazi.",
            },
        ];
        const v = String(value || "");
        if (!/^[A-Za-z\s]+$/.test(v.trim())) isValid = false;
        return [isValid, msg];
    },

    /**
     * -------------------------------------------------
     *
     * HAS TO BE A VALID LAT/LNG (BASIC)
     *
     * -------------------------------------------------
     *
     * Must be a valid latitude/longitude pair: "lat,lng".
     */
    hasToBeAValidLatLngBasic: ({ value }) => {
        let [isValid, msg] = [
            true,
            {
                tr: 'Geçerli bir enlem/boylam çifti olmalıdır: "lat,lng".',
                en: "Must be a valid lat,lng pair.",
                fr: "Doit être une paire lat,lng valide.",
                de: "Muss ein gültiges lat,lng-Paar sein.",
                es: "Debe ser un par lat,lng válido.",
                it: "Deve essere una coppia lat,lng valida.",
            },
        ];
        const v = String(value || "").trim();
        const parts = v.split(",").map((x) => x.trim());
        if (parts.length !== 2) return [false, msg];

        const lat = Number(parts[0]);
        const lng = Number(parts[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) isValid = false;
        else if (lat < -90 || lat > 90) isValid = false;
        else if (lng < -180 || lng > 180) isValid = false;

        return [isValid, msg];
    },
};
