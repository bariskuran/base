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
            {}
            <Flex bgColor="#eee">
                <Item>A</Item>
                <Item>B</Item>
            </Flex>

            {}
            <Flex direction="row" gap={5} bgColor="#f5f5f5" padding={5}>
                <Item>Row 1</Item>
                <Item>Row 2</Item>
                <Item>Row 3</Item>
            </Flex>

            {}
            <Flex direction="column" gap={2} bgColor="#ff0000" padding={2}>
                <Item>Column 1</Item>
                <Item>Column 2</Item>
                <Item>Column 3</Item>
            </Flex>

            {}
            <Flex
                direction="row"
                height={20}
                bgColor="#ddd"
                padding={2}
                gap={2}
                childrenCommon={{
                    align: "center",
                }}
            >
                <Item>Right</Item>
                <Item>Bottom</Item>
            </Flex>

            {}
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

            {}
            <Flex bgColor="#ececec" padding="10 20 30 40" gap={1}>
                <Item>padding 1 2 3 4</Item>
                <Item>test</Item>
            </Flex>

            {}
            <Flex bgColor="#ececec" padding="1 1 1 1" paddingLeft={50} gap={1}>
                <Item>paddingLeft override</Item>
                <Item>test</Item>
            </Flex>

            {}
            <Flex bgColor="#ececec" margin="20 30" padding={2} gap={1}>
                <Item>margin 2 3</Item>
                <Item>test</Item>
            </Flex>

            {}
            <Flex bgColor="primary" borderRadius={2} padding={2} gap={1}>
                <Item>bgColor primary</Item>
                <Item>auto color test</Item>
            </Flex>

            {}
            <Flex bgColor="primary" color="black" borderRadius={2} padding={2} gap={1}>
                <Item>bgColor primary</Item>
                <Item>color black override</Item>
            </Flex>

            {}
            <Flex direction="row" yAlign="normal" height={100} bgColor="#fdd" padding={2} gap={2}>
                <Item>Normal</Item>
                <Flex alignSelf="top" bgColor="#faa" padding={1}>
                    AlignSelf test
                </Flex>
                <Item>Normal</Item>
            </Flex>

            {}
            <Flex
                gap={2}
                childrenProps={[
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

            {}
            <Flex
                childrenProps={[
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

            {}
            <Flex
                direction="row"
                gap={5}
                padding={2}
                bgColor="#efefef"
                childrenProps={[
                    {
                        width: 20,
                        bgColor: "#ffd6d6",
                        direction: "column",
                        gap: 10,
                        childrenProps: [
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

            {}
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

            {}
            <Flex
                gap={2}
                padding={2}
                bgColor="#efefef"
                childrenProps={[{ width: 10, bgColor: "#ffd6d6" }, { bgColor: "#d6ffd6" }]}
                responsive={{
                    phone: {
                        direction: "column",
                        childrenProps: [
                            { full: true, bgColor: "#ffcccc" },
                            { full: true, bgColor: "#ccffcc" },
                        ],
                    },
                }}
            >
                <div>Responsive child 1</div>
                <div>Responsive child 2</div>
            </Flex>

            {}
            <Flex gap={0} padding={2} bgColor="#efefef">
                <Item>gap 0</Item>
                <Item>gap 0</Item>
            </Flex>

            {}
            <Flex
                direction="x"
                gap={2}
                padding={2}
                bgColor="#efefef"
                childrenCommon={{ bgColor: "red" }}
            >
                <Item>x alias</Item>
                <Item>x alias</Item>
            </Flex>

            <Flex.xLeftTop bgColor="#00ff00" height={100} content="x" />
            <Flex.xRightBottom bgColor="#00f" height={100} content="x" />
        </>
    );
};
