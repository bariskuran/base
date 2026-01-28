import { FORMATS } from "./FORMATS.js";
import { getDefaults } from "./_tools";

const formatKeys = Object.keys(FORMATS);
const matchRegex = new RegExp(`(${formatKeys.join("|")})`, "g");

export const dateToFormat = (date, incomingFormat) => {
    if (!date) return;
    const dateObj =
        typeof date === "number" ? new Date(date) : date instanceof Date ? date : undefined;
    if (!dateObj) return;

    const { format } = getDefaults(incomingFormat);

    const matchingParts = format.match(matchRegex) || [];

    const nonMatchingParts = [];
    let currentIndex = 0;

    for (const match of matchingParts || []) {
        const index = format.indexOf(match, currentIndex);

        if (index !== -1) {
            const nonMatchingPart = format.slice(currentIndex, index);
            if (nonMatchingPart) {
                nonMatchingParts.push(nonMatchingPart);
            }
            currentIndex = index + match.length;
        }
    }

    const mergedArray = [];
    let [i1, i2, i1Len, i2Len, str] = [0, 0, matchingParts.length, nonMatchingParts.length, format];

    const sort = () => {
        if (i1 < i1Len && str.startsWith(matchingParts[i1])) {
            mergedArray.push(matchingParts[i1]);
            str = str.substring(matchingParts[i1].length);
            i1 = i1 + 1;
        } else if (i2 < i2Len && str.startsWith(nonMatchingParts[i2])) {
            mergedArray.push(nonMatchingParts[i2]);
            str = str.substring(nonMatchingParts[i2].length);
            i2 = i2 + 1;
        }
        if (i1 < i1Len || i2 < i2Len) {
            sort();
        }
    };
    sort();

    return mergedArray
        .map((part) => (formatKeys.includes(part) ? FORMATS[part](dateObj) : part))
        .join("");
};
