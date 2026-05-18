export const mergeActionButtonProps = (defaults, userProps, onAction) => {
    const userOnClick = userProps?.onClick;
    const rest = { ...(defaults || {}), ...(userProps || {}) };
    delete rest.onClick;

    return {
        ...rest,
        onClick: (e) => {
            userOnClick?.(e);
            onAction?.(e);
        },
    };
};
