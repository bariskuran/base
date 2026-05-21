import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { sortBy } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="sortBy"
            releasedOn="1.0.0"
            description="Natural asc/desc comparator helpers."
        >
            <Ds.block
                title="Natural sorting"
                code={`import { sortBy } from "${SYS.basePath}";

                        ["10px", "2px", "1px"].sort(sortBy.asc);

                        ["a", "c", "b"].sort(sortBy.desc);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label='["10px","2px","1px"].sort(sortBy.asc)'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => ["10px", "2px", "1px"].sort(sortBy.asc),
                                })}
                            />
                            <Button.plain
                                label='["a","c","b"].sort(sortBy.desc)'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => ["a", "c", "b"].sort(sortBy.desc),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                title="asc"
                disableLastBlock
                args="const cmp = sortBy.asc(a, b);"
                props={{
                    a: {
                        description: "First value.",
                        type: "any",
                        required: true,
                    },
                    b: {
                        description: "Second value.",
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    cmp: {
                        description: "Comparator result for Array.sort (−1, 0, or 1 style).",
                        type: "number",
                    },
                }}
            />
            <Ds.api
                title="desc"
                args="const cmp = sortBy.desc(a, b);"
                props={{
                    a: {
                        description: "First value.",
                        type: "any",
                        required: true,
                    },
                    b: {
                        description: "Second value.",
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    cmp: {
                        description: "Comparator result for Array.sort (−1, 0, or 1 style).",
                        type: "number",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
