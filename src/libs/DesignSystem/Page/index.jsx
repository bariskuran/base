import { Typo } from "../../Typo";
import { Flex } from "../../Flex";
import S from "./_styled";

const Page = ({ children, title, releasedOn, description }) => {
    return (
        <Flex.column>
            <Flex.row alignItems="stretch">
                <Flex.column width="max-content" alignSelf="stretch">
                    <S.title>{title}</S.title>
                    <Flex.row>
                        <S.row1 />
                        <S.row2 />
                    </Flex.row>
                </Flex.column>
                <S.headerContent>
                    {releasedOn && <Typo.span balance>(Relased On: {releasedOn})</Typo.span>}
                    {description && (
                        <Typo.pre whiteSpace="pre-line" balance>
                            {description}
                        </Typo.pre>
                    )}
                </S.headerContent>
            </Flex.row>
            {children}
        </Flex.column>
    );
};
export default Page;
