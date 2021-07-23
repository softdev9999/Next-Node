import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonBase } from "@material-ui/core";
import FixedRatioBox from "../FixedRatioBox/FixedRatioBox";
import { useCallback } from "react";
const useStyles = makeStyles((theme) => {
    let commonStyles = {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexFlow: "row nowrap",
        borderRadius: "1rem",
        borderWidth: ".125rem",
        borderStyle: "solid",
        padding: theme.spacing(1.25)
    };

    let commonIconStyles = {
        width: "2.75rem",
        height: "2.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: "row nowrap",
        borderRadius: "50%"
    };

    return {
        root: {
            ...commonStyles,
            borderColor: "transparent",
            backgroundColor: theme.functions.rgba(theme.palette.primary.light, 0.7),
            color: theme.palette.text.primary,
            "&:hover": {
                backgroundColor: theme.functions.rgba(theme.palette.primary.light, 1)
            }
        },
        selected: {
            ...commonStyles,
            borderColor: "transparent",
            backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.7),
            color: theme.palette.text.primary,
            "&:hover": {
                backgroundColor: theme.functions.rgba(theme.palette.primary.main, 1)
            }
        },
        disabled: {
            opacity: 0.8
        },
        outlined: {
            ...commonStyles,
            borderColor: theme.palette.primary.light,
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            "&:hover": {
                backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.7)
            }
        },
        selectedOutlined: {
            ...commonStyles,
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.functions.rgba(theme.palette.primary.light, 1),
            color: theme.palette.text.primary,
            "&:hover": {
                backgroundColor: theme.functions.rgba(theme.palette.primary.light, 0.8)
            }
        },
        contentWrapper: {
            paddingRight: theme.spacing(1.25),
            paddingLeft: theme.spacing(1.25),
            flex: "0 1 100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexFlow: "row wrap"
        },
        iconWrapper: {
            flex: "0 0 auto",
            paddingRight: theme.spacing(1.25),
            paddingLeft: theme.spacing(1.25),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: "row nowrap"
        },
        rootIcon: {
            ...commonIconStyles,
            backgroundColor: "rgba(255,255,255,.1)"
        },
        outlinedIcon: {
            ...commonIconStyles,
            backgroundColor: "rgba(255,255,255,.1)"
        },
        selectedIcon: {
            ...commonIconStyles,
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main
        },
        selectedOutlinedIcon: {
            ...commonIconStyles,
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main
        }
    };
});

const BigButton = ({ children, ratioBoxProps, selected, variant, icon, ...others }) => {
    const classes = useStyles();
    const getClassName = useCallback(() => {
        if (variant == "outlined") {
            if (selected) {
                return classes.selectedOutlined;
            } else {
                return classes.outlined;
            }
        } else {
            if (selected) {
                return classes.selected;
            } else {
                return classes.root;
            }
        }
    }, [variant, selected, classes]);

    const getIconInnerClassName = useCallback(() => {
        if (variant == "outlined") {
            if (selected) {
                return classes.selectedOutlinedIcon;
            } else {
                return classes.outlinedIcon;
            }
        } else {
            if (selected) {
                return classes.selectedIcon;
            } else {
                return classes.rootIcon;
            }
        }
    }, [variant, selected, classes]);

    return (
        <FixedRatioBox {...ratioBoxProps}>
            <ButtonBase classes={{ root: getClassName(), disabled: classes.disabled }} {...others}>
                {icon && (
                    <div className={classes.iconWrapper}>
                        <div className={getIconInnerClassName()}>{React.cloneElement(icon, { style: { fontSize: "1.5rem" } })}</div>
                    </div>
                )}
                <div className={classes.contentWrapper}> {children}</div>
            </ButtonBase>
        </FixedRatioBox>
    );
};
BigButton.defaultProps = {
    selected: false,
    ratioBoxProps: { xs: 1 },
    variant: "outlined"
};
export default BigButton;
