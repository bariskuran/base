import { Typo } from "../Typography";
import { Space } from "../Space";
import S from "./_styled";
import { Flex } from "../Flex";

export const DSPageLayout = ({ children, title, releasedOn, description }) => {
    return (
        <Flex.column>
            <Flex.row>
                <Flex.column width="max-content">
                    <S.title>{title}</S.title>
                    <Flex.row>
                        <S.row1 />
                        <S.row2 />
                    </Flex.row>
                </Flex.column>
                <S.headerContent>
                    {releasedOn && (
                        <Typo.span disableMaxWidthLock>(Relased On: {releasedOn})</Typo.span>
                    )}
                    {description && <Typo.span disableMaxWidthLock>{description}</Typo.span>}
                </S.headerContent>
            </Flex.row>
            {children}
        </Flex.column>
    );
};
