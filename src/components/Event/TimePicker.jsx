import classname from "classnames";
import React from "react";
import PropTypes from "prop-types";
import PickerToolbar from "@material-ui/pickers/_shared/PickerToolbar";
import ToolbarButton from "@material-ui/pickers/_shared/ToolbarButton";
import { TimePicker } from "@material-ui/pickers";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
    focused: {},
    toolbarContainer: {
        minHeight: theme.functions.rems(100),
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
    hourMinuteContainer: {
        display: "flex",
        alignItems: "center",
        paddingLeft: theme.spacing(6)
    },
    hourMinuteLabel: {
        display: "flex"
    },
    ampmSelection: {
        display: "flex",
        flexDirection: "column",
        paddingLeft: theme.spacing(2)
    },
    toolbarHour: {
        fontFamily: "Overpass",
        fontSize: theme.functions.rems(44),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(48),
        color: theme.palette.common.white,
        marginRight: theme.spacing(1)
    },
    toolbarMinutes: {
        fontFamily: "Overpass",
        fontSize: theme.functions.rems(44),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(48),
        color: theme.palette.common.white,
        marginLeft: theme.spacing(1)
    },
    toolbarSeparate: {
        fontFamily: "Overpass",
        fontSize: theme.spacing(2)
    },
    toolbarMeridiem: {
        fontFamily: "Overpass",
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.29,
        lineHeight: theme.functions.rems(24),
        color: theme.palette.common.white
    },
    selected: {
        color: theme.functions.rgba(theme.palette.common.white, 0.54)
    }
}));

const ToolbarComponent_ = ({ date, isLandscape, setOpenView, title }) => {
    const classes = useStyles();
    const handleChangeViewClick = (view) => () => {
        setOpenView(view);
    };
    return (
        <PickerToolbar className={classes.toolbarContainer} title={title} isLandscape={isLandscape}>
            <Typography className={classes.toolbarLabel}>Select Time</Typography>
            <div className={classes.hourMinuteContainer}>
                <div className={classes.hourMinuteLabel}>
                    <ToolbarButton
                        disableRipple
                        onClick={handleChangeViewClick("hours")}
                        component="h2"
                        variant="h2"
                        label={date.format("hh")}
                        typographyClassName={classes.toolbarHour}
                    />
                    <Typography component="h2" variant="h2">
                        :
                    </Typography>
                    <ToolbarButton
                        disableRipple
                        onClick={handleChangeViewClick("minutes")}
                        component="h2"
                        variant="h2"
                        label={date.format("mm")}
                        typographyClassName={classes.toolbarMinutes}
                    />
                </div>
                <div className={classes.ampmSelection}>
                    <ToolbarButton
                        disableRipple
                        variant="subtitle2"
                        typographyClassName={classname(classes.toolbarMeridiem, {
                            [classes.selected]: date.format("A") === "AM"
                        })}
                        label="AM"
                    />
                    <ToolbarButton
                        disableRipple
                        variant="subtitle2"
                        typographyClassName={classname(classes.toolbarMeridiem, {
                            [classes.selected]: date.format("A") === "PM"
                        })}
                        label="PM"
                    />
                </div>
            </div>
        </PickerToolbar>
    );
};
const CustomTimePicker = ({ error, isTransparent, selectedValue, onChange }) => {
    const classes = useStyles();
    const hasError = error && error.length > 0;
    return (
        <TimePicker
            label="event time"
            required
            fullWidth
            autoOk={true}
            inputVariant="outlined"
            variant="inline"
            error={hasError}
            helperText={error}
            value={selectedValue}
            onChange={onChange}
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
        />
    );
};

CustomTimePicker.propTypes = {
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    selectedValue: PropTypes.instanceOf(Object),
    onChange: PropTypes.func
};

CustomTimePicker.defaultProps = {
    error: "",
    selectedValue: {},
    onChange: () => {}
};

export default CustomTimePicker;
