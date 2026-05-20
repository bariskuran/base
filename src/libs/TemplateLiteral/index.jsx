import { useMemo } from "react";
import { Typo } from "../Typo";
import templateLiteralTo from "../templateLiteralTo";

const TemplateLiteralBase = ({ variant = "p", children, ...typoProps }) => {
    const text =
        typeof children === "string"
            ? children
            : children != null
              ? String(children)
              : "";

    const result = useMemo(() => {
        if (variant === "pre") return templateLiteralTo.pre(text);
        if (variant === "span") return templateLiteralTo.span(text);
        return templateLiteralTo.p(text);
    }, [text, variant]);

    if (variant === "pre") {
        return (
            <Typo.pre whiteSpace="pre-wrap" {...typoProps}>
                {result}
            </Typo.pre>
        );
    }

    return <Typo as="div" {...typoProps}>{result}</Typo>;
};

const TemplateLiteral = (props) => <TemplateLiteralBase variant="p" {...props} />;

TemplateLiteral.pre = (props) => <TemplateLiteralBase variant="pre" {...props} />;
TemplateLiteral.p = (props) => <TemplateLiteralBase variant="p" {...props} />;
TemplateLiteral.span = (props) => <TemplateLiteralBase variant="span" {...props} />;

export { TemplateLiteral };
export default TemplateLiteral;
