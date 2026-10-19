// useHead version of loadFonts.js ** React19.0.0 is not stabil yet for this.
//
// import { useMemo, useHead } from "react";
// import { useBase } from "../useBase";
// import { SYSTEM_PRIMARY_FONT } from "../SystemGlobalStyles/SYSTEM_PRIMARY_FONT";

// export const LoadFonts = () => {
//     const baseFn = (s) => [
//         s?.BASE_SETTINGS?.styleManager?.otherFonts,
//         s.BASE_SETTINGS?.styleManager?.primaryFont,
//     ];
//     const [otherFonts, primaryFont] = useBase(baseFn);
//     const definePrimaryFont = useMemo(() => primaryFont || SYSTEM_PRIMARY_FONT, [primaryFont]);

//     const allFonts = [definePrimaryFont, ...(otherFonts || [])];

//     useHead(() => ({
//         links: [
//             { rel: "preconnect", href: "https://fonts.googleapis.com" },
//             ...allFonts.map(({ url }) => ({
//                 rel: "stylesheet",
//                 href: url,
//             })),
//         ],
//     }));

//     return null;
// };

import { useMemo } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useBase } from "../useBase";
import { SYSTEM_PRIMARY_FONT } from "../SystemGlobalStyles/SYSTEM_PRIMARY_FONT";

export const LoadFonts = () => {
    const baseFn = (s) => [
        s?.BASE_SETTINGS?.styleManager?.otherFonts,
        s.BASE_SETTINGS?.styleManager?.primaryFont,
    ];
    const [otherFonts, primaryFont] = useBase(baseFn);
    const definePrimaryFont = useMemo(() => primaryFont || SYSTEM_PRIMARY_FONT, [primaryFont]);

    return (
        <HelmetProvider>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> */}
                {[definePrimaryFont, ...(otherFonts || [])]?.map(({ url }, index) => (
                    <link key={index} href={url} rel="stylesheet" />
                ))}
            </Helmet>
        </HelmetProvider>
    );
};
