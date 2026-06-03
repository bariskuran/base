import { Typo } from "../../Typo";
import { coerceToCodeText } from "../formatJsonForDisplay";
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
    wrap = true,
    formatJsxProps = true,
    ...rest
}) => {
    const rawContent = coerceToCodeText(code ?? children) ?? "";
    if (!rawContent) return null;

    return (
        <S.shell
            $tabSize={tabSize}
            $radius={radius}
            $bg={bg}
            $color={color}
            $maxHeight={maxHeight}
            $wrap={wrap}
        >
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
                {...rest}
            />
        </S.shell>
    );
};

export default CodeViewer;
