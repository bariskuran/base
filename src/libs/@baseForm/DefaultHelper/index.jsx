import styled, { css } from "styled-components";
import { Icon } from "../../@Icon";

const S = {
    container: styled.div`
        width: 100%;
        position: relative;
        display: flex;
        /* background-color: ${({ theme, $isMainItem }) =>
            $isMainItem ? theme.colorAlpha(theme.foreground, 0.05) : "transparent"}; */
        transition: all 0.3s ease;
        border-radius: 5rem;

        /* &:hover {
            background-color: ${({ theme, $isMainItem }) =>
            $isMainItem ? theme.colorAlpha(theme.foreground, 0.1) : "transparent"};
        } */

        ${({ theme, $isMainItem, $isFocused }) => {
            const bg1 = $isMainItem ? theme.colorAlpha(theme.foreground, 0.05) : "transparent";
            const bg2 = $isMainItem ? theme.colorAlpha(theme.foreground, 0.1) : "transparent";

            return css`
                background-color: ${$isFocused ? bg2 : bg1};

                &:hover {
                    background-color: ${bg2};
                }
            `;
        }}

        ${({ $disable }) =>
            $disable &&
            css`
                opacity: 0.5;
                pointer-events: none;
            `}

        ${({ $hidden }) =>
            $hidden &&
            css`
                display: none;
            `}
    `,
    titleArea: styled.div`
        position: relative;
        display: flex;
        gap: 5rem;
        flex: 0 0 250rem;
        padding: 20rem;
    `,
    contentArea: styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        gap: 10rem;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        ${(p) =>
            p.$flexColumn &&
            css`
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
            `}
    `,
    actionArea: styled.div`
        width: 100rem;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10rem;
    `,
};

export const DefaultHelper = ({ children, ...props }) => {
    const {
        // storeFile,
        flexColumn,
        label,
        labelIcon,
        labelIconWidth,
        name,
        description,
        shouldUseHelper,
        field,
        disabled,
        hidden,
        isFocused,
        // isBlured,
        handleOnMouseEnter,
        handleOnMouseLeave,
    } = props || {};
    const { isMainItem } = field || {};

    /* Return */
    return (
        <S.container
            aria-label={`BaseFormItem_${name}`}
            $isMainItem={isMainItem}
            $disable={disabled}
            $hidden={hidden}
            $isFocused={isFocused}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            {shouldUseHelper && (
                <S.titleArea aria-label="Title Area">
                    {labelIcon && <Icon icon={labelIcon} width={labelIconWidth} />}
                    {label}
                    {description && (
                        <Icon
                            icon="information"
                            width={labelIconWidth}
                            enablePopTip={true}
                            tooltipProps={{ title: description }}
                        />
                    )}
                </S.titleArea>
            )}
            <S.contentArea aria-label="Content Area" $flexColumn={flexColumn}>
                {children}
            </S.contentArea>
            {shouldUseHelper && <S.actionArea aria-label="Action Area">actions</S.actionArea>}
        </S.container>
    );
};
