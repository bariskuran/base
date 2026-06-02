import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useCheckOverflow } from ".";
import { useRef } from "react";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { baseStore } from "../baseStore";

const OverflowReadout = ({ isOverflowing, isOverflowingX, isOverflowingY }) => (
    <Flex.column gap={4}>
        <Typo.span size="s">{`overflow: ${String(isOverflowing)}`}</Typo.span>
        <Typo.span size="s" color="greys.shade60">
            {`x: ${String(isOverflowingX)}  y: ${String(isOverflowingY)}`}
        </Typo.span>
    </Flex.column>
);

const OverflowCase = ({ title, width, height, children, style }) => {
    const ref = useRef(null);
    const { isOverflowingX, isOverflowingY, isOverflowing } = useCheckOverflow({ ref });

    return (
        <Flex.column gap={6} flex={1} minWidth={0}>
            <Typo.span weight="bold" size="s">
                {title}
            </Typo.span>
            <Flex
                ref={ref}
                width={width}
                height={height}
                overflow="auto"
                padding={8}
                bgColor="greys.shade10"
                radius={6}
                style={style}
            >
                {children}
            </Flex>
            <OverflowReadout
                isOverflowing={isOverflowing}
                isOverflowingX={isOverflowingX}
                isOverflowingY={isOverflowingY}
            />
        </Flex.column>
    );
};

const PAGE_TARGETS = {
    window: () => (typeof window !== "undefined" ? window : null),
    documentElement: () => (typeof document !== "undefined" ? document.documentElement : null),
    body: () => (typeof document !== "undefined" ? document.body : null),
};

const X = () => {
    const { targetKey, set } = baseStore.useLocal({ targetKey: "window" });
    const refOnly = useRef(null);
    const {
        isOverflowingX: refX,
        isOverflowingY: refY,
        isOverflowing: refOverflow,
    } = useCheckOverflow({ ref: refOnly });
    const target = PAGE_TARGETS[targetKey]?.() ?? null;
    const {
        isOverflowingX: targetX,
        isOverflowingY: targetY,
        isOverflowing: targetOverflow,
    } = useCheckOverflow({ target });

    return (
        <Ds.page
            title="useCheckOverflow()"
            releasedOn="1.0.0"
            description={`useCheckOverflow checks if a target element (or window) has scrollable overflow on the X and/or Y axis.

            Use ref on a scroll container you own in React. Use target when the node is not yours via ref — especially window, document.documentElement, or document.body for page-level overflow. target ?? ref.current: if both are passed, target wins (rare; usually pick one).

            Returns isOverflowingX, isOverflowingY, and isOverflowing.`}
        >
            <Ds.block
                title="Overflow cases"
                description="Four fixed-size boxes: no overflow, vertical only, horizontal only, and both axes. Each uses ref only."
                code={`import { useCheckOverflow } from "${SYS.basePath}";

                       const ref = useRef(null);
                       const { isOverflowingX, isOverflowingY, isOverflowing } = useCheckOverflow({ ref });`}
                example={
                    <Flex.column gap={12} full>
                        <Typo.span size="s" color="greys.shade60">
                            Four boxes in one view. Each box uses its own hook instance. Resize the
                            panel to refresh checks.
                        </Typo.span>
                        <Flex gap={12} wrap full>
                            <OverflowCase title="Both false" width={200} height={72}>
                                Short text. Fits inside the box.
                            </OverflowCase>
                            <OverflowCase title="Y only (x false, y true)" width={140} height={56}>
                                Very long wrapped content. Very long wrapped content. Very long
                                wrapped content. Very long wrapped content. More lines here.
                            </OverflowCase>
                            <OverflowCase
                                title="X only (x true, y false)"
                                width={120}
                                height={48}
                                style={{ whiteSpace: "nowrap" }}
                            >
                                Wide-wide-wide-wide-wide-wide-wide-wide-wide-wide-wide-wide content
                            </OverflowCase>
                            <OverflowCase
                                title="Both true (x true, y true)"
                                width={100}
                                height={48}
                            >
                                <Flex.column
                                    gap={4}
                                    style={{
                                        width: 240,
                                        height: 72,
                                        flexShrink: 0,
                                        minWidth: 240,
                                        minHeight: 72,
                                    }}
                                >
                                    <Typo.span style={{ whiteSpace: "nowrap", display: "block" }}>
                                        Wide-wide-wide-wide-wide-wide-wide-wide line one
                                    </Typo.span>
                                    <Typo.span style={{ whiteSpace: "nowrap", display: "block" }}>
                                        Wide-wide-wide-wide-wide-wide-wide-wide line two
                                    </Typo.span>
                                    <Typo.span style={{ whiteSpace: "nowrap", display: "block" }}>
                                        Wide-wide-wide-wide-wide-wide-wide-wide line three
                                    </Typo.span>
                                    <Typo.span style={{ whiteSpace: "nowrap", display: "block" }}>
                                        Wide-wide-wide-wide-wide-wide-wide-wide line four
                                    </Typo.span>
                                </Flex.column>
                            </OverflowCase>
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="Using ref"
                description="Default: a ref on your scroll container. No target prop."
                code={`import { useRef } from "react";
                       import { useCheckOverflow } from "${SYS.basePath}";

                       const ref = useRef(null);
                       const { isOverflowing, isOverflowingX, isOverflowingY } = useCheckOverflow({ ref });

                       return <div ref={ref} style={{ overflow: "auto", height: 64 }}>...</div>;`}
                example={
                    <Flex.column gap={10} full>
                        <Typo.span size="s" color="greys.shade60">
                            Common pattern: create a ref, attach it to the scroll container, pass
                            only <Typo.span weight="bold">ref</Typo.span> to the hook (no target).
                        </Typo.span>
                        <Flex
                            ref={refOnly}
                            width={180}
                            height={64}
                            overflow="auto"
                            padding={8}
                            bgColor="greys.shade10"
                            radius={6}
                        >
                            Ref is on this box. Long wrapped content. Long wrapped content. Long
                            wrapped content.
                        </Flex>
                        <OverflowReadout
                            isOverflowing={refOverflow}
                            isOverflowingX={refX}
                            isOverflowingY={refY}
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="target: window / document (no ref)"
                description="Page-level overflow. window and document nodes are not used with ref — pass target only. Also valid: an Element from a parent prop or querySelector (anything you already hold)."
                code={`import { useCheckOverflow } from "${SYS.basePath}";

                        useCheckOverflow({ target: window });
                        useCheckOverflow({ target: document.body });`}
                example={
                    <Flex.column gap={10} full>
                        <Typo.span size="s" color="greys.shade60">
                            No ref here. You cannot put a ref on window or document.body — pass them
                            as target. The hook uses page scroll size vs viewport.
                        </Typo.span>
                        <Flex gap={8} wrap>
                            <Button
                                label="window"
                                onClick={() =>
                                    set((s) => {
                                        s.targetKey = "window";
                                    })
                                }
                                activeManually={targetKey === "window"}
                            />
                            <Button
                                label="documentElement"
                                onClick={() =>
                                    set((s) => {
                                        s.targetKey = "documentElement";
                                    })
                                }
                                activeManually={targetKey === "documentElement"}
                            />
                            <Button
                                label="body"
                                onClick={() =>
                                    set((s) => {
                                        s.targetKey = "body";
                                    })
                                }
                                activeManually={targetKey === "body"}
                            />
                        </Flex>
                        <Typo.span size="s" color="greys.shade60">
                            {`target: ${targetKey} — resize the browser or scroll the page to see values change.`}
                        </Typo.span>
                        <OverflowReadout
                            isOverflowing={targetOverflow}
                            isOverflowingX={targetX}
                            isOverflowingY={targetY}
                        />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { isOverflowing, isOverflowingX, isOverflowingY } = useCheckOverflow({ ref, target });"
                props={{
                    ref: {
                        description:
                            "Ref on the scroll container. Used when target is not set (usual case).",
                        type: "ref",
                    },
                    target: {
                        description:
                            "Element or Window without a React ref (e.g. window, document.body). Overrides ref when both are set.",
                        type: "Element | Window",
                    },
                }}
                returnProps={{
                    isOverflowing: {
                        description: "True when content overflows on X or Y axis.",
                        type: "boolean",
                    },
                    isOverflowingX: {
                        description: "True when scrollWidth exceeds clientWidth.",
                        type: "boolean",
                    },
                    isOverflowingY: {
                        description: "True when scrollHeight exceeds clientHeight.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
