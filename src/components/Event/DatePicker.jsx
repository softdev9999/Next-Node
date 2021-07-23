import classname from "classnames";
import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 0,
        background: theme.gradients.create("333.61", `${theme.palette.primary.main} 0%`, `${theme.palette.primary.lightest} 100%`)
    },
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
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: ".5rem",
            background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        "&:before": {
            content: "''",
            background: `gradient(linear, left top, right top, from(${theme.palette.scener.blackberry}), to(${theme.palette.scener.gradientDark}))`,
            backgroundClip: " padding-box",
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
        zIndex: 4
    },
    disabled: {},
    focused: {},
    toolbarContainer: {
        minHeight: theme.functions.rems(100),
        padding: theme.spacing(2, 2.5),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    toolbarLabel: {
        fontSize: theme.functions.rems(10),
        letterSpacing: 0.4,
        lineHeight: theme.spacing(2),
        textTransform: "uppercase"
    },
    toolbarValue: {
        fontSize: theme.functions.rems(24),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    leftIconButton: {
        position: "absolute",
        right: theme.functions.rems(55),
        width: theme.functions.rems(30),
        height: theme.functions.rems(30),
        padding: 0
    },
    rightIconButton: {
        position: "absolute",
        right: theme.functions.rems(20),
        width: theme.functions.rems(30),
        height: theme.functions.rems(30),
        padding: 0
    }
}));
const ToolbarComponent = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.toolbarContainer}>
            <Typography className={classes.toolbarLabel}>Select Date</Typography>
            <Typography className={classes.toolbarValue}>{props.date.format("dddd, MMM DD")}</Typography>
        </div>
    );
};
const CustomDatePicker = ({ error, isTransparent, selectedValue, onChange }) => {
    const classes = useStyles();
    const hasError = error && error.length > 0;
    return (
        <DatePicker
            label="event date"
            fullWidth
            required
            autoOk={true}
            inputVariant="outlined"
            minDate={Date.now()}
            minDateMessage="Please choose a future date."
            variant="inline"
            format="ddd, MMM DD, YYYY"
            value={selectedValue}
            error={hasError}
            helperText={error}
            onChange={onChange}
            leftArrowButtonProps={{
                classes: {
                    root: classes.leftIconButton
                }
            }}
            rightArrowButtonProps={{
                classes: {
                    root: classes.rightIconButton
                }
            }}
            PopoverProps={{
                classes: {
                    paper: classes.paper
                }
            }}
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
            ToolbarComponent={ToolbarComponent}
        />
    );
};

CustomDatePicker.propTypes = {
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    selectedValue: PropTypes.instanceOf(Object),
    onChange: PropTypes.func
};

CustomDatePicker.defaultProps = {
    error: "",
    selectedValue: {},
    onChange: () => {}
};

export default CustomDatePicker;
