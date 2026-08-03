import S from "./_styled";
import { useVars } from "./useVars";
import { Image } from "../Image";
import { useCoverImageVars } from "./useCoverImageVars";

const Speed = ({ speed = 0, className, style, children, ...rest }) => {
    const { isActive, ref } = useVars({ speed });

    if (!isActive) return children ?? null;

    return (
        <S.container ref={ref} className={className} style={style} {...rest}>
            {children}
        </S.container>
    );
};

const CoverImage = ({
    w,
    h,
    width,
    height,
    className,
    style,
    horizontal = false,
    threshold = 25,
    alt = "",
    loadInViewport = true,
    ...imageProps
}) => {
    const normalizedAxis = horizontal ? "x" : "y";
    const { ref } = useCoverImageVars({ axis: normalizedAxis, threshold });
    const resolvedWidth = width ?? w ?? "100%";
    const resolvedHeight = height ?? h ?? "50vh";

    return (
        <S.coverContainer
            ref={ref}
            className={className}
            data-paralax-axis={normalizedAxis}
            style={{ ...style, width: resolvedWidth, height: resolvedHeight }}
        >
            <Image
                {...imageProps}
                alt={alt}
                w={normalizedAxis === "x" ? "auto" : "100%"}
                h={normalizedAxis === "x" ? "100%" : "auto"}
                objectFit="cover"
                loadInViewport={loadInViewport}
            />
        </S.coverContainer>
    );
};

export const ParalaxItem = Speed;

Object.assign(ParalaxItem, {
    speed: Speed,
    coverImage: CoverImage,
});

ParalaxItem.displayName = "ParalaxItem";
Speed.displayName = "ParalaxItem.speed";
CoverImage.displayName = "ParalaxItem.coverImage";
