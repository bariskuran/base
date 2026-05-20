/**
 * Converts a string between common "case" formats (camel, pascal, kebab, snake, constant, dot, path, etc.).
 *
 * Input case is auto-detected (best-effort), then the string is converted to the requested outputType.
 * Internally it normalizes the input into a whitespace-separated "sentence" form (words),
 * then reassembles those words according to the requested output format.
 *
 * Supported outputType values:
 * - "camel"     => "helloWorld"
 * - "pascal"    => "HelloWorld"
 * - "kebab"     => "hello-world"
 * - "snake"     => "hello_world"
 * - "constant"  => "HELLO_WORLD"
 * - "dot"       => "hello.world"
 * - "path"      => "hello/world"
 * - "lower"     => "hello world"
 * - "sentence"  => "Hello world"
 * - "title"     => "Hello World"
 * - "spaced"    => "Hello World" (currently identical to "title")
 *
 * Notes:
 * - Auto-detection is regex-based and best-effort; edge cases like acronyms (e.g. "myURLValue"),
 *   numbers, or non-ASCII characters may not be detected as expected.
 * - If `string` is falsy, it returns an empty string.
 * - If `outputType` is unknown, it returns a string like `"undefined outputType > ${outputType}"`.
 *
 * @param {string} string - The input string to convert.
 * @param {"camel"|"pascal"|"kebab"|"snake"|"constant"|"dot"|"path"|"lower"|"sentence"|"title"|"spaced"} [outputType="camel"]
 *        The desired output case format.
 *
 * @returns {string} The converted string.
 *
 * @example
 * stringCaseConverter("helloWorld", "kebab");        // "hello-world"
 * stringCaseConverter("HelloWorld", "snake");        // "hello_world"
 * stringCaseConverter("hello-world", "camel");       // "helloWorld"
 * stringCaseConverter("HELLO_WORLD", "sentence");    // "Hello world"
 * stringCaseConverter("hello/world", "title");       // "Hello World"
 */
export const stringCaseConverter = (string, outputType = "camel") => {
    if (!string || typeof string !== "string") {
        console.log("stringCaseConverter: string is falsy", JSON.stringify(string));
        return "";
    }

    let input;
    if (/^[a-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*$/.test(string)) input = "camel";
    else if (/^[A-Z][a-z0-9]*(?:[A-Z][a-z0-9]*)*$/.test(string)) input = "pascal";
    else if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(string)) input = "kebab";
    else if (/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(string)) input = "snake";
    else if (/^[A-Z0-9]+(?:_[A-Z0-9]+)*$/.test(string)) input = "constant";
    else if (/^[a-z0-9]+(?:\.[a-z0-9]+)*$/.test(string)) input = "dot";
    else if (/^[a-z0-9]+(?:\/[a-z0-9]+)*$/.test(string)) input = "path";
    else if (/^[a-z0-9\s]+$/.test(string)) input = "lower";
    else if (/^[A-Z][a-z0-9\s]*$/.test(string)) input = "sentence";
    else if (/^(?:[A-Z][a-z0-9]*\s*)+$/.test(string)) input = "title";
    else if (/^[A-Z][a-z0-9]*(?:\s[A-Z][a-z0-9]*)*$/.test(string)) input = "spaced";
    else input = "sentence";

    let sentenceCase = string;
    switch (input) {
        case "camel":
        case "pascal":
            sentenceCase = string.replace(/([A-Z])/g, " $1").trim();
            break;
        case "kebab":
        case "snake":
        case "constant":
        case "dot":
        case "path":
            sentenceCase = string.replace(/[-_./]/g, " ");
            break;
        case "lower":
            sentenceCase = string.charAt(0).toUpperCase() + string.slice(1);
            break;
        case "title":
        case "spaced":
            sentenceCase = string.replace(/([A-Z])/g, " $1").trim();
            break;
    }

    const words = sentenceCase.trim().split(/\s+/);

    switch (outputType) {
        case "camel":
            return words
                .map((word, index) =>
                    index === 0
                        ? word.toLowerCase()
                        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join("");

        case "pascal":
            return words
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join("");

        case "kebab":
            return words.map((word) => word.toLowerCase()).join("-");

        case "snake":
            return words.map((word) => word.toLowerCase()).join("_");

        case "constant":
            return words.map((word) => word.toUpperCase()).join("_");

        case "dot":
            return words.map((word) => word.toLowerCase()).join(".");

        case "path":
            return words.map((word) => word.toLowerCase()).join("/");

        case "lower":
            return words.join(" ").toLowerCase();

        case "sentence":
            return words
                .map((word, index) =>
                    index === 0
                        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        : word.toLowerCase(),
                )
                .join(" ");

        case "title":
        case "spaced":
            return words
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

        default:
            return "undefined outputType > " + outputType;
    }
};
