import { describe, it, expect } from "vitest";
import { stringCaseConverter } from "./index";

describe("stringCaseConverter", () => {
    it("returns empty string for falsy input", () => {
        expect(stringCaseConverter("")).toBe("");
        expect(stringCaseConverter(null)).toBe("");
        expect(stringCaseConverter(undefined)).toBe("");
        expect(stringCaseConverter(0)).toBe("");
        expect(stringCaseConverter(false)).toBe("");
    });

    it("auto-detects camel and converts to kebab", () => {
        expect(stringCaseConverter("helloWorld", "kebab")).toBe("hello-world");
    });

    it("auto-detects pascal and converts to snake", () => {
        expect(stringCaseConverter("HelloWorld", "snake")).toBe("hello_world");
    });

    it("auto-detects kebab and converts to camel", () => {
        expect(stringCaseConverter("hello-world", "camel")).toBe("helloWorld");
    });

    it("auto-detects snake and converts to pascal", () => {
        expect(stringCaseConverter("hello_world", "pascal")).toBe("HelloWorld");
    });

    it("auto-detects constant and converts to sentence", () => {
        expect(stringCaseConverter("HELLO_WORLD", "sentence")).toBe("Hello world");
    });

    it("auto-detects dot and converts to title", () => {
        expect(stringCaseConverter("hello.world", "title")).toBe("Hello World");
    });

    it("auto-detects path and converts to title", () => {
        expect(stringCaseConverter("hello/world", "title")).toBe("Hello World");
    });

    it("auto-detects lower and converts to camel", () => {
        expect(stringCaseConverter("hello world", "camel")).toBe("helloWorld");
    });

    it("auto-detects sentence and converts to kebab", () => {
        expect(stringCaseConverter("Hello world", "kebab")).toBe("hello-world");
    });

    it("auto-detects title and converts to constant", () => {
        expect(stringCaseConverter("Hello World", "constant")).toBe("HELLO_WORLD");
    });

    it("supports explicit input to skip auto-detection", () => {
        expect(stringCaseConverter("my-value", "pascal", "kebab")).toBe("MyValue");
        expect(stringCaseConverter("MyValue", "kebab", "pascal")).toBe("my-value");
        expect(stringCaseConverter("HELLO_WORLD", "kebab", "constant")).toBe("hello-world");
    });

    it("returns an informative message for unknown output", () => {
        expect(stringCaseConverter("helloWorld", "nope")).toBe("undefined output > nope");
    });

    it("handles extra whitespace consistently", () => {
        expect(stringCaseConverter("  hello   world  ", "kebab", "lower")).toBe("hello-world");
        expect(stringCaseConverter("  Hello   World  ", "snake", "title")).toBe("hello_world");
    });

    it("treats title and spaced outputs the same", () => {
        expect(stringCaseConverter("hello-world", "title")).toBe("Hello World");
        expect(stringCaseConverter("hello-world", "spaced")).toBe("Hello World");
    });

    it("keeps acronyms best-effort and still produces valid outputs", () => {
        expect(stringCaseConverter("myURLValue", "kebab")).toBe("my-u-r-l-value");
        expect(stringCaseConverter("myURLValue", "snake")).toBe("my_u_r_l_value");
    });

    it("handles numbers inside strings", () => {
        expect(stringCaseConverter("hello2World", "kebab")).toBe("hello2-world");
        expect(stringCaseConverter("hello-2-world", "camel")).toBe("hello2World");
    });

    it("handles single-word conversions", () => {
        expect(stringCaseConverter("hello", "pascal")).toBe("Hello");
        expect(stringCaseConverter("Hello", "camel", "sentence")).toBe("hello");
        expect(stringCaseConverter("HELLO", "lower", "constant")).toBe("hello");
    });
});
