import { Typo } from "../../Typo";
import { Button } from "../../Button";
import styled from "styled-components";
import { Flex } from "../../Flex";
import { useMemo } from "react";
import { copyToClipboard } from "../../copyToClipboard";
import { coerceToCodeText } from "../formatJsonForDisplay";

const ButtonArea = styled.div`
    position: absolute;
    right: 10rem;
    top: 10rem;
    z-index: 2;
`;

const OutputCodeBlock = styled.div`
    min-width: 0;
    max-width: 100%;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;

    pre {
        margin: 0;
        max-width: 100%;
        white-space: pre-wrap !important;
        overflow-wrap: anywhere;
        word-break: break-word;
    }
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
    const gateDirectValue = directValue !== undefined && path != null;
    const isOpen = gateDirectValue ? pathValue != null : true;

    const [outputValue, stringFn] = useMemo(() => {
        if (directValue !== undefined) {
            if (!isOpen) return [null, ""];

            const value = directValue;
            if (value == null) return [null, ""];

            if (typeof value === "string") return [coerceToCodeText(value), ""];
            return [coerceToCodeText(value), ""];
        }

        const value = pathValue;
        if (value == null) return [null, ""];

        if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            typeof value.fn === "string" &&
            Object.prototype.hasOwnProperty.call(value, "output")
        ) {
            const rawOut = value.output;
            const out = coerceToCodeText(rawOut);
            const f = typeof value.fn === "string" ? value.fn : "";
            return [out, f];
        }

        if (typeof value === "string") return [coerceToCodeText(value), ""];
        return [coerceToCodeText(value), ""];
    }, [directValue, pathValue, isOpen]);

    if ((outputValue == null || outputValue === "") && (!stringFn || stringFn === "")) return null;
    const codeBlockProps = {
        codeFormat: true,
        codeFormatJsxProps: false,
        full: true,
        disableMaxWidthLock: true,
        whiteSpace: "pre-wrap",
        width: "100%",
        margin: 0,
        padding: 0,
    };

    return (
        <Flex.column
            full
            minWidth={0}
            bgColor="foreground"
            color="background"
            padding={20}
            userSelect="none"
        >
            <ButtonArea>
                {stringFn ? (
                    <Button
                        icon={{ icon: "copy", width: 14 }}
                        onClick={() => {
                            copyToClipboard(stringFn);
                        }}
                    />
                ) : null}
                <Button icon={{ icon: "close", width: 12 }} onClick={handleClose} />
            </ButtonArea>
            {stringFn && !disableFnString ? (
                <Flex.column full minWidth={0} gap={6}>
                    <Typo.bold balance underline>
                        fn
                    </Typo.bold>
                    <OutputCodeBlock>
                        <Typo.code content={stringFn} {...codeBlockProps} codeFormatCalls />
                    </OutputCodeBlock>
                </Flex.column>
            ) : null}
            <Flex.column
                full
                minWidth={0}
                gap={6}
                marginTop={stringFn && !disableFnString ? 12 : 0}
            >
                <Typo.bold balance underline>
                    {label}
                </Typo.bold>
                <OutputCodeBlock>
                    <Typo.code
                        content={outputValue ?? ""}
                        {...codeBlockProps}
                        codeFormatCalls={false}
                    />
                </OutputCodeBlock>
            </Flex.column>
        </Flex.column>
    );
};

export default OutputArea;
