import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { TemplateLiteral } from ".";
import templateLiteralTo from "../templateLiteralTo";

const sample = `        First paragraph stays readable in source
        even with leading tabs in the template literal.

        Second paragraph is separated by a blank line
        or by dedented single newlines.`;

const X = () => (
    <Ds.page
        title="<TemplateLiteral>"
        releasedOn="1.0.0"
        description={{
            tr: templateLiteralTo.p(`templateLiteralTo için React sarmalayıcısıdır. Template literal'ı
                children olarak verin; ortak girinti temizlenir ve çıktı Typo ile render edilir.

                Yardımcı fonksiyonla aynı modlar için .pre, .p veya .span kullanın.`),
            en: templateLiteralTo.p(`React wrapper around templateLiteralTo. Pass a template literal
                as children; shared indentation is stripped and output is rendered with Typo.

                Use .pre, .p, or .span for the same modes as the utility function.`),
        }}
    >
        <Ds.block
            title=".pre"
            description={{ tr: "Typo.pre içinde girintisi temizlenmiş string.", en: "Dedented string inside Typo.pre." }}
            code={`import { TemplateLiteral } from "${SYS.basePath}";

                    <TemplateLiteral.pre>{\`
                        const x = 1;
                    \`}</TemplateLiteral.pre>`}
            example={
                <TemplateLiteral.pre>{`
                    const x = 1;
                    const y = 2;
                `}</TemplateLiteral.pre>
            }
        />

        <Ds.block
            title=".p"
            description={{ tr: "Bir div içinde Typo.p node'ları olarak girintisi temizlenmiş paragraflar.", en: "Dedented paragraphs as Typo.p nodes inside a div." }}
            code={`import { TemplateLiteral } from "${SYS.basePath}";

                    <TemplateLiteral.p>{description}</TemplateLiteral.p>`}
            example={<TemplateLiteral.p>{sample}</TemplateLiteral.p>}
        />

        <Ds.block
            title=".span"
            description={{ tr: "Typo.span yığını olarak girintisi temizlenmiş paragraflar.", en: "Dedented paragraphs as Typo.span stack." }}
            code={`import { TemplateLiteral } from "${SYS.basePath}";

                    <TemplateLiteral.span>{text}</TemplateLiteral.span>`}
            example={<TemplateLiteral.span>{sample}</TemplateLiteral.span>}
        />

        <Ds.api
            args="<TemplateLiteral /> | .pre | .p | .span"
            props={{
                children: {
                    description: { tr: "Template literal string'i (veya string'e dönüştürülebilen herhangi bir değer).", en: "Template literal string (or any stringifiable value)." },
                    type: "string",
                },
            }}
        />
    </Ds.page>
);

export default X;
