import { Typo } from "../../Typo";
import S from "./_styled";

const CodeViewer = ({
    code,
    children,
    tabSize = 4,
    padding = 12,
    radius = 12,
    bg,
    color,
    maxHeight,
    wrap = false,
    formatJsxProps = true,
    ...rest
}) => {
    const rawContent = code ?? (typeof children === "string" ? children : "");
    if (!rawContent) return null;

    return (
        <S.shell $tabSize={tabSize} $radius={radius} $bg={bg} $color={color} $maxHeight={maxHeight}>
            <Typo.code
                copy
                content={rawContent}
                codeFormat
                codeFormatJsxProps={formatJsxProps}
                codeFormatCalls
                padding={padding}
                color={color}
                full
                disableMaxWidthLock
                whiteSpace={wrap ? "pre-wrap" : "pre"}
                {...rest}
            />
        </S.shell>
    );
};

export default CodeViewer;
