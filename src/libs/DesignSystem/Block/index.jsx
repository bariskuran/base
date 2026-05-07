import S from "./_styled";
import { Typo } from "../../Typo";
import { baseStore } from "../../@baseStore";
import { Button } from "../../Button";
import { Flex } from "../../Flex";
import CodeViewer from "../CodeViewer";

const Block = ({ title, description, code, example, lastBlock }) => {
    const { ajax, setLocal } = baseStore.useLocal({
        ajax: 0,
    });

    const enableAjax = !!code && !!(example || description);

    /* RETURN */
    return (
        <S.container $lastBlock={lastBlock}>
            <S.titleArea>
                <Typo.h6 selfAlign="right" margin="0 0 10rem 0" fitContent balance>
                    {title}
                </Typo.h6>
                {enableAjax && (
                    <S.ajaxArea>
                        <Button.underline
                            onClick={() =>
                                setLocal((s) => {
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
                                setLocal((s) => {
                                    s.ajax = 1;
                                })
                            }
                            activeManually={ajax === 1}
                        />
                    </S.ajaxArea>
                )}
            </S.titleArea>
            <S.line $lastBlock={lastBlock} />
            <Flex.column justify="start" full>
                {(example || description) && ajax === 0 && (
                    <S.contentArea area-title="Block Content">
                        <Typo.span whiteSpace="pre-line" balance>
                            {description}
                        </Typo.span>
                        <Flex.row justify="start">{example}</Flex.row>
                    </S.contentArea>
                )}
                {((code && ajax === 1) || (!example && !description && code)) && (
                    <S.contentArea area-title="Block Content">
                        <CodeViewer>{code}</CodeViewer>
                    </S.contentArea>
                )}
            </Flex.column>
        </S.container>
    );
};
export default Block;
