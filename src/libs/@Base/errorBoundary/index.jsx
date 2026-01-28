import { ErrorBoundary } from "react-error-boundary";

export const ErrorWrapper = ({ children, ...props }) => {
    const { errorFallback, otherErrorBoundaryProps } = props || {};
    return !errorFallback ? (
        children
    ) : (
        <ErrorBoundary fallback={errorFallback} {...otherErrorBoundaryProps}>
            {children}
        </ErrorBoundary>
    );
};
