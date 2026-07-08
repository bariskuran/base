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
        description,
        ctaLabel,
        to,
        href,
        onClick,
        target,
        disabled,
        ...rest
    } = props;
    const VariantComponent = Variant?.component || Variant?.variant || Variant;

    const { texts, isHovered, isClickable, handleClick, handleKeyDown, hoverProps } = useVars({
        title,
        subtitle,
        description,
        ctaLabel,
        to,
        href,
        onClick,
        target,
        disabled,
    });

    const thumbNode = renderThumb({ thumb, src, externalSet, catalogSet, thumbAlt });

    return (
        <VariantComponent
            {...rest}
            {...hoverProps}
            ref={forwardedRef}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-disabled={disabled || undefined}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
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
