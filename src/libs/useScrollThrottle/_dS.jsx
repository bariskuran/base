import { useEffect } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollThrottle } from ".";
import { attachScrollListener } from "../getScrollParent";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";
import { Flex } from "../Flex";
import { ScrollFlex } from "../ScrollFlex";

const hudStyle = {
    boxShadow: "0 4rem 16rem rgba(0, 0, 0, 0.12)",
    borderRadius: 8,
    maxWidth: "min(96vw, 720px)",
};

const PageHud = ({ throttledCount, rawCount }) => (
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
            <b>Page scroll</b> — throttled: {String(throttledCount)} | real: {String(rawCount)}
        </Typo.span>
    </Flex.column>
);

const ContainerHud = ({ throttledCount, rawCount }) => (
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
            <b>ScrollFlex</b> — throttled: {String(throttledCount)} | real: {String(rawCount)}
        </Typo.span>
    </Flex.column>
);

const useScrollThrottleDemo = () => {
    const { throttledCount, rawCount, set } = baseStore.useLocal({
        throttledCount: 0,
        rawCount: 0,
    });

    const { ref, source } = useScrollThrottle(
        () =>
            set((s) => {
                s.throttledCount += 1;
            }),
        120,
    );

    useEffect(() => {
        if (!source) return;

        return attachScrollListener(source, () =>
            set((s) => {
                s.rawCount += 1;
            }),
        );
    }, [source, set]);

    return { ref, throttledCount, rawCount };
};

const X = () => {
    const page = useScrollThrottleDemo();
    const container = useScrollThrottleDemo();

    return (
        <Ds.page
            title="useScrollThrottle()"
            releasedOn="1.0.0"
            description="Throttles a callback on scroll. Attach ref to your content; the hook listens on the nearest scrollable ancestor, or on document scroll when the page moves. Nav scroll does not affect content-scoped listeners."
        >
            <PageHud {...page} />
            <Ds.block
                title="Page scroll — ref auto-detects document scroll"
                code={`import { useScrollThrottle } from "${SYS.basePath}";

                       const { ref } = useScrollThrottle(() => {
                        // on scroll
                       }, 120);`}
                example={
                    <Flex ref={page.ref} minHeight={5000}>
                        scroll the page vertically
                    </Flex>
                }
            />
            <Ds.block
                title="ScrollFlex — throttled scroll inside container"
                description="5000×5000px content inside ScrollFlex. Page scroll does not affect this counter; nav scroll does not either."
                code={`import { useScrollThrottle } from "${SYS.basePath}";
                        import { ScrollFlex } from "${SYS.basePath}";

                        const { ref } = useScrollThrottle(() => {
                            // on scroll
                        }, 120);

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
                args="const { ref, source } = useScrollThrottle(callback, delay, { source });"
                returns="{ ref, source } — ref resolves the scroll target from the mounted tree; source is the active listener target."
                props={{
                    callback: {
                        description: "Function called on throttled scroll.",
                        type: "fn",
                        required: true,
                    },
                    delay: {
                        description: "Minimum interval in milliseconds.",
                        type: "number",
                        defaultValue: "100",
                    },
                    source: {
                        description:
                            "Optional scroll target. When omitted, ref finds the nearest scrollable ancestor, then falls back to document scroll.",
                        type: "Window | HTMLElement",
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
        </Ds.page>
    );
};

export default X;
