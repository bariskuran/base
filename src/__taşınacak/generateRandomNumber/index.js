export const generateRandomNumber = (min = 0, max = 100, decimal = 0, toLocaleString = false) => {
    const scaleFactor = 10 ** decimal;
    const randomFloat = Math.random() * (max - min) + min;
    const scaledNumber = Math.round(randomFloat * scaleFactor) / scaleFactor;

    if (toLocaleString)
        return scaledNumber.toLocaleString(undefined, {
            minimumFractionDigits: decimal,
            maximumFractionDigits: decimal,
        });
    else return Number(scaledNumber.toFixed(decimal));
};
