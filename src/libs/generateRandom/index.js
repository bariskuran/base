import { LOWER_CASE_ALPHABET } from "../../constants/LOWER_CASE_ALPHABET";
import { UPPER_CASE_ALPHABET } from "../../constants/UPPER_CASE_ALPHABET";
import { NUMBERS } from "../../constants/NUMBERS";
import { SYMBOLS } from "../../constants/SYMBOLS";
import { LOREM_VOCABULARY } from "../../constants/LOREM_VOCABULARY";

/**

    generateRandom.text(length,{
        useLowerCase = true,
        useUpperCase = false,
        useNumbers = false,
        useSymbols = false,
    });

    generateRandom.loremIpsum(count,{
        disableDot = false,
    });

    generateRandom.number(min = 0, max = 100, decimal = 0, toLocaleString = false);

 */

export const generateRandom = {
    number: (min = 0, max = 100, decimal = 0, toLocaleString = false) => {
        const scaleFactor = 10 ** decimal;
        const randomFloat = Math.random() * (max - min) + min;
        const scaledNumber = Math.round(randomFloat * scaleFactor) / scaleFactor;

        if (toLocaleString)
            return scaledNumber.toLocaleString(undefined, {
                minimumFractionDigits: decimal,
                maximumFractionDigits: decimal,
            });
        else return Number(scaledNumber.toFixed(decimal));
    },
    loremIpsum: (count = 50, disableDot = false) => {
        const generateRandomArray = (count) => {
            const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
            let [randomArray, currentSum, minNumber, maxNumber] = [[], 0, 1, 30];
            while (currentSum < count) {
                const remainingCount = count - currentSum;
                let randomNumber =
                    remainingCount < maxNumber
                        ? remainingCount
                        : getRandomNumber(minNumber, Math.min(maxNumber, remainingCount));
                if (remainingCount < minNumber)
                    randomNumber = randomNumber + (minNumber - remainingCount);
                currentSum += randomNumber;
                randomArray.push(randomNumber);
            }
            return randomArray;
        };

        let loremText = "";
        const arr = generateRandomArray(count);
        for (let i = 0; i < arr.length; i++) {
            let sentence = "";
            const sentLength = arr[i];
            for (let i2 = 0; i2 < sentLength; i2++) {
                let previousWord = "";
                const func = () => {
                    const randomWord =
                        LOREM_VOCABULARY[Math.floor(Math.random() * LOREM_VOCABULARY.length)];
                    if (randomWord === previousWord) return func();
                    previousWord = randomWord;
                    return randomWord;
                };
                const randomWord = func();
                sentence += randomWord + " ";
            }
            loremText +=
                (disableDot
                    ? sentence
                    : (sentence.charAt(0).toUpperCase() + sentence.slice(1)).trim()) +
                (disableDot ? " " : ". ");
        }
        return loremText;
    },
    text: (length = 16, settings = {}) => {
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
    },
};
