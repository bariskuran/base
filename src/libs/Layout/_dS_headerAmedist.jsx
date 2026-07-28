import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="<Layout.headerAmedist>"
        releasedOn="1.0.0"
        description={{
            tr: "Logo, kontrollü search input, dil değiştirici ve menu toggle alanı içeren sticky Amedist header varyantıdır. Menü, search ve görünürlük state'i controller registry üzerinden paylaşılır.",
            en: "Sticky Amedist header variant with logo, controlled search input, language switcher, and menu toggle areas. Menu, search, and visibility state are shared through the controller registry.",
        }}
    >
        <Ds.block
            title={{ tr: "Temel kullanım", en: "Basic usage" }}
            code={`import { Layout } from "${SYS.basePath}";

<Layout.headerAmedist
    controllerId="main"
    logo={{
        tr: { extended: trLogo, condensed: trLogoSmall },
        en: { extended: enLogo, condensed: enLogoSmall },
    }}
/>`}
        />
        <Ds.block
            title={{ tr: "Controller çıktısı", en: "Controller output" }}
            code={`const {
    openMenu,
    closeMenu,
    toggleMenu,
    menuStatus, // "opening" | "open" | "closing" | "closed"
    searchValue,
    setSearchValue,
    clearSearchValue,
    headerStatus, // "extended" | "condensed" | "hidden"
    hideHeader,
    showHeader,
    extendedHeight,
    condensedHeight,
} = useLayout("headerAmedist", { controllerId: "main" });`}
        />
        <Ds.api
            args="<Layout.headerAmedist logo />"
            props={{
                logo: {
                    description: {
                        tr: "ReactNode, tek asset URL'i veya language/status kırılımlı logo objesi.",
                        en: "ReactNode, a single asset URL, or a logo object keyed by language and status.",
                    },
                    type: "ReactNode | string | object",
                    required: true,
                },
                controllerId: {
                    description: {
                        tr: "Bu header controller instance'ının benzersiz kimliği.",
                        en: "Unique identity of this header controller instance.",
                    },
                    type: "string",
                    defaultValue: "default",
                },
                extendedHeight: {
                    description: {
                        tr: "Extended header yüksekliği.",
                        en: "Extended header height.",
                    },
                    type: "number",
                    defaultValue: "100",
                },
                condensedHeight: {
                    description: {
                        tr: "Condensed header yüksekliği.",
                        en: "Condensed header height.",
                    },
                    type: "number",
                    defaultValue: "50",
                },
                openIconProps: {
                    description: {
                        tr: "Menu açma ikonuna iletilen Icon prop objesi.",
                        en: "Icon prop object forwarded to the menu-open icon.",
                    },
                    type: "object",
                },
                closeIconProps: {
                    description: {
                        tr: "Menu kapatma ikonuna iletilen Icon prop objesi.",
                        en: "Icon prop object forwarded to the menu-close icon.",
                    },
                    type: "object",
                },
                headerColor: {
                    description: {
                        tr: "Extended header'ın varsayılan foreground rengi.",
                        en: "Default foreground color of the extended header.",
                    },
                    type: "string",
                    defaultValue: "foreground",
                },
                headerBackgroundColor: {
                    description: { tr: "Header arka plan rengi.", en: "Header background color." },
                    type: "string",
                    defaultValue: "background",
                },
                headerBackgroundAlpha: {
                    description: {
                        tr: "Extended header'ın varsayılan arka plan alpha değeri.",
                        en: "Default background alpha of the extended header.",
                    },
                    type: "number",
                    defaultValue: "70",
                },
                hideHeader: {
                    description: {
                        tr: "Controller hideHeader/showHeader komutlarıyla birleşen controlled gizleme sinyali.",
                        en: "Controlled hide signal combined with controller hideHeader/showHeader commands.",
                    },
                    type: "boolean",
                    defaultValue: "false",
                },
                searchPlaceholder: {
                    description: {
                        tr: "Varsayılan searchInputPlaceholder metnini ezer.",
                        en: "Overrides the default searchInputPlaceholder text.",
                    },
                    type: "string",
                },
                onLogoClick: {
                    description: {
                        tr: "Varsayılan ana sayfa navigasyonunu ezer; menu yine kapatılır.",
                        en: "Overrides default home navigation; the menu is still closed.",
                    },
                    type: "function",
                },
            }}
        />
    </Ds.page>
);

export default X;
