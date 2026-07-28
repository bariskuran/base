import { useCallback, useState } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useObserver } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { notifier } from "../notifier";

const ViewportHud = ({ ref1, ref2, ref3, ref4 }) => (
    <Flex
        gap={14}
        padding="10rem 18rem"
        bgColor="greys.shade20"
        xAlign="center"
        yAlign="center"
        style={{
            position: "fixed",
            top: "20rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            boxShadow: "0 4rem 16rem rgba(0, 0, 0, 0.12)",
            borderRadius: 8,
            flexWrap: "wrap",
            maxWidth: "min(96vw, 640px)",
        }}
    >
        <Typo.span>
            <b>ref1:</b> {String(ref1)} | <b>ref2:</b> {String(ref2)} | <b>ref3:</b> {String(ref3)}{" "}
            | <b>ref4:</b> {String(ref4)}
        </Typo.span>
    </Flex>
);

const X = () => {
    const { ref: ref1, inViewport: inViewport1 } = useObserver({ threshold: 0.2 });
    const { ref: ref2, inViewport: inViewport2 } = useObserver({ threshold: 0.2 });
    const { ref: ref3, inViewport: inViewport3 } = useObserver({
        threshold: 0.2,
        onEnter: () => notifier.add("ref3 entered viewport."),
        onExit: () => notifier.add("ref3 exited viewport."),
    });

    const [scrollRoot, setScrollRoot] = useState(null);
    const scrollRootRef = useCallback((el) => {
        setScrollRoot((prev) => (Object.is(prev, el) ? prev : el));
    }, []);

    const { ref: ref4, inViewport: inViewport4 } = useObserver({
        customViewport: scrollRoot,
        customViewportMargin: "-20px",
        threshold: 0,
    });

    return (
        <Ds.page
            title="useObserver()"
            releasedOn="1.0.0"
            description={
                <>
                    Wraps the browser <code>IntersectionObserver</code>. By default the browser
                    viewport is used; pass <code>customViewport</code> to observe inside a
                    scrollable parent instead. <code>customViewportMargin</code> grows or shrinks
                    that viewport&apos;s detection box (number = px on all sides, or a CSS margin
                    string). <code>onEnter</code> / <code>onExit</code> run on crossings;{" "}
                    <code>inViewport</code> mirrors the latest intersection state for React UI.
                </>
            }
        >
            <ViewportHud
                ref1={inViewport1}
                ref2={inViewport2}
                ref3={inViewport3}
                ref4={inViewport4}
            />
            <Ds.block
                title="ref1 — inViewport (viewport root)"
                code={`import { useObserver } from "${SYS.basePath}";

                       const { ref, inViewport } = useObserver({ threshold: 0.2 });`}
                example={
                    <Flex ref={ref1} padding={10} bgColor="greys.shade20">
                        ref1
                    </Flex>
                }
            />
            <Ds.block
                title="ref2 — scroll into view"
                description="Tall block — scroll the page until ref2 intersects the viewport."
                example={
                    <Flex.column gap={8} minHeight={1200} justify="end">
                        <Flex ref={ref2} padding={10} bgColor="greys.shade20">
                            ref2
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="ref3 — onEnter / onExit"
                description="Uses notifier.add on enter and exit. Watch the HUD and toast messages while scrolling ref3 in and out of view."
                code={`import { notifier } from "${SYS.basePath}";

                       const { ref } = useObserver({
                        threshold: 0.2,
                        onEnter: () => notifier.add("ref3 entered viewport."),
                        onExit: () => notifier.add("ref3 exited viewport."),
                       });`}
                example={
                    <Flex.column gap={8}>
                        <Flex ref={ref3} padding={10} bgColor="greys.shade20">
                            ref3
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="ref4 — customViewport & customViewportMargin"
                description="Scroll inside the box only. ref4 uses the box as customViewport (not the page viewport). customViewportMargin -20px tightens the inner detection zone."
                code={`const [customViewport, setCustomViewport] = useState(null);

                       const { ref, inViewport } = useObserver({
                        customViewport,
                        customViewportMargin: "-20px",
                        threshold: 0,
                       });

                       return (
                        <div ref={setCustomViewport} style={{ height: 200, overflowY: "auto" }}>
                            <div style={{ minHeight: 480 }} />
                            <div ref={ref}>ref4</div>
                        </div>
                       );`}
                example={
                    <Flex.column gap={10} full maxWidth={400}>
                        <Typo.span size={12}>
                            Scroll inside this container — the page scroll position does not affect
                            ref4.
                        </Typo.span>
                        <div
                            ref={scrollRootRef}
                            style={{
                                width: "100%",
                                height: 200,
                                overflowY: "auto",
                                overflowX: "hidden",
                                boxSizing: "border-box",
                                border: "1px solid #ccc",
                                borderRadius: 8,
                                background: "#f5f5f5",
                            }}
                        >
                            <Flex.column gap={8} padding={10} minHeight={520}>
                                <div style={{ height: 360, flexShrink: 0 }} aria-hidden />
                                <Flex ref={ref4} padding={10} bgColor="primarys.tint20">
                                    ref4
                                </Flex>
                            </Flex.column>
                        </div>
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { ref, inViewport, phase, direction, intersectionRatio } = useObserver({ disable, onEnter, onExit, customViewport, customViewportMargin, threshold });"
                props={{
                    disable: {
                        description: "Disables observer setup.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    onEnter: {
                        description:
                            "Called when the element intersects the viewport (per threshold).",
                        type: "fn",
                    },
                    onExit: {
                        description: "Called when intersection ends.",
                        type: "fn",
                    },
                    customViewport: {
                        description:
                            "Custom intersection viewport element. null (default) = browser viewport. Set to a scrollable ancestor to measure visibility inside that container only.",
                        type: "Element | null",
                        defaultValue: "null",
                    },
                    customViewportMargin: {
                        description:
                            'Margin around the custom viewport before intersection is computed. Number = px on all sides; string = CSS margin syntax (e.g. "0px 0px -80px 0px"). Positive expands the zone; negative shrinks it.',
                        type: "number | string",
                        defaultValue: "0",
                    },
                    threshold: {
                        description: "Intersection ratio(s) that trigger callbacks (0–1).",
                        type: "number | number[]",
                        defaultValue: "0.2",
                    },
                }}
                returnProps={{
                    ref: {
                        description: "Ref callback to attach to the observed element.",
                        type: "fn",
                    },
                    inViewport: {
                        description:
                            "True when the element intersects the viewport (browser or customViewport) at the given threshold.",
                        type: "boolean",
                    },
                    phase: {
                        description:
                            'Current movement phase: "outside", "entering", "inside", or "exiting".',
                        type: "string",
                    },
                    direction: {
                        description: 'Nearest movement edge: "top", "right", "bottom", or "left".',
                        type: "string",
                    },
                    intersectionRatio: {
                        description: "Latest visible intersection ratio between 0 and 1.",
                        type: "number",
                    },
                }}
            />
            <Ds.api
                disableLastBlock
                title="onEnter"
                args="onEnter(entry);"
                props={{
                    entry: {
                        description: "IntersectionObserverEntry for the crossing.",
                        type: "IntersectionObserverEntry",
                    },
                }}
            />
            <Ds.api
                disableLastBlock
                title="onExit"
                args="onExit(entry);"
                props={{
                    entry: {
                        description: "IntersectionObserverEntry for the crossing.",
                        type: "IntersectionObserverEntry",
                    },
                }}
            />
            <Ds.api
                title="ref"
                args="ref(element);"
                props={{
                    element: {
                        description: "DOM node to observe, or null to unobserve.",
                        type: "Element | null",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
