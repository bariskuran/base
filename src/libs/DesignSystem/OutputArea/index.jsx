import { Typo } from "../../Typo";
import { Button } from "../../Button";
import styled from "styled-components";
import { Flex } from "../../Flex";
import { useMemo } from "react";
import { copyToClipboard } from "../../copyToClipboard";
import { formatJsonForDisplay } from "../formatJsonForDisplay";

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
    /** directValue + path: show only after output button opens this path (toggle). directValue alone: live panel. */
    const gateDirectValue = directValue !== undefined && path != null;
    const isOpen = gateDirectValue ? pathValue != null : true;

    const [outputValue, stringFn] = useMemo(() => {
        if (directValue !== undefined) {
            if (!isOpen) return [null, ""];

            const value = directValue;
            if (value == null) return [null, ""];

            if (typeof value === "string") return [value, ""];
            return [formatJsonForDisplay(value), ""];
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
            const out =
                rawOut == null || rawOut === ""
                    ? null
                    : typeof rawOut === "string"
                      ? rawOut
                      : formatJsonForDisplay(rawOut);
            const f = typeof value.fn === "string" ? value.fn : "";
            return [out, f];
        }

        if (typeof value === "string") return [value, ""];
        return [formatJsonForDisplay(value), ""];
    }, [directValue, pathValue, isOpen]);

    /* */
    if ((outputValue == null || outputValue === "") && (!stringFn || stringFn === "")) return null;
    return (
        <Flex.column full bgColor="foreground" color="background" padding={20} userSelect="none">
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
