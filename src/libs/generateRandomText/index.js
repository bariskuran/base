/**

    generateRandomText(length,{
        useLowerCase = true,
        useUpperCase = false,
        useNumbers = false,
        useSymbols = false,
    });

 */

import { LOWER_CASE_ALPHABET } from "../../constants/LOWER_CASE_ALPHABET";
import { UPPER_CASE_ALPHABET } from "../../constants/UPPER_CASE_ALPHABET";
import { NUMBERS } from "../../constants/NUMBERS";
import { SYMBOLS } from "../../constants/SYMBOLS";

/**
 * @typedef {Object} GenerateRandomTextSettings
 * @property {boolean} [useLowerCase=true] - Include lowercase letters (a–z)
 * @property {boolean} [useUpperCase=false] - Include uppercase letters (A–Z)
 * @property {boolean} [useNumbers=false] - Include numeric characters (0–9)
 * @property {boolean} [useSymbols=false] - Include symbol characters (!@#$%^&* etc.)
 */

/**
 * Generates a random text string with configurable character sets.
 *
 * @param {number} [length=16] - Length of the generated string
 * @param {Partial<GenerateRandomTextSettings>} [settings={}] - Character set configuration
 * @returns {string} Randomly generated string
 */
export const generateRandomText = (length = 16, settings = {}) => {
    const {
        useLowerCase = true,
        useUpperCase = false,
        useNumbers = false,
        useSymbols = false,
    } = settings;

    let charset = useLowerCase ? LOWER_CASE_ALPHABET : "";
    if (useUpperCase) charset += UPPER_CASE_ALPHABET;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    const textArray = [];

    for (let i = 0; i < length; i++) {
        const randomCharIndex = Math.floor(Math.random() * charset.length);
        const randomChar = charset[randomCharIndex];
        textArray.push(randomChar);
    }

    return textArray.join("");
};
