import classname from "classnames";
import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    label: {
        fontWeight: 800,
        letterSpacing: 0.29,
        lineHeight: theme.spacing(2.5),
        fontSize: theme.functions.rems(14),
        zIndex: 5,
        padding: theme.spacing(0, 1),
        "&$disabled": {
            color: theme.functions.rgba(theme.palette.common.white, 0.8)
        },
        "&$focused": {
            color: theme.functions.rgba(theme.palette.common.white, 0.6),
            background: theme.palette.scener.blackberry
        }
    },
    transparentLabel: {
        "&$focused": {
            background: theme.functions.rgba(theme.palette.scener.midnight, 0.8)
        }
    },
    shrink: {
        background: theme.palette.scener.blackberry
    },
    transparentShrink: {
        background: theme.functions.rgba(theme.palette.scener.midnight, 0.8)
    },
    labelOutlined: {
        transform: "translate(14px, 14px) scale(1)"
    },
    outlinedInput: {
        height: theme.functions.rems(48),
        alignItems: "center",
        zIndex: 4,
        "&:after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: ".5rem",
            background: theme.gradients.create("56.18", `${theme.palette.scener.supernova} 0%`, `${theme.palette.scener.gradientLight} 100%`)
        },
        "&:before": {
            content: "''",
            background: `gradient(linear, left top, right top, from(${theme.palette.scener.blackberry}), to(${theme.palette.scener.gradientDark}))`,
            backgroundClip: "padding-box",
            border: "solid 2px transparent",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            borderRadius: ".5rem"
        }
    },
    transparentOutline: {
        "&:before": {
            background: theme.functions.rgba(theme.palette.scener.midnight, 0.9),
            backgroundClip: "padding-box"
        }
    },
    notchedOutline: {
        border: "none"
    },
    input: {
        padding: theme.functions.rems(18),
        zIndex: 5
    },
    disabled: {},
    focused: {}
}));

const CustomTextField = ({ label, isTransparent, placeholder, fullWidth, error, onChange, ...props }) => {
    const classes = useStyles();
    const hasError = error && error.length > 0;
    return (
        <TextField
            variant="outlined"
            label={label}
            fullWidth={fullWidth}
            required
            placeholder={placeholder}
            InputLabelProps={{
                classes: {
                    root: classname(classes.label, {
                        [classes.transparentLabel]: isTransparent
                    }),
                    disabled: classes.disabled,
                    focused: classes.focused,
                    outlined: classes.labelOutlined,
                    shrink: classname(classes.shrink, {
                        [classes.transparentShrink]: isTransparent
                    })
                }
            }}
            InputProps={{
                classes: {
                    root: classname(classes.outlinedInput, {
                        [classes.transparentOutline]: isTransparent
                    }),
                    input: classes.input,
                    notchedOutline: classes.notchedOutline
                }
            }}
            error={hasError}
            helperText={error}
            onChange={onChange}
            {...props}
        />
    );
};

CustomTextField.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    fullWidth: PropTypes.bool,
    onChange: PropTypes.func
};

CustomTextField.defaultProps = {
    label: "",
    placeholder: "",
    error: "",
    fullWidth: true,
    onChange: () => {}
};

export default CustomTextField;
