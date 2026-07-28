import { Button } from "../Button";
import { Card } from "../Card";
import { Visibility } from "../Visibility";
import { useVars } from "./tools/useVars";
import { S } from "./tools/_styled";

const getCardComponent = (cardVariant) => {
    if (!cardVariant) return Card;
    return Card[cardVariant] || Card;
};

const BaseCardViewer = ({
    items,
    data,
    variant = "grid",
    cardVariant = "amedist",
    emptyText,
    renderItem,
    getItemProps,
    gap = 20,
    minColumnWidth = 280,
    alignX = "center",
    page = 1,
    pageSize,
    offset = 0,
    total,
    onPageChange,
    onLoadMore,
    hasMore,
    loading,
    loadMoreLabel = { tr: "Daha fazla yükle", en: "Load more" },
    previousLabel = { tr: "Önceki", en: "Previous" },
    nextLabel = { tr: "Sonraki", en: "Next" },
    ...rest
}) => {
    const { visibleItems, isEmpty, totalPages, hasPreviousPage, hasNextPage } = useVars({
        items,
        data,
        page,
        pageSize,
        offset,
        emptyText,
        total,
    });

    const VariantCard = getCardComponent(cardVariant);
    const cards = visibleItems.map((item, index) => {
        const key = item?.id || item?.key || item?.catalogSet || index;
        if (renderItem) return renderItem(item, index);
        return <VariantCard key={key} {...item} {...getItemProps?.(item, index)} />;
    });

    return (
        <Visibility.mount visible={!isEmpty}>
            <S.Wrapper {...rest}>
                {variant === "masonry" ? (
                    <S.Masonry $gap={gap} $minColumnWidth={minColumnWidth}>
                        {cards}
                    </S.Masonry>
                ) : (
                    <S.Grid $gap={gap} $minColumnWidth={minColumnWidth} $alignX={alignX}>
                        {cards}
                    </S.Grid>
                )}
                {(onLoadMore || onPageChange) && (
                    <S.Actions>
                        {onPageChange && totalPages > 1 && (
                            <>
                                <Button.amedist
                                    label={previousLabel}
                                    disabled={!hasPreviousPage || loading}
                                    onClick={() => onPageChange(page - 1)}
                                />
                                <Button.amedist
                                    label={nextLabel}
                                    disabled={!hasNextPage || loading}
                                    onClick={() => onPageChange(page + 1)}
                                />
                            </>
                        )}
                        {onLoadMore && (hasMore ?? true) && (
                            <Button.amedist
                                label={loadMoreLabel}
                                pendingManually={loading}
                                disabled={loading}
                                onClick={onLoadMore}
                            />
                        )}
                    </S.Actions>
                )}
            </S.Wrapper>
        </Visibility.mount>
    );
};

export const CardViewer = BaseCardViewer;

CardViewer.grid = (props) => <BaseCardViewer {...props} variant="grid" />;
CardViewer.masonry = (props) => <BaseCardViewer {...props} variant="masonry" />;
