import { Outlet } from "react-router-dom";
import { styled } from "styled-components";

const S = {
    Container: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 100rem;
        box-sizing: border-box;
    `,
};

export const DesignSystemLayout = () => (
    <S.Container>
        <Outlet />
    </S.Container>
);
