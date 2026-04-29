export const omitContainerSizingFromContent = (props = {}) => {
    const {
        width: _width,
        height: _height,
        minWidth: _minWidth,
        minHeight: _minHeight,
        maxWidth: _maxWidth,
        maxHeight: _maxHeight,
        overflow: _overflow,
        overflowX: _overflowX,
        overflowY: _overflowY,
        flex: _flex,
        flexGrow: _flexGrow,
        flexShrink: _flexShrink,
        flexBasis: _flexBasis,
        alignSelf: _alignSelf,
        order: _order,
        ...rest
    } = props;

    return rest;
};
