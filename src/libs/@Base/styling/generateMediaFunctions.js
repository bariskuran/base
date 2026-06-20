

import { css } from "styled-components";
import { DEFAULT_BREAKPOINTS } from "../../../constants/DEFAULT_BREAKPOINTS";
import { DEFAULT_MAX_ASP_RATIO } from "../../../constants/DEFAULT_MAX_ASP_RATIO";
import { DEFAULT_MIN_ASP_RATIO } from "../../../constants/DEFAULT_MIN_ASP_RATIO";
import { colorAlpha } from "../../colorAlpha";
import { colorTinter } from "../../colorTinter";
import { colorShader } from "../../colorShader";
import { colorConverter } from "../../colorConverter";
import { colorWcagMatch } from "../../colorWcagMatch";
import { colorWcagValue } from "../../colorWcagValue";
import { colorGet } from "../../colorGet";
import { colorFind } from "../../colorFind";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { cssSpacingResolver } from "../../cssSpacingResolver";
import { get3DShadow } from "../../colorGet3DShadow";

export const generateMediaFunctions = ({
    breakpoints = DEFAULT_BREAKPOINTS,
    maxAspRatio = DEFAULT_MAX_ASP_RATIO,
    minAspRatio = DEFAULT_MIN_ASP_RATIO,
} = {}) => {
    const mediaFunctions = {
        phone: (content) => {
            return css`
                @media (max-aspect-ratio: ${maxAspRatio}),
                    (min-aspect-ratio: ${minAspRatio}),
                    (max-width: ${breakpoints.tablet[0] + "px"}) {
                    ${content}
                }
            `;
        },

        tablet: (content) => css`
        @media (min-aspect-ratio: ${maxAspRatio})
            and (max-aspect-ratio: ${minAspRatio})
            and (min-width: ${breakpoints.tablet[0] + "px"})
            and (max-width: ${breakpoints.desktop[0] + "px"}) {
                ${content}
            }
    `,

        desktop: (content) => css`
        @media (min-aspect-ratio: ${maxAspRatio})
            and (max-aspect-ratio: ${minAspRatio})
            and (min-width: ${breakpoints.desktop[0] + "px"})
            and (max-width: ${breakpoints.large[0] + "px"}) {
                ${content}
            }
    `,

        large: (content) => css`
            @media (min-aspect-ratio: ${maxAspRatio})
            and (max-aspect-ratio: ${minAspRatio})
            and (min-width: ${breakpoints.large[0] + "px"})
            and (max-width: ${breakpoints.uhd[0] + "px"}) {
                ${content}
            }
    `,

        uhd: (content) => css`
            @media (min-aspect-ratio: ${maxAspRatio})
            and (max-aspect-ratio: ${minAspRatio})
            and (min-width: ${breakpoints.uhd[0] + "px"})
            and (max-width: ${breakpoints.uhd8[0] + "px"}) {
                ${content}
            }
    `,

        uhd8: (content) => css`
            @media (min-aspect-ratio: ${maxAspRatio})
            and (max-aspect-ratio: ${minAspRatio})
            and (min-width: ${breakpoints.uhd8[0] + "px"}) {
                ${content}
            }
    `,

        vertical: (content) => css`
            @media (max-aspect-ratio: ${maxAspRatio}) {
                ${content}
            }
        `,

        square: (content) => css`
            @media (aspect-ratio: 1/1) {
                ${content}
            }
        `,
    };

    mediaFunctions.responsive = (arrStr = "", content) => {
        const arr = arrStr.replace(/\s/g, "").split?.(",");
        return css`
            ${arr.includes("phone") && mediaFunctions.phone(content)}
            ${arr.includes("tablet") && mediaFunctions.tablet(content)}
        ${arr.includes("desktop") && mediaFunctions.desktop(content)}
        ${arr.includes("large") && mediaFunctions.large(content)}
        ${arr.includes("uhd") && mediaFunctions.uhd(content)}
        ${arr.includes("uhd8") && mediaFunctions.uhd8(content)}
        ${arr.includes("vertical") && mediaFunctions.vertical(content)}
        ${arr.includes("square") && mediaFunctions.square(content)}
        `;
    };

    const keys = ["phone", "tablet", "desktop", "large", "uhd", "uhd8", "vertical", "square"];

    keys.forEach((key) => {
        mediaFunctions.responsive[key] = (content) => mediaFunctions[key](content);
    });

    mediaFunctions.freeBpMixin = (prop, obj) => {
        let styles = "";
        for (let i = 0; i < obj.length; i++) {
            const bpRange = obj[i];
            const min = bpRange[0];
            const max = bpRange[1];
            const value = obj[i][2];
            styles += `
      @media (min-width: ${min}px) and (max-width: ${max}px) {
        ${prop}: ${value};
      }
    `;
        }
        return css`
            ${styles}
        `;
    };

    mediaFunctions.colorAlpha = colorAlpha;
    mediaFunctions.colorTinter = colorTinter;
    mediaFunctions.colorShader = colorShader;
    mediaFunctions.colorConverter = colorConverter;
    mediaFunctions.colorWcagMatch = colorWcagMatch;
    mediaFunctions.colorWcagValue = colorWcagValue;
    mediaFunctions.colorGet = colorGet;
    mediaFunctions.colorFind = colorFind;
    mediaFunctions.get3DShadow = get3DShadow;
    mediaFunctions.cssNormalizeSize = cssNormalizeSize;
    mediaFunctions.cssSpacingResolver = cssSpacingResolver;

    return mediaFunctions;
};
