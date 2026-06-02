import styled from "styled-components";

const S = {
    container: styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10rem;
    `,
};

export const BaseForm = ({ StyledContainer, children }) => {
    const SelectedContainer = StyledContainer || S.container;

    /* Return */
    return <SelectedContainer>{children}</SelectedContainer>;
};
