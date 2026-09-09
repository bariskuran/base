import S from "./_styled";
import { Typo } from "../../Typo";
import { baseStore } from "../../baseStore";
import { Button } from "../../Button";
import { Flex } from "../../Flex";
import CodeViewer from "../CodeViewer";
import { isJsxDescription } from "../isJsxDescription";
import { templateLiteralTo } from "../../templateLiteralTo";
import { t } from "../../getText";

const Block = ({
    title,
    description,
    code,
    example,
    lastBlock,
    empty,
    extraTitlePaddingTop = 0,
}) => {
    const { ajax, set } = baseStore.useLocal({
        ajax: 0,
    });
    const displayTitle = t(title);
    const displayDescription = t(description);
    const descriptionIsJsx = isJsxDescription(displayDescription);

    const enableAjax = !empty && !!code && !!(example || displayDescription);

    if (empty) {
        return (
            <S.container $lastBlock={lastBlock} $empty>
                <S.titleArea $empty $extraTitlePaddingTop={extraTitlePaddingTop} aria-hidden />
                <S.line $empty $lastBlock={lastBlock} />
            </S.container>
        );
    }

    /* RETURN */
    return (
        <S.container $lastBlock={lastBlock}>
            <S.titleArea $extraTitlePaddingTop={extraTitlePaddingTop}>
                <Typo.h6 selfAlign="right" margin="0 0 10rem 0" fitContent balance>
                    {displayTitle}
                </Typo.h6>
                {enableAjax && (
                    <S.ajaxArea>
                        <Button.underline
                            onClick={() =>
                                set((s) => {
                                    s.ajax = 0;
                                })
                            }
                            activeManually={ajax === 0}
                            icon={{
                                icon: "search",
                                width: 14,
                                activeColor: "primary",
                                disablePulseEffect: true,
                            }}
                        />
                        <Button.underline
                            icon={{
                                icon: "code",
                                width: 14,
                                activeColor: "primary",
                                disablePulseEffect: true,
                            }}
                            onClick={() =>
                                set((s) => {
                                    s.ajax = 1;
                                })
                            }
                            activeManually={ajax === 1}
                        />
                    </S.ajaxArea>
                )}
            </S.titleArea>
            <S.line $lastBlock={lastBlock} />
            <S.mainColumn>
                <Flex.column full minWidth={0}>
                    {(example || displayDescription) && ajax === 0 && (
                        <S.contentArea area-title="Block Content">
                            {descriptionIsJsx ? (
                                <Typo as="div">{displayDescription}</Typo>
                            ) : (
                                <Typo as="div">{templateLiteralTo.p(displayDescription)}</Typo>
                            )}
                            {displayDescription && example && <S.line2 />}
                            <Flex.row full minWidth={0}>
                                {example}
                            </Flex.row>
                        </S.contentArea>
                    )}
                    {((code && ajax === 1) || (!example && !displayDescription && code)) && (
                        <S.contentArea area-title="Block Content">
                            <CodeViewer>{code}</CodeViewer>
                        </S.contentArea>
                    )}
                </Flex.column>
            </S.mainColumn>
        </S.container>
    );
};
export default Block;
