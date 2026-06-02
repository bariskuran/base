import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollTopLeft } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { ScrollFlex } from "../ScrollFlex";

const round = (n) => Math.round(Number(n) || 0);

const hudStyle = {
    boxShadow: "0 4rem 16rem rgba(0, 0, 0, 0.12)",
    borderRadius: 8,
    maxWidth: "min(96vw, 720px)",
};

const PageHud = ({ scrollTop, scrollLeft, directionX, directionY }) => (
    <Flex.column
        gap={8}
        padding="10rem 18rem"
        bgColor="greys.shade20"
        xAlign="center"
        yAlign="center"
        style={{
            ...hudStyle,
            position: "fixed",
            top: "20rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
        }}
    >
        <Typo.span>
            <b>Page scroll</b> — top: {round(scrollTop)} left: {round(scrollLeft)} | dirY:{" "}
            {directionY} dirX: {directionX}
        </Typo.span>
    </Flex.column>
);

const ContainerHud = ({ scrollTop, scrollLeft, directionX, directionY }) => (
    <Flex.column
        gap={6}
        padding="10rem 14rem"
        bgColor="greys.shade20"
        xAlign="center"
        yAlign="center"
        marginBottom={10}
        style={hudStyle}
    >
        <Typo.span>
            <b>ScrollFlex</b> — top: {round(scrollTop)} left: {round(scrollLeft)} | dirY:{" "}
            {directionY} dirX: {directionX}
        </Typo.span>
    </Flex.column>
);

const X = () => {
    const page = useScrollTopLeft({ delay: 80 });
    const container = useScrollTopLeft({ delay: 80 });

    return (
        <Ds.page
            title="useScrollTopLeft()"
            releasedOn="1.0.0"
            description="Tracks scroll top/left and direction on both axes. Attach ref to your content to auto-detect the scroll container, or pass source explicitly. Only the axis that actually moved updates its direction; unchanged axes stay none."
        >
            <PageHud {...page} />
            <Ds.block
                title="Page scroll — ref auto-detects window/body"
                code={`import { useScrollTopLeft } from "${SYS.basePath}";

                       const { scrollTop, scrollLeft, directionX, directionY, ref } = useScrollTopLeft({ delay: 80 });

                       return (
                       <Flex ref={ref} minHeight={5000}>
                        scroll the page
                       </Flex>
                       );`}
                example={
                    <Flex ref={page.ref} minHeight={5000}>
                        scroll the page vertically
                    </Flex>
                }
            />
            <Ds.block
                title="ScrollFlex — horizontal & vertical scroll"
                description="5000×5000px content inside ScrollFlex. ref resolves the ScrollFlex scroll host, so page scroll does not affect these values."
                code={`import { useScrollTopLeft } from "${SYS.basePath}";
                       import { ScrollFlex } from "${SYS.basePath}";

                       const { scrollTop, scrollLeft, directionX, directionY, ref } = useScrollTopLeft({ delay: 80 });

                       return (
                        <ScrollFlex width="100%" height={280}>
                            <Flex ref={ref} minWidth={5000} minHeight={5000}>
                                scroll inside the box
                            </Flex>
                        </ScrollFlex>
                       );`}
                example={
                    <Flex.column full gap={10}>
                        <ContainerHud {...container} />
                        <ScrollFlex width="100%" height={280}>
                            <Flex ref={container.ref} minWidth={5000} minHeight={5000} padding={20}>
                                scroll inside the box — horizontally and vertically
                            </Flex>
                        </ScrollFlex>
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { scrollTop, scrollLeft, directionX, directionY, manualTrigger, ref, source } = useScrollTopLeft({ delay, source });"
                props={{
                    source: {
                        description:
                            "Optional scroll target. When omitted, ref finds the nearest scrollable ancestor, then falls back to window.",
                        type: "Window | HTMLElement",
                    },
                    delay: {
                        description: "Throttle delay in milliseconds.",
                        type: "number",
                        defaultValue: "0",
                    },
                }}
            />
            <Ds.api
                args="scrollTop, scrollLeft, directionX, directionY"
                props={{
                    scrollTop: { description: "Current scroll top position.", type: "number" },
                    scrollLeft: { description: "Current scroll left position.", type: "number" },
                    directionX: {
                        description:
                            'Last horizontal scroll direction: "left", "right", or "none".',
                        type: "string",
                    },
                    directionY: {
                        description: 'Last vertical scroll direction: "top", "bottom", or "none".',
                        type: "string",
                    },
                }}
            />
            <Ds.api
                args="ref"
                props={{
                    ref: {
                        description:
                            "Callback ref to attach to your content root. Used to auto-detect the scroll container when source is not provided.",
                        type: "fn",
                    },
                }}
            />
            <Ds.api
                args="source"
                props={{
                    source: {
                        description: "Resolved scroll target currently being listened to.",
                        type: "Window | HTMLElement",
                    },
                }}
            />
            <Ds.api
                args="manualTrigger()"
                props={{
                    manualTrigger: {
                        description:
                            "Manually re-reads scroll position and updates direction state.",
                        type: "fn",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
