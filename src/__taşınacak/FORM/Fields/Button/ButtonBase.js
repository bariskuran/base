import { useMemo, useRef, useEffect } from "react";
import { StyledA, StyledButton, StyledLink } from "./_styled";
import { useDS } from "../../../useDashStore";
import { Icon } from "../../../Icon";
import { useDebouncedFunction } from "../../../useDebouncedFunction";
import { Spin } from "antd";

export const ButtonBase = ({
    fieldRef,
    label,
    onClick,
    href,
    preIcon,
    sufIcon,
    iconSize = 12,
    iconColor,
    disableIconAnimation,
    isLoading,
    primary,
    secondary,
    error,
    success,
    hoverManually,
    disableAfterClick = 2000,
    disabled,
    hidden,
    isMobile,
    // tooltipPlacement,
    className,
    inputProps = {},
    ariaLabel,
    // onBlur,
    // onChange,
    // onClear,
    // onHover,
    // ...rest
}) => {
    const { set, internalIsLoading } = useDS({
        timeout: null,
        internalIsLoading: false,
    });
    const timeout = useRef(null);
    const innerRef = useRef(null);
    const totalLoading = isLoading || internalIsLoading;

    const type = useMemo(() => {
        if (href && href.startsWith("http")) return "a";
        if (href && !href.startsWith("http")) return "link";
        return "button";
    }, [href, onClick]);
    const Component = useMemo(
        () => (type === "a" ? StyledA : type === "link" ? StyledLink : StyledButton),
        [type],
    );

    const handleOnClick = useDebouncedFunction(
        (e) => {
            set({ internalIsLoading: true });
            onClick?.(e);
            (fieldRef || innerRef)?.current?.blur();
            clearTimeout(timeout.current);
            if (disableAfterClick > 0) {
                timeout.current = setTimeout(() => {
                    set({ internalIsLoading: false });
                }, disableAfterClick);
            } else {
                set({ internalIsLoading: false });
            }
        },
        { debounceDelay: disableAfterClick, isThrottle: true },
    );

    useEffect(
        () => () => {
            clearTimeout(timeout.current);
        },
        [],
    );

    /* */
    if (hidden) return null;
    return (
        <Component
            className={className}
            ref={fieldRef || innerRef}
            tabIndex={disabled ? -1 : 0}
            aria-label={"ButtonBase" + ariaLabel}
            onClick={handleOnClick}
            //
            $disabled={disabled}
            $primary={primary}
            $secondary={secondary}
            $error={error}
            $success={success}
            $isLoading={totalLoading}
            $disableIconAnimation={disableIconAnimation}
            $isMobile={isMobile}
            $hoverManually={hoverManually}
            //
            to={type === "link" ? href : undefined}
            href={type === "a" ? href : undefined}
            target={type === "a" ? "_blank" : undefined}
            rel={type === "a" ? "noreferrer" : undefined}
            //
            {...inputProps}
        >
            {totalLoading && <Spin id="spin" />}
            {preIcon && (
                <div id="preIconArea">
                    <Icon
                        icon={preIcon}
                        width={iconSize}
                        color={iconColor || inputProps.iconColor}
                    />
                </div>
            )}
            {label && <div id="labelArea">{label}</div>}
            {sufIcon && (
                <div id="sufIconArea">
                    <Icon
                        icon={sufIcon}
                        width={iconSize}
                        color={iconColor || inputProps.iconColor}
                    />
                </div>
            )}
            <div id="background" />
        </Component>
    );
};
