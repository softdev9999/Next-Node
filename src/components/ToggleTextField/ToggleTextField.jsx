import React, { memo, useEffect } from "react";
import classname from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useRef, useState } from "react";
import { TextField, InputAdornment, Button, Grid, Box, Typography } from "@material-ui/core";
import Checkmark from "@material-ui/icons/CheckCircleRounded";
import ErrorIcon from "@material-ui/icons/ErrorOutlineOutlined";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";

const useStyles = makeStyles((theme) => ({
    disabledTextField: {
        color: `${theme.functions.rgba(theme.palette.common.white, 0.8)}!important`
    },
    label: {
        fontWeight: 800,
        letterSpacing: 0.29,
        lineHeight: theme.spacing(2.5),
        maxWidth: "calc(100% - 50px)",
        zIndex: 5,
        padding: theme.spacing(0, 1),
        "&$disabled": {
            color: theme.functions.rgba(theme.palette.common.white, 0.8)
        },
        "&$focused": {
            background: theme.palette.scener.blackberry
        }
    },
    bottomLabel: {
        paddingLeft: theme.spacing(3),
        marginBottom: theme.spacing(2),
        fontSize: theme.functions.rems(12),
        color: theme.functions.rgba(theme.palette.common.white, 0.5)
    },
    labelOutlined: {
        transform: (props) => (props.multiline && "translate(14px, 21px) scale(1)") || "translate(14px, 14px) scale(1)"
    },
    shrink: {
        background: theme.palette.scener.blackberry
    },
    actionButton: {
        padding: theme.spacing(0.25, 1)
    },
    actionsIn: {
        height: "3rem",
        transition: theme.transitions.create("height"),
        overflow: "hidden",
        width: "100%"
    },
    actionsOut: {
        height: "0rem",
        overflow: "hidden",
        transition: theme.transitions.create("height"),
        width: "100%"
    },
    outlinedInput: {
        height: (props) => (props.multiline ? theme.functions.rems(props.height) : theme.functions.rems(48)),
        alignItems: (props) => (props.multiline && "unset") || "center",
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
    notchedOutline: {
        border: "none"
    },
    input: {
        padding: (props) => (props.multiline ? theme.spacing(0, 1) : theme.functions.rems(18)),
        zIndex: 5
    },
    button: {
        minWidth: theme.functions.rems(106),
        textTransform: "capitalize"
    },
    buttonLabel: {
        textTransform: "capitalize"
    },
    buttonMarginRight: {
        marginRight: theme.spacing(1.3)
    },
    buttonMarginTop: {
        marginTop: theme.spacing(2)
    },
    actionButtonContainer: {
        display: "flex",
        height: "100%",
        justifyContent: (props) => (props.showActionRight && "flex-start") || "flex-end",
        alignItems: (props) => (props.showActionRight && "unset") || "center",
        padding: (props) => (props.showActionRight && theme.spacing(2, 3.6, 1.2)) || 0,
        flexDirection: (props) => (props.showActionRight && "column-reverse") || "row"
    },
    errorIcon: {
        height: theme.spacing(4),
        width: theme.spacing(4),
        color: theme.palette.secondary.main
    },
    checkmarkIcon: {
        height: theme.spacing(4),
        width: theme.spacing(4)
    },
    inputAdornment: {
        marginRight: theme.spacing(1)
    },
    disabled: {},
    focused: {},
    clickable: {
        cursor: "pointer !important"
    }
}));

const ActionButtons = ({ showActionRight, editing, error, success, cancel, cancelTitle, dense, saveTitle, save, status }) => {
    const classes = useStyles({ showActionRight });
    return (
        <div className={classes.actionButtonContainer}>
            {((editing && error) || (editing && !success)) && (
                <>
                    <Button
                        className={classname(classes.button, {
                            [classes.buttonMarginRight]: !showActionRight,
                            [classes.buttonMarginTop]: showActionRight
                        })}
                        variant="outlined"
                        onClick={cancel}
                        classes={{ root: dense && classes.actionButton }}
                    >
                        {cancelTitle}
                    </Button>
                    <ButtonWithFeedback
                        variant="contained"
                        color="secondary"
                        onClick={save}
                        classes={{ root: classes.button, label: classes.buttonLabel }}
                        status={status}
                    >
                        {saveTitle}
                    </ButtonWithFeedback>
                </>
            )}
        </div>
    );
};

const ToggleTextField = ({
    children,
    value,
    label,
    bottomLabel,
    placeholder,
    editTitle,
    cancelTitle,
    saveTitle,
    onEdit,
    onSave,
    onCancel,
    saveOnEnter,
    disabled,
    error,
    clearOnEdit,
    startAdornment,
    dense,
    characterLimit,
    showActionRight,
    showAction,
    height,
    focusToggle,
    defaultActive,
    ...props
}) => {
    const classes = useStyles({ height, ...props });
    const inputRef = useRef();
    const [editing, setEditing] = useState(defaultActive);
    const [editingValue, setEditingValue] = useState(value);
    const [success, setSuccess] = useState(false);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        if (value) {
            setEditingValue(value);
        } else {
            setEditingValue("");
        }
    }, [value]);

    useEffect(() => {
        if (focusToggle) {
            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            });
        }
    }, [focusToggle]);

    useEffect(() => {
        if (success) {
            let t = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(t);
        }
    }, [success]);

    const cancel = () => {
        if (value) {
            setEditingValue(value);
        } else {
            setEditingValue("");
        }
        onCancel();
        setEditing(false);
        inputRef.current && inputRef.current.blur();
    };

    const save = () => {
        setStatus("loading");
        let resPromise = onSave(editingValue);
        console.log(resPromise);
        if (resPromise) {
            resPromise
                .then((res) => {
                    console.log(res);
                    if (res == true) {
                        setEditing(false);
                        inputRef.current && inputRef.current.blur();
                        setSuccess(true);
                    }
                    setStatus(null);
                })
                .catch(() => {
                    setStatus("error");
                });
        } else {
            setEditing(false);
            inputRef.current && inputRef.current.blur();
            setSuccess(true);
            setStatus(null);
        }
    };

    const edit = () => {
        if (value) {
            setEditingValue(clearOnEdit ? "" : value);
        } else if (clearOnEdit) {
            setEditingValue("");
        }

        setEditing(true);
        onEdit();

        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        });
    };
    const textFieldCol = (showActionRight && 8) || 12;
    return (
        <Grid container>
            <Grid item xs={textFieldCol}>
                <TextField
                    {...props}
                    label={label}
                    placeholder={placeholder}
                    onClick={() => {
                        if (!editing && !disabled) {
                            edit();
                        } else {
                            requestAnimationFrame(() => {
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            });
                        }
                    }}
                    margin={dense ? "dense" : "normal"}
                    size={dense ? "small" : "medium"}
                    onChange={({ currentTarget }) => {
                        setEditingValue(currentTarget.value.slice(0, characterLimit > 0 ? characterLimit : currentTarget.value.length));
                        if (props.onChange) {
                            props.onChange(currentTarget.value);
                        }
                    }}
                    style={{
                        cursor: !disabled && !editing ? "pointer !important" : "default !important"
                    }}
                    disabled={!editing}
                    error={!!error}
                    value={editingValue}
                    helperText={error ? error : null}
                    inputRef={inputRef}
                    onKeyPress={({ key }) => {
                        if (key == "Enter" && saveOnEnter) {
                            save();
                        }
                    }}
                    InputLabelProps={{
                        classes: {
                            root: classes.label,
                            disabled: classes.disabled,
                            focused: classes.focused,
                            outlined: classes.labelOutlined,
                            shrink: classes.shrink
                        }
                    }}
                    InputProps={{
                        classes: {
                            root: classes.outlinedInput,
                            disabled: classes.disabledTextField,
                            input: classes.input,
                            notchedOutline: classes.notchedOutline
                        },

                        startAdornment: startAdornment ? <InputAdornment className={classes.inputAdornment}>{startAdornment}</InputAdornment> : null,
                        endAdornment: (
                            <InputAdornment>
                                {error && <ErrorIcon className={classes.errorIcon} />}
                                {success && <Checkmark className={classes.checkmarkIcon} />}
                            </InputAdornment>
                        )
                    }}
                />
                {editing && bottomLabel && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" className={classes.bottomLabel}>
                            {bottomLabel}
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {showActionRight && (
                <Grid item xs={4}>
                    <ActionButtons
                        showActionRight={showActionRight}
                        editing={editing}
                        disabled={disabled}
                        error={error}
                        status={status}
                        success={success}
                        cancel={cancel}
                        editTitle={editTitle}
                        cancelTitle={cancelTitle}
                        dense={dense}
                        saveTitle={saveTitle}
                        save={save}
                        edit={edit}
                    />
                </Grid>
            )}
            {children && (
                <Grid item xs={12}>
                    {children && children}
                </Grid>
            )}
            {!showActionRight && showAction && (
                <Box className={editing ? classes.actionsIn : classes.actionsOut}>
                    <Grid item xs={12}>
                        <ActionButtons
                            showActionRight={showActionRight}
                            editing={editing}
                            disabled={disabled}
                            error={error}
                            status={status}
                            success={success}
                            cancel={cancel}
                            editTitle={editTitle}
                            cancelTitle={cancelTitle}
                            dense={dense}
                            saveTitle={saveTitle}
                            save={save}
                            edit={edit}
                        />
                    </Grid>
                </Box>
            )}
        </Grid>
    );
};

ToggleTextField.propTypes = {
    editTitle: PropTypes.string,
    saveTitle: PropTypes.string,
    cancelTitle: PropTypes.string,
    margin: PropTypes.string,
    fullWidth: PropTypes.bool,
    height: PropTypes.number,
    variant: PropTypes.string,
    showActionRight: PropTypes.bool,
    showAction: PropTypes.bool,
    defaultActive: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onEdit: PropTypes.func
};

ToggleTextField.defaultProps = {
    editTitle: "Edit",
    saveTitle: "Save",
    cancelTitle: "Cancel",
    margin: "normal",
    fullWidth: true,
    height: 108,
    variant: "outlined",
    showActionRight: false,
    showAction: true,
    defaultActive: false,
    onCancel: () => {},
    onSave: () => {},
    onEdit: () => {}
};

export default memo(ToggleTextField);
