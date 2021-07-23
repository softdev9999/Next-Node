import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import gray from "@material-ui/core/colors/grey";
import transitions from "@material-ui/core/styles/transitions";

/*eslint no-debugger: "warn"*/
const createScenerTheme = (overrideFn = (a) => a, baseFontSize = 16) => {
    // let baseVw = (baseFontSize * 100) / 375;
    const spacingUnit = baseFontSize / 2;

    const px = (rems = 1) => {
        return baseFontSize * rems;
    };

    const rems = (p) => {
        if (isNaN(p)) {
            p = parseInt(("" + p).replace(/px/gi, ""), 10);
        }
        return "".concat(p / baseFontSize, "rem");
    };
    const rgba = (hexColor, a = 1) => {
        if (hexColor.indexOf("#") === 0) {
            hexColor = hexColor.substring(1);
        }
        if (hexColor.length == 3) {
            hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
        }
        let r = parseInt(hexColor.substring(0, 2), 16);
        let g = parseInt(hexColor.substring(2, 4), 16);
        let b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r},${g},${b},${a})`;
    };

    //helper functions for css
    const functions = { rgba, px, rems };
    const scenerColors = {
        eclipse: "#09061F",
        cloud: "#ffffff",
        midnight: "#100835",
        supernova: "#9013FE",
        purple: "#450082",
        blackberry: "#390354",
        pink: "#F604FF",
        gold: "#FFB81C",
        red: "#FF0000",

        gradientLight: "#5105FF",
        gradientDark: "#270670",
        secondaryText: "#8E8C99"
    };
    const palette = {
        type: "dark",
        scener: scenerColors,
        background: {
            default: scenerColors.eclipse
        },
        common: {
            black: scenerColors.eclipse,
            white: scenerColors.cloud
        },
        primary: {
            darkest: scenerColors.midnight,
            dark: scenerColors.blackberry,
            main: scenerColors.supernova,
            light: scenerColors.purple,
            lightest: scenerColors.gradientLight
        },
        secondary: {
            main: scenerColors.pink,
            light: scenerColors.gradientDark
        },
        gray: {
            light: gray[100],
            main: gray[400],
            dark: gray[600]
        },
        error: {
            main: scenerColors.pink
        },
        dangerous: {
            main: scenerColors.red
        },
        warning: {
            main: scenerColors.gold
        },
        //   info: {},
        success: {
            main: "#6D08FF"
        },
        text: {
            primary: scenerColors.cloud,
            secondary: scenerColors.secondaryText
        }
    };

    //All the colors
    //the main gradient for online stuff
    const gradients = {
        create: (angle, ...colors) => {
            return `linear-gradient(${angle}deg,${colors.join(",")})`;
        },
        dark: `linear-gradient(90deg,${palette.primary.dark}, ${palette.scener.gradientDark})`,
        light: `linear-gradient(90deg,${palette.primary.main}, ${palette.primary.lightest})`
    };

    //Typography settings (font sizes based off baseFontSize)
    //font weights
    /*
        overpass
        400 normal
        600 bold
        700 also bold?
        800 extra bold

        montserrat
        500 normal
        700 bold
    */
    const montserrat = ["Montserrat", "Overpass", "Roboto", "sans-serif"].join(",");
    const overpass = ["Overpass", "Roboto", "sans-serif"].join(",");
    const typography = {
        htmlFontSize: 16,
        fontWeightLight: 400,
        fontWeightRegular: 600,
        fontWeightMedium: 700,
        fontWeightBold: 800,
        fontFamily: overpass,
        h1: {
            fontFamily: montserrat,
            fontSize: rems(40),
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 42 / 40
        },
        h2: {
            fontFamily: overpass,
            fontWeight: 800,
            fontSize: rems(24),
            letterSpacing: 0,
            lineHeight: 28 / 24
        },
        h3: {
            fontFamily: overpass,
            fontWeight: 800,
            fontSize: rems(20),
            letterSpacing: rems(0.35),
            lineHeight: 24 / 20
        },
        h4: {
            fontFamily: overpass,
            fontWeight: 400,
            fontSize: rems(18),
            letterSpacing: rems(0.35),
            lineHeight: 24 / 18
        },
        h5: {
            fontFamily: overpass,
            fontWeight: 700,
            fontSize: rems(16),
            letterSpacing: 0,
            lineHeight: 24 / 16
        },
        h6: {
            fontFamily: overpass,
            fontWeight: 400,
            fontSize: rems(14),
            letterSpacing: rems(0.3),
            lineHeight: 24 / 16
        },
        subtitle1: {
            fontFamily: overpass,
            fontWeight: 700,
            fontSize: rems(14),
            letterSpacing: rems(0),
            lineHeight: 20 / 14
        },
        subtitle2: {
            fontFamily: overpass,
            fontWeight: 700,
            fontSize: rems(16),
            letterSpacing: rems(0.3),
            lineHeight: 20 / 16
        },
        body1: {
            fontFamily: overpass,
            fontWeight: 600,
            fontSize: rems(16),
            letterSpacing: rems(0.3),
            lineHeight: 20 / 16
        },
        body2: {
            fontFamily: overpass,
            fontWeight: 400,
            fontSize: rems(14),
            letterSpacing: rems(0),
            lineHeight: 20 / 14
        },
        button: {
            fontFamily: overpass,
            fontWeight: 700,
            fontSize: rems(14),
            letterSpacing: rems(0.35),
            lineHeight: 20 / 14
        },
        caption: {
            fontFamily: overpass,
            fontWeight: 400,
            fontSize: rems(11),
            fontStyle: "italics",
            letterSpacing: rems(0.4),
            lineHeight: 16 / 11
        },
        overline: {
            fontFamily: overpass,
            fontWeight: 400,
            fontSize: rems(10),
            letterSpacing: rems(0.4),
            lineHeight: 12 / 10
        }
    };

    //status color mapping

    //class overrides
    const overrides = {
        MuiCssBaseline: {
            "@global": {
                "@font-face": ["Overpass", "Roboto", "sans-serif"].join(",")
            }
        },
        MuiTypography: {
            root: {
                //   color: palette.text.primary,
                //       flex: "0 1 100%",
                maxWidth: "100%"
            }
        },
        MuiLink: {
            root: {
                //  color: palette.secondary.main
            }
        },
        MuiAvatar: {
            root: {
                height: rems(60),
                width: rems(60)
            }
        },
        MuiMenu: {
            paper: {
                backgroundColor: palette.primary.dark
            },
            list: {
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: "transparent"
            }
        },
        MuiMenuItem: {
            root: {
                flex: "0 1 100%",
                paddingTop: rems(spacingUnit),
                paddingBottom: rems(spacingUnit),
                fontSize: rems(14),
                color: palette.text.primary,
                backgroundColor: "transparent",
                "&:hover": {
                    backgroundColor: rgba(palette.common.black, 0.6),
                    color: palette.text.primary
                }
            },
            gutters: {
                paddingLeft: rems(spacingUnit * 2),
                paddingRight: rems(spacingUnit * 2)
            }
        },
        MuiList: {
            root: {
                width: "100%"
            },
            padding: {
                paddingTop: rems(spacingUnit),
                paddingBottom: rems(spacingUnit)
            }
        },

        MuiListItemText: {
            inset: {
                "&:first-child": {
                    paddingLeft: rems(spacingUnit * 8)
                }
            }
        },
        MuiListItemAvatar: {
            root: {
                minWidth: rems(76)
            }
        },
        MuiDivider: {
            root: {
                backgroundColor: palette.primary.main
            },
            light: {
                backgroundColor: "rgba(255, 255, 255, 0.3)"
            }
        },
        MuiListItem: {
            divider: {
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
            },
            secondaryAction: {
                paddingRight: "8rem"
            }
        },
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: palette.common.black
            }
        },
        MuiButton: {
            root: {
                borderRadius: 20000,
                minWidth: 0,

                padding: `${rems(spacingUnit)} ${rems(spacingUnit * 2)}`
            },
            label: {
                ...typography.button,
                lineHeight: 16 / 14,
                textTransform: "none",
                whiteSpace: "nowrap"
            },
            sizeSmall: {},
            sizeLarge: {},
            contained: {
                padding: `${rems(spacingUnit + 2)} ${rems(spacingUnit * 2 + 2)}`
            },
            outlined: {
                padding: `${rems(spacingUnit)} ${rems(spacingUnit * 2)}`,
                border: rems(2) + " solid " + functions.rgba(palette.common.white, 0.5),

                "&:hover": {
                    border: rems(2) + " solid " + functions.rgba(palette.common.white, 0.7)
                }
            },
            text: {
                padding: `${rems(spacingUnit)} ${rems(spacingUnit * 2)}`
            },
            outlinedPrimary: {
                color: palette.text.primary,
                border: rems(2) + " solid " + rgba(palette.scener.supernova, 0.8),

                "&:hover": {
                    border: rems(2) + " solid " + rgba(palette.scener.supernova, 1)
                }
            },
            outlinedSecondary: {
                color: palette.text.primary,
                border: rems(2) + " solid " + rgba(palette.scener.pink, 0.8),
                "&:hover": {
                    border: rems(2) + " solid " + rgba(palette.scener.pink, 1)
                }
            }
        },
        MuiIconButton: {
            root: {
                padding: rems(12),
                fontSize: rems(20)
            }
        },
        MuiSlider: {
            rail: {
                backgroundColor: "white"
            },
            track: {
                backgroundColor: "white"
            },
            thumb: {
                backgroundColor: "white"
            }
        },
        MuiSvgIcon: {
            root: {
                fontSize: "1em"
                // color: palette.common.white
            }
        },
        MuiTextField: {
            root: {
                color: palette.common.white
            }
        },
        MuiCheckbox: {
            root: {
                color: palette.common.white
            }
        },
        MuiFormLabel: {
            colorSecondary: {
                color: palette.text.primary + " !important"
            }
        },
        MuiInputLabel: {
            root: {
                fontWeight: "bold",
                color: palette.text.secondary,
                "&$focused": {
                    color: palette.text.primary
                }
            },
            filled: {
                color: palette.text.secondary
            }
        },
        MuiInput: {
            root: {}
        },
        MuiPrivateNotchedOutline: {
            root: {
                borderColor: palette.common.white,
                "&:focused": {
                    borderColor: palette.common.white
                }
            }
        },
        MuiInputBase: {
            input: {
                "&::-webkit-input-placeholder": {
                    color: "currentColor",
                    opacity: 0.7
                }
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: ".5rem",
                borderColor: palette.common.white,
                borderWidth: ".125rem",

                transition: transitions.create(["border-color"]),
                "&$focused $notchedOutline": {
                    borderColor: palette.common.white,
                    borderWidth: ".125rem",
                    transition: transitions.create(["border-color"])
                },
                "& $notchedOutline": {
                    borderWidth: ".125rem",

                    borderColor: palette.common.white,
                    transition: transitions.create(["border-color"])
                },
                "&$disabled $notchedOutline": {
                    borderWidth: ".125rem",

                    borderColor: "rgba(255,255,255,.6)",
                    transition: transitions.create(["border-color"])
                },
                "&:hover $notchedOutline": {
                    borderColor: "inherit",
                    transition: transitions.create(["border-color"])
                },
                "&$focused:hover $notchedOutline": {
                    borderColor: palette.common.white,
                    transition: transitions.create(["border-color"])
                }
            },
            notchedOutline: {
                transition: transitions.create(["border-color"]),
                //   borderColor: palette.common.white
                "&:hover": {
                    //borderColor: palette.primary.main
                }
            },
            colorSecondary: {
                borderColor: palette.primary.main,
                transition: transitions.create(["border-color"]),

                "& $notchedOutline": {
                    borderColor: palette.primary.main,
                    transition: transitions.create(["border-color"])
                },
                "&$focused $notchedOutline": {
                    borderColor: palette.common.white,
                    borderWidth: ".125rem",
                    transition: transitions.create(["border-color"])
                },
                "&:hover $notchedOutline": {
                    borderColor: "inherit",
                    transition: transitions.create(["border-color"])
                }
            }
        },
        MuiFilledInput: {
            root: {
                
            }
        },
        MuiSelect: {
            select: {
                width: "100%"
            }
        },
        MuiGrid: {
            container: {
                margin: 0
            }
        },
        MuiModal: {
            root: {
                backgroundColor: palette.primary.main
            }
        },
        MuiPopover: {
            root: {},
            paper: {
                backgroundImage: gradients.dark,

                borderRadius: "1rem"
            }
        },
        MuiBackdrop: {
            root: {
                backgroundColor: "rgba(0, 0, 0, 0.8)"
            }
        },

        MuiDialog: {
            root: {},
            paper: {
                backgroundImage: gradients.dark,

                borderRadius: "1rem",
                padding: "0"
            },
            paperWidthXs: {
                width: "350px"
                //  left: "inherit"
            },
            paperWidthSm: {
                width: "400px"
            },
            paperWidthMd: {
                width: "650px"
            },
            paperWidthLg: {
                width: "750px"
            },
            paperWidthXl: {
                width: "1200px"
            }
        },
        MuiDialogActions: {
            root: {
                padding: "1rem 3rem",
                justifyContent: "flex-end",
                "@media (max-width: 400px)": {
                    padding: "1rem 1rem"
                }
            }
        },
        MuiDialogTitle: {
            root: {
                padding: "1rem 3rem 0rem",
                "@media (max-width: 400px)": {
                    padding: "1rem 1rem"
                }
            }
        },
        MuiDialogContent: {
            root: {
                padding: ".5rem 3rem",
                //  padding: `0 ${rems(20)} ${rems(20)}`
                "@media (max-width: 400px)": {
                    padding: ".5rem 1rem"
                }
            }
        },
        MuiTabs: {
            root: {
                zIndex: "1",
                position: "relative",
                width: "100%",
                maxWidth: "100%",
                minHeight: rems(spacingUnit * 4.5),
                backgroundColor: "transparent"
            }
        },

        MuiTab: {
            root: {
                flex: "0 1 100% !important",
                minWidth: rems(spacingUnit * 5) + " !important",
                minHeight: rems(spacingUnit * 4),
                textTransform: "none",
                ...typography.subtitle2
            }
        },

        MuiTooltip: {
            tooltip: {
                fontSize: rems(14),
                color: palette.common.white,
                padding: rems(16),
                backgroundColor: rgba(palette.primary.light, 0.9)
            }
        },
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: "transparent"
            }
        },
        MuiPickersBasePicker: {
            pickerView: {
                backgroundImage: gradients.create("20.97", `${palette.primary.dark} 0%`, "#270670 100%")
            }
        },
        MuiPickersClock: {
            clock: {
                backgroundColor: "rgba(235,238,240, 0.15)"
            }
        },
        MuiPickersCalendarHeader: {
            iconButton: {
                backgroundColor: "transparent"
            },
            transitionContainer: {
                "& > p": {
                    right: "auto",
                    left: rems(23),
                    fontSize: rems(12),
                    letterSpacing: 0.47,
                    lineHeight: rems(18)
                }
            }
        }
    };

    const styles = {
        menuIcon: {
            position: "absolute",
            top: rems(spacingUnit / 2),
            right: rems(spacingUnit),

            color: palette.common.black
        }
    };

    const variables = {
        sidebar: {
            width: {
                px: 375,
                rem: rems(375)
            }
        },
        header: {
            height: {
                px: 64,
                rem: rems(64)
            }
        }
    };
    const breakpoints = {
        values: {
            xs: 0,
            sm: 600,
            md: 974,
            lg: 1100,
            xl: 1296
        }
    };
    let theme = overrideFn({
        breakpoints,
        functions,
        typography,
        palette,
        gradients,
        overrides,
        variables,
        styles,
        spacingUnit
    });

    let muiTheme = createMuiTheme(theme);
    //let _spacing = muiTheme.spacing;
    let remSpacing = (...args) => {
        if (!args || args.length == 0) {
            args = [1];
        }
        return args
            .map((a) => {
                if (a && !isNaN(a)) {
                    return a / 2 + "rem";
                } else if (a === 0) {
                    return "0";
                } else {
                    return "0.5rem";
                }
            })
            .join(" ");
    };
    muiTheme.spacing = remSpacing;
    return muiTheme;
};
export default createScenerTheme;
