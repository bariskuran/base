export const DEFAULT_THEME = {
    background: "#17181c",
    foreground: "#E0E0E0",
    grey: "#3A3A3A",
    primary: "#ffbf00",
    secondary: "#305A7A",
    error: "#803939",
    success: "#146314",
    warning: "#7C5A07",
};

export const makeAntdTheme = (t) => ({
    token: {
        colorPrimary: t.primary,
        colorSuccess: t.success,
        colorWarning: t.warning,
        colorError: t.error,

        colorText: t.foreground,
        colorTextBase: t.foreground,

        colorBgBase: t.background,
        colorBgContainer: t.background,
        colorBorder: t.grey,
    },
});
