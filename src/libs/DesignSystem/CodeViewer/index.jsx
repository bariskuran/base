import { useMemo } from "react";
import { Button } from "../../Button";
import { copyToClipboard } from "../../copyToClipboard";
import S from "./_styled";

const dedent = (text = "") => {
    const lines = String(text).replace(/\r\n/g, "\n").split("\n");
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

    const nonEmpty = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.trim() !== "")
        .map(({ line, index }) => ({
            index,
            indent: line.match(/^(\s*)/)?.[1].length ?? 0,
        }));

    if (nonEmpty.length === 0) return "";

    const [firstNonEmpty] = nonEmpty;
    const remaining = nonEmpty.slice(1);

    const baseIndent =
        firstNonEmpty?.indent === 0 && remaining.length > 0
            ? Math.min(...remaining.map((item) => item.indent))
            : Math.min(...nonEmpty.map((item) => item.indent));

    return lines
        .map((line) => {
            const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
            const trimCount = Math.min(baseIndent, indent);
            return line.slice(trimCount);
        })
        .join("\n");
};

const CodeViewer = ({
    code,
    children,
    as = "pre",
    tabSize = 4,
    padding = 12,
    radius = 12,
    bg,
    color,
    maxHeight,
    wrap = false,
    ...props
}) => {
    const rawContent = code ?? children ?? "";
    const normalizedContent = useMemo(() => dedent(rawContent), [rawContent]);

    return (
        <S.container
            as={as}
            $tabSize={tabSize}
            $padding={padding}
            $radius={radius}
            $bg={bg}
            $color={color}
            $maxHeight={maxHeight}
            $wrap={wrap}
            {...props}
        >
            <code>{normalizedContent}</code>
            <S.buttonArea>
                <Button
                    onClick={() => {
                        copyToClipboard(normalizedContent, { addToNotifier: true });
                    }}
                    bgColor="greys.shade15"
                    prefix={{
                        icon: "copy",
                        width: 16,
                        color: "greys.shade30",
                        onHoverColor: "greys.shade60",
                        onActiveIcon: "check",
                    }}
                    popTip="Copy to clipboard"
                />
            </S.buttonArea>
        </S.container>
    );
};
export default CodeViewer;
