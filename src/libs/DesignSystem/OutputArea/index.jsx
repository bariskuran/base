import { Space } from "../../Space";
import { Typo } from "../../Typo";
import { Button } from "../../Button";
import styled from "styled-components";
import { Flex } from "../../Flex";
import { useMemo } from "react";

const ButtonArea = styled.div`
    position: absolute;
    right: 10rem;
    top: 10rem;
`;

const OutputArea = ({ outputs, path, onClose, setLocal, directValue, label = "Output" }) => {
    const handleClose = () => {
        if (onClose) {
            onClose(path);
            return;
        }

        setLocal?.((s) => {
            s.outputs[path] = null;
        });
    };

    const pathValue = outputs?.[path];
    const outputValue = useMemo(() => {
        const value = directValue ?? pathValue;
        if (value == null) return null;

        if (typeof value === "string") return value;
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value);
    }, [directValue, pathValue]);

    /* */
    if (outputValue == null || outputValue === "") return null;
    return (
        <Flex.column full bgColor="foreground" color="background" padding={20}>
            {!directValue && (
                <ButtonArea>
                    <Button.closeIcon
                        onClick={() => {
                            handleClose();
                        }}
                    />
                </ButtonArea>
            )}
            <Space size="m" />
            <Typo.span balance>{label}</Typo.span>
            <Typo.code>{outputValue}</Typo.code>
        </Flex.column>
    );
};

export default OutputArea;
