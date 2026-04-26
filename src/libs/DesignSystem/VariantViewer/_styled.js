import styled from "styled-components";

const S = {
    container: styled.div`
        width: 100%;
        display: flex;
        gap: 10rem;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;

        & > div {
            width: max-content;

            & > div[data-slot="title"] {
                margin-bottom: 10rem;
                cursor: pointer;
            }
        }
    `,
};
export default S;
