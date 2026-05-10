import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { sortBy } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

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
                    <Flex.column gap={10} padding={10}>
                        <Button.string
                            label="Run sort with sortBy.asc"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(
                                        ["10px", "2px", "1px"].sort(sortBy.asc),
                                    );
                                })
                            }
                        />
                        <Button.string
                            label="Run sort with sortBy.desc"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(["a", "c", "b"].sort(sortBy.desc));
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.code>{output}</Typo.code>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args={["sortBy.asc(a, b);", "sortBy.desc(a, b);"]}
                returns="Comparator return value (−1, 0, 1 style) for Array.sort."
                props={{
                    asc: {
                        description: "Ascending natural-order comparator (a, b).",
                        type: "function",
                        required: true,
                    },
                    desc: {
                        description: "Descending natural-order comparator (a, b).",
                        type: "function",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
