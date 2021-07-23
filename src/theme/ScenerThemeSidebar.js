import createScenerTheme from "./ScenerTheme";
const SidebarOverrides = (theme) => {
    theme.typography.fontFamily = "Overpass, Roboto, sans-serif";
    const {
        spacingUnit,
        functions: { rems }
    } = theme;
    theme.palette.secondary.main = "#7337A8";
    theme.typography.body1 = {
        fontSize: rems(16),
        fontWeight: 400,
        letterSpacing: rems(0.5),
        lineHeight: 20 / 16
    };
    theme.typography.body2 = {
        fontSize: rems(14),
        fontWeight: 700,
        letterSpacing: rems(0.5),
        lineHeight: 16 / 14
    };
    theme.typography.button = {
        fontWeight: 700,
        fontSize: rems(12),
        letterSpacing: rems(0.35),
        lineHeight: 14 / 12
    };
    theme.overrides.MuiButton = {
        root: {
            borderRadius: 20000,
            minWidth: 0,

            padding: `${rems(spacingUnit / 2)} ${rems(spacingUnit * 2)}`
        },
        label: {
            ...theme.typography.button,
            textTransform: "uppercase",
            whiteSpace: "nowrap"
        },
        sizeSmall: { padding: `${rems(spacingUnit / 2)} ${rems(spacingUnit * 2)}` },
        sizeLarge: { padding: `${rems(spacingUnit / 2)} ${rems(spacingUnit * 2)}` },
        contained: {
            borderWidth: rems(2),
            borderColor: "transparent",
            borderStyle: "solid"
        },
        outlined: {
            borderWidth: rems(2),
            borderColor: "rgba(255,255,255,.5)",
            padding: `${rems(spacingUnit / 2)} ${rems(spacingUnit)}`
        },
        text: {
            padding: `${rems(spacingUnit / 2)} ${rems(spacingUnit)}`
        },
        outlinedPrimary: {
            color: theme.palette.text.primary
        },
        outlinedSecondary: {
            color: theme.palette.text.primary
        }
    };
    theme.overrides.MuiPopover.paper.backgroundImage = null;
    theme.overrides.MuiPopover.paper.backgroundColor = theme.palette.primary.dark;
    theme.overrides.MuiPopover.paper.borderRadius = 0;

    theme.overrides.MuiDialog.paper.backgroundImage = null;
    theme.overrides.MuiDialog.paper.backgroundColor = theme.palette.primary.dark;
    theme.overrides.MuiDialog.paper.borderRadius = 0;
    theme.overrides.MuiDialog.paperWidthXs = {
        width: "calc(100vw - 1rem)",
        maxWidth: "calc(100vw - 1rem)"
    };

    return theme;
};

export default createScenerTheme(SidebarOverrides);
