import { Typo } from "../../Typo";
import { Flex } from "../../Flex";
import S from "./_styled";
import { isJsxDescription } from "../isJsxDescription";

const Page = ({ children, title, releasedOn, description }) => {
    /* */
    return (
        <Flex.column full>
            <Flex.row alignItems="stretch" full>
                <Flex.column width="max-content" alignSelf="stretch">
                    <S.title>{title}</S.title>
                    <Flex.row full>
                        <S.row1 />
                        <S.row2 />
                    </Flex.row>
                </Flex.column>
                <S.headerContent>
                    {releasedOn && <Typo.span balance>(Relased On: {releasedOn})</Typo.span>}
                    {description && (
                        <Typo as={isJsxDescription(description) ? "div" : "pre"} balance>
                            {description}
                        </Typo>
                    )}
                </S.headerContent>
            </Flex.row>
            {children}
        </Flex.column>
    );
};
export default Page;
