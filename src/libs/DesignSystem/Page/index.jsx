import { Typo } from "../../Typo";
import { Flex } from "../../Flex";
import { isJsxDescription } from "../isJsxDescription";
import { templateLiteralTo } from "../../templateLiteralTo";

const Page = ({ children, title, releasedOn, description }) => {
    /* */
    return (
        <Flex.column full>
            <Flex.column full>
                <Flex full>
                    <Flex.column
                        minWidth={250}
                        alignItems="stretch"
                        justifyContent="stretch"
                        borderRight="1px solid greys.shade40"
                    >
                        <Flex.column flex="1 1 auto" yAlign="center" paddingRight={30}>
                            <Typo.h1 alignSelf="center" color="greys.shade40">
                                {title}
                            </Typo.h1>
                            {releasedOn && (
                                <Typo.span size={12} balance>
                                    (Relased On: {releasedOn})
                                </Typo.span>
                            )}
                        </Flex.column>
                        <Flex height={1} flex="0 0 1px" full>
                            <Flex flex="0 0 175rem" width={175} height={1} />
                            <Flex flex="1 1 auto" height={1} bgColor="greys.shade40" />
                        </Flex>
                    </Flex.column>
                    <Flex.column
                        flex="1 1 auto"
                        padding="0 15rem 0 30rem"
                        minHeight={100}
                        justify="center"
                        margin="50rem 0"
                    >
                        {description &&
                            (isJsxDescription(description) ? (
                                <Typo as="div">{description}</Typo>
                            ) : (
                                <Typo as="div">{templateLiteralTo.p(description)}</Typo>
                            ))}
                    </Flex.column>
                </Flex>
            </Flex.column>
            {children}
        </Flex.column>
    );
};
export default Page;
