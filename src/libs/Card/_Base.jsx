import { isValidElement } from "react";
import { Image } from "../Image";
import { useVars } from "./tools/useVars";

const renderThumb = ({ thumb, src, externalSet, catalogSet, thumbAlt }) => {
    if (isValidElement(thumb)) return thumb;
    if (thumb || src || externalSet || catalogSet) {
        return (
            <Image
                src={typeof thumb === "string" ? thumb : src}
                externalSet={externalSet}
                catalogSet={catalogSet}
                variant={catalogSet ? "thumb" : undefined}
                alt={thumbAlt}
                w="100%"
                h="100%"
                objectFit="cover"
                data-slot="thumb-image"
            />
        );
    }
    return null;
};

export const Base = (props = {}) => {
    const {
        forwardedRef,
        Variant,
        thumb,
        src,
        externalSet,
        catalogSet,
        thumbAlt = "",
        title,
        subtitle,
        supTitle,
        description,
        ctaLabel,
        to,
        href,
        state,
        onClick,
        target,
        disabled,
        ...rest
    } = props;
    const VariantComponent = Variant?.component || Variant?.variant || Variant;

    const {
        texts,
        isHovered,
        isClickable,
        isSemanticLink,
        linkProps,
        handleClick,
        handleKeyDown,
        hoverProps,
    } = useVars({
        title,
        subtitle,
        supTitle,
        description,
        ctaLabel,
        to,
        href,
        state,
        onClick,
        target,
        disabled,
    });

    const thumbNode = renderThumb({ thumb, src, externalSet, catalogSet, thumbAlt });

    return (
        <VariantComponent
            {...rest}
            {...hoverProps}
            {...linkProps}
            ref={forwardedRef}
            role={isClickable && !isSemanticLink ? "button" : undefined}
            tabIndex={isClickable && !isSemanticLink ? 0 : undefined}
            aria-disabled={disabled || undefined}
            onClick={onClick ? handleClick : undefined}
            onKeyDown={isSemanticLink ? undefined : handleKeyDown}
            $isClickable={isClickable}
            $isHovered={isHovered}
            texts={texts}
            thumbNode={thumbNode}
            isHovered={isHovered}
            isClickable={isClickable}
            disabled={disabled}
        />
    );
};
