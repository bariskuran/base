import { LOWER_CASE_ALPHABET } from "../../constants/LOWER_CASE_ALPHABET";
import { UPPER_CASE_ALPHABET } from "../../constants/UPPER_CASE_ALPHABET";
import { NUMBERS } from "../../constants/NUMBERS";
import { SYMBOLS } from "../../constants/SYMBOLS";
import { LOREM_VOCABULARY } from "../../constants/LOREM_VOCABULARY";
import React from "react";

export const generateRandom = {
    _getRandomNumber: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    _generateRandomArray: (len) => {
        let [randomArray, currentSum, minNumber, maxNumber] = [[], 0, 1, 30];
        while (currentSum < len) {
            const remainingCount = len - currentSum;
            let randomNumber =
                remainingCount < maxNumber
                    ? remainingCount
                    : generateRandom._getRandomNumber(
                          minNumber,
                          Math.min(maxNumber, remainingCount),
                      );
            if (remainingCount < minNumber)
                randomNumber = randomNumber + (minNumber - remainingCount);
            currentSum += randomNumber;
            randomArray.push(randomNumber);
        }
        return randomArray;
    },
    _buildLoremText: (count, disableDot = false) => {
        let loremText = "";
        const arr = generateRandom._generateRandomArray(count);
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
        return loremText.trim();
    },
    _buildLoremParagraphs: (length, paragraphLength, disableDot = false) => {
        if (!(paragraphLength > 0)) return [generateRandom._buildLoremText(length, disableDot)];

        const avgParagraphLength = Math.max(1, Math.floor(paragraphLength));
        const minParagraphLength = Math.max(1, Math.floor(avgParagraphLength * 0.5));
        const maxParagraphLength = Math.max(
            minParagraphLength,
            Math.floor(avgParagraphLength * 1.5),
        );

        const paragraphSizes = [];
        let remaining = Math.max(0, Math.floor(length));

        while (remaining > 0) {
            if (remaining <= maxParagraphLength) {
                paragraphSizes.push(remaining);
                break;
            }
            const size = generateRandom._getRandomNumber(minParagraphLength, maxParagraphLength);
            paragraphSizes.push(size);
            remaining -= size;
        }

        return paragraphSizes.map((size) => generateRandom._buildLoremText(size, disableDot));
    },
    number: (min = 0, max = 100, decimal = 0, disableLocaleString = false) => {
        const scaleFactor = 10 ** decimal;
        const randomFloat = Math.random() * (max - min) + min;
        const scaledNumber = Math.round(randomFloat * scaleFactor) / scaleFactor;

        if (!disableLocaleString)
            return scaledNumber.toLocaleString(undefined, {
                minimumFractionDigits: decimal,
                maximumFractionDigits: decimal,
            });
        else return Number(scaledNumber.toFixed(decimal));
    },
    loremIpsum: (length = 50, options = {}) => {
        const {
            disableDot = false,
            paragraphLength = 0,
            enableParagraph = false,
            paragraphComponent = "p",
        } = options || {};

        if (!enableParagraph) {
            return generateRandom._buildLoremText(length, disableDot);
        }

        const paragraphs = generateRandom._buildLoremParagraphs(
            length,
            paragraphLength,
            disableDot,
        );

        return paragraphs.map((paragraph, i) =>
            React.createElement(paragraphComponent, { key: i }, paragraph),
        );
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
