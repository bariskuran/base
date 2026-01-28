export const generateRandomLoremIpsum = (count = 50, disableDot = false) => {
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
                const randomWord = words[Math.floor(Math.random() * words.length)];
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
};

const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "posuere",
    "sollicitudin",
    "aliquam",
    "ultrices",
    "sagittis",
    "orci",
    "a",
    "scelerisque",
    "cursus",
    "vitae",
    "congue",
    "mauris",
    "rhoncus",
    "pharetra",
    "massa",
    "dictumst",
    "quisque",
    "purus",
    "volutpat",
    "consequat",
    "sapien",
    "pellentesque",
    "habitant",
    "morbi",
    "tristique",
    "senectus",
    "at",
    "augue",
    "eget",
    "arcu",
    "dictum",
    "varius",
    "duis",
    "eu",
    "non",
    "diam",
    "phasellus",
    "vestibulum",
    "nisl",
    "suscipit",
    "bibendum",
    "est",
    "ultricies",
    "integer",
    "quis",
    "vel",
    "quam",
    "elementum",
    "pulvinar",
    "etiam",
    "tincidunt",
    "id",
    "aliquet",
    "risus",
    "feugiat",
    "in",
    "ante",
    "metus",
    "nulla",
    "facilisi",
    "cras",
    "fermentum",
    "odio",
    "enim",
    "tortor",
    "nisi",
    "auctor",
    "leo",
    "turpis",
    "nunc",
    "fusce",
    "placerat",
    "erat",
    "velit",
    "nam",
    "pretium",
    "vulputate",
    "dignissim",
    "suspendisse",
    "mattis",
    "ullamcorper",
    "ornare",
    "eleifend",
    "mi",
    "sem",
    "viverra",
    "hac",
    "habitasse",
    "platea",
    "justo",
    "faucibus",
    "dui",
    "vivamus",
    "accumsan",
    "lacus",
    "facilisis",
    "porttitor",
    "egestas",
    "gravida",
    "neque",
    "laoreet",
    "ac",
    "tellus",
    "rutrum",
    "nec",
    "donec",
    "venenatis",
    "condimentum",
    "blandit",
    "lobortis",
    "ligula",
    "malesuada",
    "proin",
    "libero",
    "interdum",
    "euismod",
    "nullam",
    "lectus",
    "commodo",
    "netus",
    "fames",
    "maecenas",
    "aenean",
    "nibh",
    "tempus",
    "imperdiet",
    "felis",
    "lacinia",
    "eros",
    "iaculis",
    "potenti",
    "molestie",
    "urna",
    "vehicula",
    "mollis",
    "sociis",
    "natoque",
    "penatibus",
    "magnis",
    "dis",
    "parturient",
    "montes",
    "nascetur",
    "ridiculus",
    "porta",
    "dapibus",
    "mus",
    "semper",
    "sodales",
    "fringilla",
    "praesent",
    "curabitur",
    "cum",
    "convallis",
    "hendrerit",
    "luctus",
];
