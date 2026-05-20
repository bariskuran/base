import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useCheckOverflow } from ".";
import { useRef } from "react";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const ref = useRef(null);
    const { isOverflowingX, isOverflowingY, isOverflowing } = useCheckOverflow({ ref });

    return (
        <Flex.column gap={8}>
            <Flex ref={ref} width={220} height={80} overflow="auto" padding={8}>
                Very long very long very long very long very long content for overflow checks.
            </Flex>
            <Typo.span>{`overflow: ${String(isOverflowing)}`}</Typo.span>
            <Typo.span>{`x: ${String(isOverflowingX)} y: ${String(isOverflowingY)}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useCheckOverflow()"
        releasedOn="1.0.0"
        description="Detects overflow on element/window."
    >
        <Ds.block
            title="Element Overflow Detection"
            code={`import { useCheckOverflow } from "${SYS.basePath}";

                        const ref = useRef(null);
                        const { isOverflowing } = useCheckOverflow({ ref });`}
            example={<Demo />}
        />
        <Ds.api
            args="useCheckOverflow({ ref, target });"
            returns="Object with isOverflowing, isOverflowingX, isOverflowingY."
            props={{
                ref: {
                    description: "Target ref object.",
                    type: "RefObject<Element>",
                },
                target: {
                    description: "Direct target element/window override.",
                    type: "Element | Window",
                },
            }}
        />
    </Ds.page>
);

export default X;
