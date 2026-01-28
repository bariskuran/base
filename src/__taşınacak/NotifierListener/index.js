import { useMemo } from "react";
import { useBase } from "../useBase";
import { Notifier } from "../Notifier";
import { Wrapper } from "./Wrapper";
import styled, { css } from "styled-components";

const Styled = {
    container: styled.div`
        width: fit-content;
        position: absolute;
        z-index: 1001;
        display: flex;
        gap: 10rem;

        ${(p) =>
            p.$placement?.[0] === "top"
                ? css`
                      top: 10rem;
                      flex-direction: column;
                  `
                : css`
                      bottom: 10rem;
                      flex-direction: column-reverse;
                  `}

        ${(p) =>
            p.$placement?.[1] === "left"
                ? css`
                      left: 10rem;
                      align-items: flex-start;
                  `
                : p.$placement?.[1] === "right"
                  ? css`
                        right: 10rem;
                        align-items: flex-end;
                    `
                  : css`
                        left: 50%;
                        transform: translate(-50%);
                        margin: auto;
                        align-items: center;
                    `}
    `,
};

export const NotifierListener = () => {
    const [notifierQueue, clearAll, version, placement2 = "top-right"] = useBase((s) => [
        s.notifierQueue,
        s.clearNotifier,
        s.BASE_SETTINGS?.notifierManager?.version,
        s.BASE_SETTINGS?.notifierManager?.placement,
    ]);
    const placement = useMemo(() => placement2.split("-"), [placement2]);

    return (
        <Styled.container $placement={placement}>
            {(notifierQueue || []).map((it, i) => (
                <Wrapper key={i} index={i} placement={placement}>
                    <Notifier clearAll={clearAll} {...it} ver={it.ver || version} />
                </Wrapper>
            ))}
        </Styled.container>
    );
};
