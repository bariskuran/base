import { getText as t } from "../getText";
import { Typo } from "../Typo";

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

export const normalizeStoryTextItem = (item) => {
    if (item && typeof item === "object" && hasOwn(item, "data")) {
        const { as = "p", data, ...settings } = item;
        return { as, data, settings };
    }

    return { as: "p", data: item, settings: {} };
};

export const normalizeStoryText = (text) => (Array.isArray(text) ? text : text ? [text] : []);

export const StoryTextList = ({ items = [], ...commonSettings }) =>
    items.map((item, itemIndex) => {
        const { as, data, settings } = normalizeStoryTextItem(item);
        const Component = Typo[as] || Typo.p;
        const resolved = t(data);

        return (
            <Component key={itemIndex} {...commonSettings} {...settings}>
                {resolved}
            </Component>
        );
    });
