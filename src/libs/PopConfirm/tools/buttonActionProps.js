export const BUTTON_ACTION_PROP_KEYS = ["onClick", "href", "to", "url"];

import { DEFAULT_TRIGGER_DELAY_MS } from "./defaultPopConfirmProps";

export const resolveTriggerDelayMs = (value) => {
    if (value == null || value === "") return DEFAULT_TRIGGER_DELAY_MS;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return DEFAULT_TRIGGER_DELAY_MS;
    return n;
};

const stampNestedClickEffect = (iconProps, value) => {
    if (!iconProps || typeof iconProps !== "object") return iconProps;
    return { ...iconProps, clickEffectManually: value };
};

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

export const mergeContentButtonProps = (defaults, userProps) => {
    const user = userProps || {};
    const merged = {
        ...(defaults || {}),
        ...user,
    };

    if (defaults?.prefix || user.prefix) {
        merged.prefix = {
            ...(defaults?.prefix || {}),
            ...(user.prefix || {}),
        };
    }

    if (user.icon) {
        merged.icon = { ...user.icon };
        if (!user.prefix) delete merged.prefix;
    }

    const [deferred, rest] = splitDeferredTriggerActions(merged);
    if (!Object.keys(deferred).length) return [deferred, rest];

    const next = { ...rest };

    if (next.clickEffectManually === undefined) {
        next.clickEffectManually = false;
    }
    if (next.activeManually === undefined) {
        next.activeManually = false;
    }

    const stampClickEffectControl = (iconProps) => {
        if (!iconProps || typeof iconProps !== "object") return iconProps;
        if (iconProps.clickEffectManually !== undefined) return iconProps;
        return { ...iconProps, clickEffectManually: false };
    };

    next.icon = stampClickEffectControl(next.icon);
    next.prefix = stampClickEffectControl(next.prefix);

    return [deferred, next];
};

export const applyTriggerInteractionState = (
    triggerProps,
    { isPanelOpen, playConfirmClickEffect },
) => {
    const next = { ...(triggerProps || {}) };

    if (playConfirmClickEffect) {
        next.disabled = false;
        next.clickEffectManually = true;
        next.activeManually = true;
        next.icon = stampNestedClickEffect(next.icon, true);
        next.prefix = stampNestedClickEffect(next.prefix, true);
        return next;
    }

    if (isPanelOpen) {
        next.disabled = true;
        next.clickEffectManually = false;
        next.activeManually = false;
        next.icon = stampNestedClickEffect(next.icon, false);
        next.prefix = stampNestedClickEffect(next.prefix, false);
    }

    return next;
};

export const splitDeferredTriggerActions = (contentButtonProps = {}) => {
    const deferred = pickButtonActionProps(contentButtonProps);
    const rest = { ...contentButtonProps };

    for (const key of BUTTON_ACTION_PROP_KEYS) {
        delete rest[key];
    }

    return [deferred, rest];
};

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
    setPlayConfirmClickEffect,
    navigate,
    triggerDelayMs,
}) => {
    const effectMs = resolveTriggerDelayMs(triggerDelayMs);
    const nav = mergeNavigationActionProps(deferredFromTrigger, confirmProps);
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
            setCloseReason?.("confirm");
            setPlayConfirmClickEffect?.(true);
            onPanelClose?.();
            invokeButtonActionProps(deferredFromTrigger, e, { navigate });

            window.setTimeout(() => {
                setPlayConfirmClickEffect?.(false);
            }, effectMs);
        },
    };
};

export const buildCancelButtonProps = ({
    defaults,
    cancelProps,
    onPanelClose,
    setCloseReason,
    onCancel,
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
            onCancel?.();
            onPanelClose?.();
        },
    };
};
