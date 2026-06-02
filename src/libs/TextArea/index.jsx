import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        width: 100%;
        display: flex;
        gap: 5rem;
    `,
    inputArea: styled.div`
        width: 100%;
    `,
    input: styled.input`
        width: 100%;
        background: transparent;
        border: none;
        padding: 5rem 10rem;
        border-bottom: 1px solid ${({ theme }) => theme.colorAlpha(theme.foreground, 0.3)};
    `,
    iconAreaContainer: styled.div`
        width: min-content;
        padding: 5rem;
    `,
};

export const textAreaDefault = "";
export const TextArea = ({
    value,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onPaste,
    prefix,
    suffix,







}) => {
    return (
        <S.container>
            {prefix && <PrefixSuffixArea {...prefix} />}
            <S.inputArea>
                <S.input
                    value={value ?? textAreaDefault}
                    onChange={(e) => onChange?.(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onPaste={onPaste}
                />
            </S.inputArea>
            {suffix && <PrefixSuffixArea {...suffix} />}
        </S.container>
    );
};

const PrefixSuffixArea = (props = {}) => {
    /* RETURN */
    return <S.iconAreaContainer>a</S.iconAreaContainer>;
};
