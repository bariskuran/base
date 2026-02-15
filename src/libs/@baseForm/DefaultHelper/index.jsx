import styled from "styled-components";
import { baseStore } from "../../@baseStore";
import { Icon } from "../../@Icon";

const S = {
    container: styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        background-color: ${({ theme }) => theme.colorAlpha(theme.foreground, 0.1)};
        transition: all 0.3s ease;

        &:hover {
            background-color: ${({ theme }) => theme.colorAlpha(theme.foreground, 0.2)};
        }
    `,
    titleArea: styled.div`
        position: relative;
        display: flex;
        gap: 5rem;
        flex: 0 0 250rem;
    `,
    contentArea: styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10rem;
    `,
    actionArea: styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10rem;
        background: blue;
    `,
};

export const DefaultHelper = ({ children, storeFile, name }) => {
    const { field, set } = baseStore.use(storeFile, (s) => [s.fields[name]]);
    const { label, labelIcon, labelIconWidth, description } = field || {};

    /* Return */
    return (
        <S.container aria-label={"Helper for " + name}>
            <S.titleArea>
                {labelIcon && <Icon icon={labelIcon} width={labelIconWidth} />}
                {label}
                {description && (
                    <Icon
                        icon="information"
                        width={labelIconWidth}
                        enableTooltip={true}
                        tooltipProps={{ title: description }}
                    />
                )}
            </S.titleArea>
            <S.contentArea>{children}</S.contentArea>
            <S.actionArea>actions</S.actionArea>
        </S.container>
    );
};
