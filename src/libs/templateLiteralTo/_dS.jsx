import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import templateLiteralTo from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const sample = `        First paragraph stays readable in source
        even with leading tabs in the template literal.

        Second paragraph is separated by a blank line
        or by dedented single newlines.`;

const X = () => (
    <Ds.page
        title="templateLiteralTo()"
        releasedOn="1.0.0"
        description={templateLiteralTo.p(`Strips shared indentation from template literals so you can
            align strings in source without affecting output.

            Use .pre for code-style text, .p for page descriptions, and .span for inline stacks.`)}
    >
        <Ds.block
            title=".pre"
            description="Returns a dedented string (same logic as CodeViewer / Typo.code)."
            code={`import { templateLiteralTo } from "${SYS.basePath}";

                    const code = templateLiteralTo.pre(\`
                        const x = 1;
                        const y = 2;
                    \`);`}
            example={
                <Typo.pre whiteSpace="pre-wrap">
                    {templateLiteralTo.pre(`
                        const x = 1;
                        const y = 2;
                    `)}
                </Typo.pre>
            }
        />

        <Ds.block
            title=".p"
            description="Dedents and wraps each paragraph in Typo.p nodes. Used by Ds.page and Ds.block descriptions."
            code={`import { templateLiteralTo } from "${SYS.basePath}";

                    <Typo as="div">{templateLiteralTo.p(description)}</Typo>`}
            example={<Typo as="div">{templateLiteralTo.p(sample)}</Typo>}
        />

        <Ds.block
            title=".span"
            description="Dedents and renders each paragraph as Typo.span inside a vertical Flex stack."
            code={`import { templateLiteralTo } from "${SYS.basePath}";

                    {templateLiteralTo.span(sample)}`}
            example={templateLiteralTo.span(sample)}
        />

        <Ds.api
            args="const result = templateLiteralTo(text, mode);"
            props={{
                text: { description: "Template literal string (or any string).", type: "string" },
                mode: {
                    description: 'Optional shorthand: "pre" | "p" | "span".',
                    type: "string",
                    defaultValue: '"pre"',
                },
            }}
            returnProps={{
                result: {
                    description: 'Dedented string for "pre", or React nodes for "p" / "span".',
                    type: "string | ReactNode",
                },
            }}
        />
    </Ds.page>
);

export default X;
