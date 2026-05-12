import { Typo } from "../../Typo";
import { Button } from "../../Button";
import styled from "styled-components";
import { Flex } from "../../Flex";
import { useMemo } from "react";
import { copyToClipboard } from "../../copyToClipboard";

const ButtonArea = styled.div`
    position: absolute;
    right: 10rem;
    top: 10rem;
`;

const OutputArea = ({
    outputs,
    path,
    onClose,
    setLocal,
    directValue,
    label = "Output",
    disableFnString = false,
}) => {
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
    const [outputValue, stringFn] = useMemo(() => {
        const value = directValue ?? pathValue;
        if (value == null) return [null, ""];

        if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            typeof value.fn === "string" &&
            Object.prototype.hasOwnProperty.call(value, "output")
        ) {
            const rawOut = value.output;
            const out =
                rawOut == null || rawOut === ""
                    ? null
                    : typeof rawOut === "string"
                      ? rawOut
                      : JSON.stringify(rawOut, null, 2);
            const f = typeof value.fn === "string" ? value.fn : "";
            return [out, f];
        }

        if (typeof value === "string") return [value, ""];
        return [JSON.stringify(value, null, 2), ""];
    }, [directValue, pathValue]);

    /* */
    if ((outputValue == null || outputValue === "") && (!stringFn || stringFn === "")) return null;
    return (
        <Flex.column full bgColor="foreground" color="background" padding={20} userSelect="none">
            {!directValue && (
                <ButtonArea>
                    <Button
                        icon={{ icon: "copy", width: 14 }}
                        onClick={() => {
                            copyToClipboard(stringFn);
                        }}
                    />
                    <Button icon={{ icon: "close", width: 12 }} onClick={handleClose} />
                </ButtonArea>
            )}
            {stringFn && !disableFnString ? (
                <>
                    <Typo.bold balance underline>
                        fn
                    </Typo.bold>
                    <Typo.code>{stringFn}</Typo.code>
                </>
            ) : null}
            <Typo.bold balance underline>
                {label}
            </Typo.bold>
            <Typo.code>{outputValue}</Typo.code>
        </Flex.column>
    );
};

export default OutputArea;
