import React from "react";
import { makeStyles, TextField, Button } from "@material-ui/core";
//import SegmentedInput from "../SegmentedInput/SegmentedInput";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column"
    },
    appBar: {
        position: "relative",
        background: "transparent"
    },
    toolbar: {
        minHeight: theme.functions.rems(65)
    },
    headerContainer: {},
    title: {
        marginLeft: theme.spacing(3),
        flex: 1,
        fontSize: theme.functions.rems(20),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    subTitle: {
        marginLeft: theme.spacing(3)
    },
    divider: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)"
    },
    content: {
        padding: theme.spacing(6, 6, 0)
    },
    actions: {
        margin: theme.spacing(4, 0, 6),
        flexDirection: "column",
        marginLeft: 0,
        "& > :first-child": {
            marginBottom: theme.spacing(3)
        },
        "& > :not(:first-child)": {
            marginLeft: 0
        }
    },
    forgotButton: {
        "&:hover,&:focus,&:active": {
            background: "transparent"
        }
    },
    buttonLabel: {
        fontSize: theme.functions.rems(14),
        letterSpacing: 0.25,
        fontWeight: 100
    },
    accountButton: {
        minHeight: theme.functions.rems(36),
        border: "none",
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: theme.spacing(6),
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
            borderRadius: theme.spacing(6)
        },
        "& > span": {
            zIndex: 5
        }
    },
    accountButtonLabel: {
        zIndex: 5
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
    shrink: {
        background: theme.palette.scener.blackberry
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
    notchedOutline: {
        border: "none"
    },
    input: {
        padding: theme.functions.rems(18),
        zIndex: 4
    },
    disabled: {},
    focused: {}
}));

const LoginForm = ({
    password,
    setPassword,
    username,
    setUsername,
    usernameError,

    submitForm,
    passwordError,
    onForgotPasswordClicked
}) => {
    const classes = useStyles();

    return (
        <form className={classes.form} onSubmit={submitForm}>
            <TextField
                fullWidth
                label="username, email, or phone"
                variant="outlined"
                placeholder="username, email, or phone"
                autoFocus={true}
                required={true}
                value={username}
                error={!!usernameError}
                helperText={usernameError}
                autoComplete="username"
                onChange={({ target: { value } }) => {
                    setUsername(value.trim());
                }}
                onKeyPress={({ key }) => {
                    if (key == "Enter") {
                        submitForm();
                    }
                }}
                margin="normal"
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
                        input: classes.input,
                        notchedOutline: classes.notchedOutline
                    }
                }}
            />
            <TextField
                fullWidth
                label="password"
                variant="outlined"
                placeholder="password"
                type="password"
                value={password}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete={"current-password"}
                onChange={({ target: { value } }) => {
                    setPassword(value);
                }}
                margin="normal"
                required={true}
                onKeyPress={({ key }) => {
                    if (key == "Enter") {
                        submitForm();
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
                        input: classes.input,
                        notchedOutline: classes.notchedOutline
                    }
                }}
            />
            <Button classes={{ root: classes.forgotButton, label: classes.buttonLabel }} size="small" onClick={onForgotPasswordClicked}>
                Forgot password?
            </Button>
        </form>
    );
};

export default LoginForm;
