export const mergeActionButtonProps = (defaults, userProps, onAction) => {
    const userOnClick = userProps?.onClick;

    return {
        ...defaults,
        ...userProps,
        onClick: (e) => {
            userOnClick?.(e);
            onAction?.(e);
        },
    };
};
