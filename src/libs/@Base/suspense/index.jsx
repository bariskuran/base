import { Suspense } from "react";

export const SuspenseWrapper = ({ children, ...props }) => {
    const { suspenseFallback, otherSuspenseProps } = props || {};
    return !suspenseFallback ? (
        children
    ) : (
        <Suspense fallback={suspenseFallback} {...otherSuspenseProps}>
            {children}
        </Suspense>
    );
};
