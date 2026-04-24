import S from "./_styled";
import { Typo } from "../../Typography";
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
                <Typo.h5 selfAlign="right" margin="0 0 10rem 0" fitContent balance>
                    {title}
                </Typo.h5>
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
                                onActiveColor: "primary",
                            }}
                        />
                        <Button.underline
                            icon={{
                                icon: "code",
                                width: 14,
                                onActiveColor: "primary",
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
            <Flex.column justify="start">
                {(example || description) && ajax === 0 && (
                    <S.contentArea>
                        <div>{example}</div>
                        <Typo.span whiteSpace="pre-line" balance>
                            {description}
                        </Typo.span>
                    </S.contentArea>
                )}
                {((code && ajax === 1) || (!example && !description && code)) && (
                    <S.contentArea>
                        <CodeViewer>{code}</CodeViewer>
                    </S.contentArea>
                )}
            </Flex.column>
        </S.container>
    );
};
export default Block;
