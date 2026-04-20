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
        <S.container>
            <S.titleArea>
                <Typo.h4 selfAlign="right">{title}</Typo.h4>
                {enableAjax && (
                    <S.ajaxArea>
                        <>
                            <Button.string
                                label="Example"
                                onClick={() =>
                                    setLocal((s) => {
                                        s.ajax = 0;
                                    })
                                }
                                activeManually={ajax === 0}
                            />
                            <Button.string
                                label="Code"
                                onClick={() =>
                                    setLocal((s) => {
                                        s.ajax = 1;
                                    })
                                }
                                activeManually={ajax === 1}
                            />
                        </>
                    </S.ajaxArea>
                )}
            </S.titleArea>
            <S.line $lastBlock={lastBlock} />
            <Flex.column>
                {(example || description) && ajax === 0 && (
                    <S.contentArea>
                        <div>{example}</div>
                        <div>{description}</div>
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
