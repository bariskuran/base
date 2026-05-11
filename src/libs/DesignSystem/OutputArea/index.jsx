import { Space } from "../../Space";
import { Typo } from "../../Typo";
import { Button } from "../../Button";
import styled from "styled-components";
import { Flex } from "../../Flex";

const ButtonArea = styled.div`
    position: absolute;
    right: 10rem;
    top: 10rem;
`;

const OutputArea = ({ outputs, path, onClose, setLocal }) => {
    const handleClose = () => {
        if (onClose) {
            onClose(path);
            return;
        }

        setLocal?.((s) => {
            s.outputs[path] = null;
        });
    };

    /* */
    if (path == null || outputs[path] == null) return null;
    return (
        <Flex.column full bgColor="foreground" color="background" padding={20}>
            <ButtonArea>
                <Button.closeIcon
                    onClick={() => {
                        handleClose();
                    }}
                />
            </ButtonArea>
            <Space size="m" />
            <Typo.span balance>Output</Typo.span>
            <Typo.code>{outputs[path]}</Typo.code>
        </Flex.column>
    );
};

export default OutputArea;
