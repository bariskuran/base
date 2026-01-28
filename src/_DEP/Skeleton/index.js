import { useRef, useEffect } from "react";
import { useDS } from "../useDashStore";
import { Container, AntSkeleton, FormShapeContainer } from "./_styled";

export const Skeleton = (props = {}) => {
    const ref = useRef(null);
    const { show, useParagraph, useForm, ...p } = props;
    const { height, lineCount, set } = useDS({ height: 0, lineCount: 1 });

    useEffect(() => {
        const el = ref?.current;
        const parentNode = el?.parentNode;
        if (!el || !parentNode) return;
        const comp = window.getComputedStyle(parentNode);
        const height = parseFloat(comp.height) - 1;
        const lineCount = Math.round(height / 100);
        set({ height, lineCount: lineCount > 0 ? lineCount - 1 : 0 });
    }, [ref]);

    /* Return */
    return (
        <Container
            ref={ref}
            $show={show}
            $height={height}
            onClick={(e) => {
                e.stopPropagation();
            }}
            aria-label="Skeleton"
            {...p}
        >
            {useParagraph && height > 50 && <AntSkeleton paragraph={{ rows: lineCount }} />}
            {useForm && <FormShape />}
        </Container>
    );
};

const FormShape = () => {
    return (
        <FormShapeContainer>
            <div />
            <div />
            <div>
                <div />
                <div />
                <div />
                <div />
            </div>
        </FormShapeContainer>
    );
};
