import { isValidElement, useEffect } from "react";
import { Button } from "../../Button";
import { Visibility } from "../../Visibility";
import { baseStore } from "../../baseStore";
import { t } from "../../getText";
import { setLanguage } from "../../@Base/GlobalDataProvider/resolveLanguage";
import { getPageRrdInfo } from "../../getPageRrdInfo";
import { useNavigate } from "react-router-dom";
import { useScrollTopLeft } from "../../useScrollTopLeft";
import { getLayoutController, useLayout } from "../controllerRegistry";
import { S } from "./_styled";

const DEFAULT_OPEN_ICON_PROPS = {
    icon: "menuStylish",
    hoverIcon: "menuStylishFull",
    activeIcon: "menuStylishFull",
    width: 16,
    flat: true,
};

const DEFAULT_CLOSE_ICON_PROPS = {
    icon: "closeThin",
    hoverIcon: "closeThin",
    activeIcon: "closeThin",
    width: 16,
    flat: true,
};

const LANGUAGE_LABELS = {
    en: "English",
    tr: "Turkish",
};

const LANGUAGE_FLAGS = {
    en: "gb",
    tr: "tr",
};

const resolveLogo = (logo, language, status) => {
    if (!logo || typeof logo !== "object" || isValidElement(logo)) return logo;
    const languageLogo = logo[language];
    if (languageLogo && typeof languageLogo === "object" && !isValidElement(languageLogo)) {
        return languageLogo[status] ?? languageLogo.extended ?? languageLogo.default;
    }
    return languageLogo ?? logo[status] ?? logo.extended ?? logo.default;
};

const HeaderAmedist = ({
    controllerId = "default",
    logo,
    extendedHeight = 100,
    condensedHeight = 50,
    openIconProps = DEFAULT_OPEN_ICON_PROPS,
    closeIconProps = DEFAULT_CLOSE_ICON_PROPS,
    headerColor = "foreground",
    headerBackgroundColor = "background",
    headerBackgroundAlpha = 70,
    hideHeader = false,
    searchPlaceholder,
    onLogoClick,
}) => {
    const controller = useLayout("headerAmedist", { controllerId });
    const controllerApi = getLayoutController("headerAmedist", controllerId);
    const [language, languageList = []] = baseStore.useGlobal((state) => [
        state.language,
        state.languageSettings?.languageList,
    ]);
    const navigate = useNavigate();
    const { scrollTop } = useScrollTopLeft({
        source: typeof window === "undefined" ? undefined : window,
        delay: 80,
    });

    const { menuStatus, searchValue, headerStatus, openMenu, closeMenu, setSearchValue } =
        controller;
    const { setHeaderStatus, setHeaderHeights, hideHeaderFromProp } = controllerApi;
    const internalState = controllerApi.getState?.() || {};
    const visibleStatus =
        headerStatus === "hidden" ? internalState.visibleHeaderStatus : headerStatus;
    const menuActive = menuStatus !== "closed";
    const menuButtonCloses = menuStatus === "open" || menuStatus === "opening";
    const appearance = internalState.headerAppearance || {};
    const effectiveColor =
        menuActive || visibleStatus === "condensed"
            ? "foreground"
            : appearance.headerColor || headerColor;
    const effectiveBackgroundColor = appearance.headerBackgroundColor || headerBackgroundColor;
    const effectiveBackgroundAlpha =
        menuActive || visibleStatus === "condensed"
            ? 70
            : (appearance.headerBackgroundAlpha ?? headerBackgroundAlpha);
    const resolvedLogo = resolveLogo(logo, language, visibleStatus);
    const inputHeight = visibleStatus === "condensed" ? condensedHeight : extendedHeight;
    const nextLanguage = languageList.length
        ? languageList[(Math.max(languageList.indexOf(language), 0) + 1) % languageList.length]
        : null;

    const switchLanguage = () => {
        if (!nextLanguage) return;
        // Same relatives map as project useRelative / getPageRrdInfo (home has none distinct → URL stays "/").
        const { relatives, pathname } = getPageRrdInfo();
        const targetPath = relatives?.[nextLanguage];
        const normalizedTarget =
            targetPath == null || targetPath === ""
                ? null
                : targetPath.startsWith("/")
                  ? targetPath
                  : `/${targetPath}`;
        const currentPath = pathname?.startsWith("/") ? pathname : `/${pathname || ""}`;
        const shouldChangeUrl =
            normalizedTarget != null &&
            normalizedTarget !== currentPath &&
            !(normalizedTarget === "/" && (currentPath === "/" || currentPath === ""));

        setLanguage(nextLanguage, {
            relatives: relatives || undefined,
            // Header navigates via useNavigate so store snapshot navigate is not required.
            navigate: false,
        });

        if (shouldChangeUrl) {
            navigate({ pathname: normalizedTarget, search: window.location.search });
        }
    };

    useEffect(() => {
        setHeaderHeights({ extendedHeight, condensedHeight });
    }, [condensedHeight, extendedHeight, setHeaderHeights]);

    useEffect(() => {
        hideHeaderFromProp(hideHeader);
        return () => hideHeaderFromProp(false);
    }, [hideHeader, hideHeaderFromProp]);

    useEffect(() => {
        if (menuActive) {
            setHeaderStatus("extended");
            return;
        }

        setHeaderStatus(
            visibleStatus === "condensed"
                ? scrollTop >= 25
                    ? "condensed"
                    : "extended"
                : scrollTop > 100
                  ? "condensed"
                  : "extended",
        );
    }, [menuActive, scrollTop, setHeaderStatus, visibleStatus]);

    const goHome = () => {
        closeMenu();
        if (onLogoClick) onLogoClick();
        else navigate("/");
    };

    const logoContent = isValidElement(resolvedLogo) ? (
        resolvedLogo
    ) : resolvedLogo ? (
        <S.logoMask $src={resolvedLogo} role="img" aria-label="logo" />
    ) : null;

    return (
        <S.container
            $status={headerStatus}
            $extendedHeight={extendedHeight}
            $condensedHeight={condensedHeight}
            $headerColor={effectiveColor}
            $headerBackgroundColor={effectiveBackgroundColor}
            $headerBackgroundAlpha={effectiveBackgroundAlpha}
        >
            <S.body
                $status={headerStatus}
                $extendedHeight={extendedHeight}
                $condensedHeight={condensedHeight}
            >
                <div>
                    <S.logoButton
                        type="button"
                        aria-label="Home"
                        onClick={goHome}
                        $status={visibleStatus}
                        $extendedHeight={extendedHeight}
                        $condensedHeight={condensedHeight}
                    >
                        {logoContent}
                    </S.logoButton>
                </div>
                <div />
                <div>
                    <S.input
                        $height={inputHeight}
                        aria-label={searchPlaceholder || t("searchInputPlaceholder")}
                        placeholder={searchPlaceholder || t("searchInputPlaceholder")}
                        value={searchValue}
                        onFocus={openMenu}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>
                <div>
                    <Visibility.mount
                        visible={menuButtonCloses && nextLanguage}
                        content={
                            <Button.amedist
                                label={LANGUAGE_LABELS[nextLanguage] || nextLanguage?.toUpperCase()}
                                onClick={switchLanguage}
                                prefix={{
                                    flag: LANGUAGE_FLAGS[nextLanguage] || nextLanguage,
                                    width: 18,
                                    flat: true,
                                }}
                                flat
                            />
                        }
                    />
                    <Button.plain
                        onClick={menuButtonCloses ? closeMenu : openMenu}
                        icon={{
                            ...(menuButtonCloses ? closeIconProps : openIconProps),
                            color: effectiveColor,
                            hoverColor: effectiveColor,
                            activeColor: effectiveColor,
                        }}
                        bgColor="transparent"
                        hoverBgColor="transparent"
                        activeBgColor="transparent"
                        size={160}
                        flat
                    />
                </div>
            </S.body>
        </S.container>
    );
};

HeaderAmedist.displayName = "Layout.headerAmedist";
HeaderAmedist.layoutControllerName = "headerAmedist";

export default HeaderAmedist;
