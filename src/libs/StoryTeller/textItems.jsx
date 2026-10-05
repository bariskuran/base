import { getText as t } from "../getText";
import { Typo } from "../Typo";
import { Fragment } from "react";
import styled from "styled-components";

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const DIVIDER_TITLE_TAGS = new Set(["h1", "h2"]);

const S = {
    titleDivider: styled.div`
        width: 10%;
        height: 3px;
        margin: 35rem 0;
        background-color: ${({ theme }) => theme.primary};
        flex-shrink: 0;
    `,
};

export const normalizeStoryTextItem = (item) => {
    if (item && typeof item === "object" && hasOwn(item, "data")) {
        const { as = "p", data, ...settings } = item;
        return { as, data, settings };
    }

    return { as: "p", data: item, settings: {} };
};

export const normalizeStoryText = (text) => (Array.isArray(text) ? text : text ? [text] : []);

export const StoryTextList = ({ items = [], ...commonSettings }) => {
    const normalizedItems = items.map(normalizeStoryTextItem);

    return normalizedItems.map(({ as, data, settings }, itemIndex) => {
        const Component = Typo[as] || Typo.p;
        const resolved = t(data);
        const nextItem = normalizedItems[itemIndex + 1];
        // A subtitle owns its divider only when it actually renders content.
        // Empty subtitle records must not suppress the h1/h2 divider.
        const hasVisibleSubtitle = nextItem?.as === "storySubTitle" && Boolean(t(nextItem.data));
        const shouldAddTitleDivider = DIVIDER_TITLE_TAGS.has(as) && !hasVisibleSubtitle;

        return (
            <Fragment key={itemIndex}>
                <Component {...commonSettings} {...settings}>
                    {resolved}
                </Component>
                {shouldAddTitleDivider && <S.titleDivider />}
            </Fragment>
        );
    });
};
