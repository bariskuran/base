import { Flex } from "../";
const boxStyle = {
    border: "1px solid #999",
    minHeight: "40px",
};

const Item = ({ children }) => {
    return <div style={boxStyle}>{children}</div>;
};

export const FlexTestPage = () => {
    return (
        <>
            {/* 1 - default */}
            <Flex bgColor="#eee">
                <Item>A</Item>
                <Item>B</Item>
            </Flex>

            {/* 2 - basic row */}
            <Flex direction="row" gap={5} bgColor="#f5f5f5" padding={5}>
                <Item>Row 1</Item>
                <Item>Row 2</Item>
                <Item>Row 3</Item>
            </Flex>

            {/* 3 - basic column */}
            <Flex direction="column" gap={2} bgColor="#ff0000" padding={2}>
                <Item>Column 1</Item>
                <Item>Column 2</Item>
                <Item>Column 3</Item>
            </Flex>

            {/* 4 - xAlign / yAlign row */}
            <Flex
                direction="row"
                height={20}
                bgColor="#ddd"
                padding={2}
                gap={2}
                inCommonProps={{
                    align: "center",
                }}
            >
                <Item>Right</Item>
                <Item>Bottom</Item>
            </Flex>

            {/* 5 - xAlign / yAlign column */}
            <Flex
                direction="column"
                xAlign="right"
                yAlign="bottom"
                height={20}
                bgColor="#ddd"
                padding={2}
                gap={2}
            >
                <Item>Column Right</Item>
                <Item>Column Bottom</Item>
            </Flex>

            {/* 6 - padding shorthand */}
            <Flex bgColor="#ececec" padding="10 20 30 40" gap={1}>
                <Item>padding 1 2 3 4</Item>
                <Item>test</Item>
            </Flex>

            {/* 7 - padding + side override */}
            <Flex bgColor="#ececec" padding="1 1 1 1" paddingLeft={50} gap={1}>
                <Item>paddingLeft override</Item>
                <Item>test</Item>
            </Flex>

            {/* 8 - margin shorthand */}
            <Flex bgColor="#ececec" margin="20 30" padding={2} gap={1}>
                <Item>margin 2 3</Item>
                <Item>test</Item>
            </Flex>

            {/* 9 - borderRadius / color auto */}
            <Flex bgColor="primary" borderRadius={2} padding={2} gap={1}>
                <Item>bgColor primary</Item>
                <Item>auto color test</Item>
            </Flex>

            {/* 10 - custom color override */}
            <Flex bgColor="primary" color="black" borderRadius={2} padding={2} gap={1}>
                <Item>bgColor primary</Item>
                <Item>color black override</Item>
            </Flex>

            {/* 11 - alignSelf row */}
            <Flex direction="row" yAlign="normal" height={100} bgColor="#fdd" padding={2} gap={2}>
                <Item>Normal</Item>
                <Flex alignSelf="top" bgColor="#faa" padding={1}>
                    AlignSelf test
                </Flex>
                <Item>Normal</Item>
            </Flex>

            {/* 12 - inProps basic */}
            <Flex
                gap={2}
                inProps={[
                    {
                        width: 100,
                        bgColor: "#ff0000",
                    },
                    {
                        width: 0,
                        bgColor: "#00ff00",
                    },
                ]}
            >
                <div>Left fixed</div>
                <div>Right fluid?</div>
            </Flex>

            {/* 13 - inProps 3 child */}
            <Flex
                inProps={[
                    {
                        width: "20%",
                        bgColor: "#ff0000",
                    },
                    {
                        width: 0,
                        bgColor: "#00ff00",
                    },
                    {
                        width: 10,
                        bgColor: "#0000ff",
                    },
                ]}
            >
                <div>20%</div>
                <div>fluid</div>
                <div>10rem</div>
            </Flex>

            {/* 14 - nested inProps */}
            <Flex
                direction="row"
                gap={5}
                padding={2}
                bgColor="#efefef"
                inProps={[
                    {
                        width: 20,
                        bgColor: "#ffd6d6",
                        direction: "column",
                        gap: 10,
                        inProps: [
                            { bgColor: "#ff0000", padding: 10 },
                            { bgColor: "#00ff00", padding: 10 },
                        ],
                    },
                    {
                        width: 0,
                        bgColor: "#d6ffd6",
                    },
                ]}
            >
                <div>
                    <div>nested 1</div>
                    <div>nested 2</div>
                </div>
                <div>content area</div>
            </Flex>

            {/* 15 - responsive direction */}
            <Flex
                direction="row"
                gap={2}
                padding={2}
                bgColor="#ff0000"
                responsive={{
                    phone: { direction: "column", bgColor: "#00ff00" },
                }}
            >
                <Item>Responsive 1</Item>
                <Item>Responsive 2</Item>
            </Flex>

            {/* 16 - responsive inProps */}
            <Flex
                gap={2}
                padding={2}
                bgColor="#efefef"
                inProps={[{ width: 10, bgColor: "#ffd6d6" }, { bgColor: "#d6ffd6" }]}
                responsive={{
                    phone: {
                        direction: "column",
                        inProps: [
                            { width: "100%", bgColor: "#ffcccc" },
                            { width: "100%", bgColor: "#ccffcc" },
                        ],
                    },
                }}
            >
                <div>Responsive child 1</div>
                <div>Responsive child 2</div>
            </Flex>

            {/* 17 - zero gap */}
            <Flex gap={0} padding={2} bgColor="#efefef">
                <Item>gap 0</Item>
                <Item>gap 0</Item>
            </Flex>

            {/* 18 - x / y aliases */}
            <Flex
                direction="x"
                gap={2}
                padding={2}
                bgColor="#efefef"
                inCommonProps={{ bgColor: "red" }}
            >
                <Item>x alias</Item>
                <Item>x alias</Item>
            </Flex>

            <Flex.xLeftTop bgColor="#00ff00" height={100} content="x" />
            <Flex.xRightBottom bgColor="#00f" height={100} content="x" />
        </>
    );
};
