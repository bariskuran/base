export const BUTTON_ACTION_PROP_KEYS = ["onClick", "href", "to", "url"];

export const pickButtonActionProps = (props) => {
    if (!props || typeof props !== "object") return {};

    const out = {};
    for (const key of BUTTON_ACTION_PROP_KEYS) {
        const value = props[key];
        if (value == null || value === "") continue;
        if (key === "onClick" && typeof value !== "function") continue;
        out[key] = value;
    }
    return out;
};

export const splitDeferredTriggerActions = (contentButtonProps = {}) => {
    const deferred = pickButtonActionProps(contentButtonProps);
    const rest = { ...contentButtonProps };

    for (const key of BUTTON_ACTION_PROP_KEYS) {
        delete rest[key];
    }

    return [deferred, rest];
};

/** trigger (primary) overrides confirm for href / to / url */
export const mergeNavigationActionProps = (triggerProps, confirmProps) => {
    const merged = {
        ...pickButtonActionProps(confirmProps),
        ...pickButtonActionProps(triggerProps),
    };
    const out = {};

    for (const key of ["href", "to", "url"]) {
        if (merged[key] != null && merged[key] !== "") {
            out[key] = merged[key];
        }
    }

    return out;
};

export const invokeButtonActionProps = (props, event, { navigate } = {}) => {
    const actionProps = pickButtonActionProps(props);
    if (!Object.keys(actionProps).length) return;

    actionProps.onClick?.(event);

    const url = actionProps.href || actionProps.to || actionProps.url;
    if (!url) return;

    if (/^https?:\/\//.test(url)) {
        if (props?._blank) {
            window.open(url, "_blank", "noopener,noreferrer");
        } else {
            window.location.assign(url);
        }
        return;
    }

    navigate?.(url);
};

export const buildConfirmButtonProps = ({
    defaults,
    confirmProps,
    deferredFromTrigger,
    onPanelClose,
    setCloseReason,
}) => {
    const nav = mergeNavigationActionProps(deferredFromTrigger, confirmProps);
    const triggerOnClick = deferredFromTrigger?.onClick;
    const confirmOnClick = confirmProps?.onClick;

    const restConfirm = { ...(confirmProps || {}) };
    for (const key of BUTTON_ACTION_PROP_KEYS) {
        delete restConfirm[key];
    }

    return {
        ...defaults,
        ...restConfirm,
        ...nav,
        onClick: (e) => {
            confirmOnClick?.(e);
            triggerOnClick?.(e);
            setCloseReason?.("confirm");
            onPanelClose?.();
        },
    };
};

export const buildCancelButtonProps = ({
    defaults,
    cancelProps,
    onPanelClose,
    setCloseReason,
}) => {
    const userOnClick = cancelProps?.onClick;

    const restCancel = { ...(cancelProps || {}) };
    delete restCancel.onClick;

    return {
        ...defaults,
        ...restCancel,
        onClick: (e) => {
            userOnClick?.(e);
            setCloseReason?.("cancel");
            onPanelClose?.();
        },
    };
};
