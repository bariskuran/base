import { styled, t } from "base";

const S = {
    suspenseContainer: styled.div`
        width: 100%;
        min-height: 100vh;
        background: black;
        color: white;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
    `,
};

export const SuspenceFallback = () => <S.suspenseContainer>{t("loading")}</S.suspenseContainer>;
