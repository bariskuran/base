import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    & > div {
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        display: flex !important;
    }

    & > div > div {
        display: flex !important;
    }
`;
