import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { stringCaseConverter } from ".";
import { Typo } from "../Typo";

const kebab = stringCaseConverter("helloWorld", "kebab");
const constant = stringCaseConverter("hello world", "constant", "lower");

const X = () => (
    <Ds.page
        title="<stringCaseConverter>"
        releasedOn="1.0.0"
        description="Converts strings across case formats."
    >
        <Ds.block
            title="Case Conversion"
            code={`import { stringCaseConverter } from "${SYS.basePath}";

stringCaseConverter("helloWorld", "kebab");
stringCaseConverter("hello world", "constant", "lower");`}
            example={
                <>
                    <Typo.span children={`kebab: ${kebab}`} />
                    <Typo.span children={`constant: ${constant}`} />
                </>
            }
        />
        <Ds.api
            props={{
                string: {
                    description: "Input text.",
                    type: "string",
                    required: true,
                    defaultValue: '""',
                },
                output: {
                    description:
                        "Target format (camel, pascal, kebab, snake, constant, dot, path, lower, sentence, title, spaced).",
                    type: "string",
                    required: false,
                    defaultValue: '"camel"',
                },
                input: {
                    description: "Input format, or auto detection.",
                    type: "string",
                    required: false,
                    defaultValue: '"auto"',
                },
                return: {
                    description: "Converted string.",
                    type: "string",
                    required: true,
                    defaultValue: '""',
                },
            }}
        />
    </Ds.page>
);

export default X;
