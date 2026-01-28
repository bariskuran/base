import { LOWER_CASE_ALPHABET, UPPER_CASE_ALPHABET, NUMBERS, SYMBOLS } from "../CHARSETS";

export const generateRandomText = (
    length = 16,
    useUpperCase = false,
    useNumbers = false,
    useSymbols = false,
) => {
    let charset = LOWER_CASE_ALPHABET;
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
