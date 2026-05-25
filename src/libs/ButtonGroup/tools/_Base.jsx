import { useMemo, useRef } from "react";
import useVars from "./useVars";
import { Button } from "../../Button";
import { Group } from "../../Group";
import { ScrollFlex } from "../../ScrollFlex";
import ScrollEdgeShadowLayers from "./ScrollEdgeShadowLayers";

const rowClampGridStyle = {
    display: "grid",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    height: "fit-content",
    alignSelf: "start",
    gridTemplateColumns: "minmax(0, 1fr)",
    position: "relative",
};

const columnWrapStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
};

export const Base = (p = {}) => {
    const scrollEdgeWrapRef = useRef(null);

    const {
        Variant,
        forwardedRef,
        items,
        groupProps,
        resolvedFlexProps,
        mergedScrollBarProps,
        scrollFlexVariant,
        isRowLayout,
        flat,
        scrollEdgeShadow,
    } = useVars({ ...p, scrollEdgeWrapRef });

    const userStyle = p.style;
    const variantStyle = isRowLayout
        ? {
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              height: "fit-content",
              alignSelf: "flex-start",
              ...(userStyle || {}),
          }
        : userStyle;

    const groupList = (
        <Group component={Button} items={items} groupProps={groupProps} flat />
    );

    const scrollBarPropsForScrollFlex = useMemo(
        () =>
            isRowLayout
                ? {
                      ...mergedScrollBarProps,
                      trackMargin: mergedScrollBarProps.trackMargin ?? 0,
                      edgeMarginX: 0,
                      edgeMarginY: 0,
                  }
                : {
                      ...mergedScrollBarProps,
                      trackMargin: mergedScrollBarProps.trackMargin ?? 0,
                  },
        [isRowLayout, mergedScrollBarProps],
    );

    if (flat) {
        return groupList;
    }

    const listInner = (
        <ScrollFlex
            {...(scrollFlexVariant != null ? { variant: scrollFlexVariant } : {})}
            {...(isRowLayout
                ? {
                      autoHeight: false,
                      width: "100%",
                  }
                : {
                      height: "100%",
                  })}
            flexProps={resolvedFlexProps}
            scrollBarProps={scrollBarPropsForScrollFlex}
        >
            {groupList}
        </ScrollFlex>
    );

    const wrapStyle = isRowLayout ? rowClampGridStyle : columnWrapStyle;

    return (
        <Variant ref={forwardedRef} style={variantStyle}>
            <div
                ref={scrollEdgeWrapRef}
                style={{
                    ...wrapStyle,
                    ...(scrollEdgeShadow
                        ? {
                              "--scroll-edge-start-opacity": 0,
                              "--scroll-edge-end-opacity": 0,
                          }
                        : {}),
                }}
            >
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                        height: "100%",
                        minHeight: 0,
                        minWidth: 0,
                    }}
                >
                    {listInner}
                </div>
                <ScrollEdgeShadowLayers enabled={scrollEdgeShadow} isRowLayout={isRowLayout} />
            </div>
        </Variant>
    );
};
