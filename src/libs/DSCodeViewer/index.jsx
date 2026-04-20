import S from "./_styled";
import { Button } from "../Button";
import { copyToClipboard } from "../copyToClipboard";

export const DSCodeViewer = ({
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
    const content = code ?? children ?? "";

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
            <code>{content}</code>
            <S.buttonArea>
                <Button
                    onClick={() => {
                        copyToClipboard(content, { addToNotifier: true });
                    }}
                    bgColor="greys.shade15"
                    prefix={{
                        icon: "copy",
                        width: 16,
                        color: "greys.shade20",
                        onHoverColor: "greys.shade40",
                        onActiveIcon: "check",
                    }}
                    popTip="Copy to clipboard"
                />
            </S.buttonArea>
        </S.container>
    );
};
