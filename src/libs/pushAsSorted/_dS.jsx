import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { pushAsSorted } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="pushAsSorted()"
            releasedOn="1.0.0"
            description="Pushes an element into a copy of the array, sorts it, and returns the sorted result with neighbor info."
        >
            <Ds.block
                title="Basic usage"
                code={`import { pushAsSorted } from "${SYS.basePath}";

                        const { result, pushedIndex, lowerValue, higherValue } = pushAsSorted([5, 1, 3], 4);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="pushAsSorted([5, 1, 3], 4)"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "basic",
                                    fn: () => pushAsSorted([5, 1, 3], 4),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="unique"
                description="Does not push el when it already exists in arr. Existing duplicates in arr are left unchanged."
                code="pushAsSorted([1, 2, 2, 3], 2, { unique: true });"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label="unique: skip existing 2"
                            {...outputButtonProps({
                                path: "unique",
                                activeLabel: "unique",
                                fn: () => pushAsSorted([1, 2, 2, 3], 2, { unique: true }),
                            })}
                        />
                        <Output path="unique" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="removeDuplicates"
                description="Removes duplicate values from the sorted result."
                code="pushAsSorted([1, 2, 2, 3], 2, { removeDuplicates: true });"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label="removeDuplicates"
                            {...outputButtonProps({
                                path: "removeDuplicates",
                                activeLabel: "removeDuplicates",
                                fn: () => pushAsSorted([1, 2, 2, 3], 2, { removeDuplicates: true }),
                            })}
                        />
                        <Output path="removeDuplicates" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="direction"
                description='Descending via "desc". Also "descending", "Z-A", "z-a" are aliases.'
                code={`pushAsSorted([5, 1, 3], 4, { direction: "Z-A" });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label='direction: "desc"'
                                {...outputButtonProps({
                                    path: "directionDesc",
                                    activeLabel: "Z-A",
                                    fn: () => pushAsSorted([5, 1, 3], 4, { direction: "desc" }),
                                })}
                            />
                        </Flex>
                        <Output path="directionDesc" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="String sorting"
                description='Descending via "desc". Also "descending", "Z-A", "z-a" are aliases.'
                code={`pushAsSorted([5, 1, 3], 4, { direction: "Z-A" });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="string sorting"
                                {...outputButtonProps({
                                    path: "ex1",
                                    activeLabel: "Z-A",
                                    fn: () => pushAsSorted(["c", "z", "a"], "b"),
                                })}
                            />
                        </Flex>
                        <Output path="ex1" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="pushAsSorted(arr, el, { unique, removeDuplicates, direction })"
                returns="Object with sorted result, insert index, and neighbor values."
                props={{
                    arr: {
                        description: "Input array.",
                        type: "any[]",
                    },
                    el: {
                        description: "Element to push.",
                        type: "any",
                    },
                    settings: {
                        description: "Optional behavior flags.",
                        type: "object",
                    },
                    unique: {
                        description:
                            "When true, does not push el if it already exists in arr. Does not dedupe arr itself.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    removeDuplicates: {
                        description: "When true, removes duplicate values from the sorted result.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    direction: {
                        description:
                            'Sort direction. Desc: desc, descending, "Z-A". Asc: asc, ascending, "A-Z", "a-z", "z-a".',
                        type: "string",
                        defaultValue: "asc",
                    },
                }}
                returnProps={{
                    result: {
                        description: "Sorted array after push and optional dedupe.",
                        type: "any[]",
                    },
                    pushedIndex: {
                        description: "Index of el in result (first match if duplicates exist).",
                        type: "number",
                    },
                    lowerValue: {
                        description:
                            "First item of result (low end when ascending, high end when descending).",
                        type: "any",
                    },
                    higherValue: {
                        description:
                            "Last item of result (high end when ascending, low end when descending).",
                        type: "any",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
