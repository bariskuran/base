import S from "./_styled";
import { useVars } from "./useVars";

export const GoogleMapViewer = ({ pb, w, h, title = "Google Map", className, style, ...rest }) => {
    const { src, width, height } = useVars({ pb, w, h });

    // pb mandatory — missing / empty / unparseable → render nothing
    if (pb == null || pb === "" || !src) return null;

    return (
        <S.iframe
            src={src}
            title={title}
            className={className}
            style={style}
            $width={width}
            $height={height}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            {...rest}
        />
    );
};

GoogleMapViewer.displayName = "GoogleMapViewer";
