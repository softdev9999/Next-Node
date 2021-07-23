import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles, TextField, InputAdornment, CircularProgress, DialogContent, DialogActions } from "@material-ui/core";
import { request, updateUser } from "utils/API";

import debounce from "lodash/debounce";
import ErrorIcon from "@material-ui/icons/ErrorOutlineOutlined";
import CheckIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import NotUniqueIcon from "@material-ui/icons/CloseOutlined";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
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
        padding: theme.spacing(3, 6, 3)
    },
    actions: {
        flexDirection: "column",
        marginLeft: 0,
        padding: theme.spacing(4, 6, 8),
        "& > :last-child": {
            marginTop: theme.spacing(3)
        },
        "& > :not(:first-child)": {
            marginLeft: 0
        }
    },
    errorIcon: {
        color: theme.palette.error.main,
        fontSize: "2em"
    },
    successIcon: {
        color: theme.palette.common.white,

        fontSize: "2em"
    },
    backButton: {
        padding: 0,
        "&:hover,&:focus,&:active": {
            background: "transparent"
        }
    },
    iconBackButton: {
        fontSize: theme.functions.rems(20)
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
        "& > .MuiTouchRipple-root-345": {
            zIndex: 5
        }
    },
    accountButtonLabel: {
        zIndex: 5
    },
    dateHelperText: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        fontSize: theme.functions.rems(14),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(18),
        fontWeight: 200,
        paddingLeft: theme.functions.rems(20)
    },
    paragraph: {
        fontSize: theme.functions.rems(14),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(18),
        fontWeight: 200,
        marginBottom: theme.spacing(3)
    },
    link: {
        textDecoration: "underline",
        color: theme.palette.common.white,
        textTransform: "lowercase"
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
        zIndex: 4,
        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0
        }
    },
    inputAdornedEnd: {
        fontSize: theme.functions.rems(12),
        zIndex: 4
    },
    disabled: {},
    focused: {},
    padderZero: {
        paddingBottom: 0
    },
    padderTop: {
        paddingTop: theme.spacing(1)
    }
}));
const ResetPassword = ({ user, reset, onFinished }) => {
    const classes = useStyles();
    //  const router = useRouter;
    const [error_, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const [showUsername, setShowUsername] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [currentChecks, setCurrentChecks] = useState(0);
    const [showPassword, setShowPassword_] = useState(false);
    const usernameUnique = useRef({}).current;
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    useEffect(() => {
        if (user && !user.username) {
            setShowUsername(true);
        }
    }, [user]);

    const submitForm = (e) => {
        console.log({ e });
        e && e.preventDefault();

        if (!validate()) {
            console.log("ERROR!");
            return;
        }

        setStatus("loading");

        updateUser(user.id, { username, resetPassword: password, resetToken: reset })
            .then((res) => {
                console.log(res);
                setStatus("success");

                setTimeout(() => {
                    onFinished(res);
                }, 1000);
            })
            .catch((err) => {
                setStatus("error");
                if (err) {
                    setError(err.message);
                } else {
                    setError("Could not reset password.");
                }
            });
    };
    useEffect(() => {
        setUsernameError(null);

        if (username && username.length >= 4 && validateField({ username })) {
            checkUsername();
        }
    }, [username]);

    const validateField = (field) => {
        if (field.username) {
            return field.username && field.username.length >= 3 && field.username.match(/^[a-zA-Z0-9_.]{3,20}$/gi);
        }

        if (field.password) {
            return field.password && field.password.length >= 8;
        }

        return true;
    };

    const validate = () => {
        let valid = true;
        clearErrors();

        if (!password || !validateField({ password })) {
            setPasswordError("Password must be at least 8 characters long.");
            valid = false;
        }
        if (showUsername && (!username || !validateField({ username }))) {
            setUsernameError('Username must be at least 4 characters long and only contain letters, numbers, "_", or ".".');
            valid = false;
        }

        return valid;
    };
    const clearForm = () => {
        clearErrors();
        setPassword("");
        setUsername("");
    };

    const clearErrors = () => {
        setError(null);

        setPasswordError(null);

        setUsernameError(null);
        //   setUsernameUnique(null);
        // setEmailUnique(null);
    };

    const checkUsername = debounce(
        () => {
            if (typeof usernameUnique[username] === "undefined") {
                usernameUnique[username] = "loading";
                setCurrentChecks((cc) => cc + 1);

                request("/users/check?username=" + username)
                    .then((res) => {
                        if (typeof res.unique !== "undefined") {
                            usernameUnique[res.username] = res.unique;

                            return;
                        } else {
                            usernameUnique[username] = null;
                            return;
                        }
                    })
                    .then(() => {
                        setCurrentChecks((cc) => cc - 1);
                        return;
                    })
                    .catch(() => {
                        setCurrentChecks((cc) => cc - 1);
                        usernameUnique[username] = null;

                        return;
                    });
            }
        },
        1500,
        { leading: false }
    );

    const getUsernameIcon = useCallback(() => {
        if (usernameUnique[username] === false) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <NotUniqueIcon className={classes.errorIcon} />
                </InputAdornment>
            );
        } else if (usernameError) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <ErrorIcon className={classes.errorIcon} />
                </InputAdornment>
            );
        } else if (usernameUnique[username] == "loading") {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <CircularProgress color="inherit" size="2em" />
                </InputAdornment>
            );
        } else if (usernameUnique[username] === true) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <CheckIcon className={classes.successIcon} />
                </InputAdornment>
            );
        } else {
            return null;
        }
    }, [username, usernameUnique, usernameError, currentChecks]);
    return (
        <>
            <DialogContent>
                <form>
                    {showUsername && (
                        <TextField
                            label="username"
                            fullWidth
                            variant={"outlined"}
                            placeholder={"username"}
                            autoComplete={"new-username"}
                            autoFocus={true}
                            error={!!usernameError || usernameUnique[username] === false}
                            helperText={usernameUnique[username] === false ? "Username already in use." : usernameError}
                            value={username}
                            onChange={({ target: { value } }) => {
                                setUsername(value);
                            }}
                            id="username-input"
                            margin={"normal"}
                            required
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
                                },
                                endAdornment: getUsernameIcon()
                            }}
                        />
                    )}
                    <TextField
                        fullWidth
                        label="password"
                        variant={"outlined"}
                        placeholder={"password"}
                        type={showPassword ? "text" : "password"}
                        autoComplete={"new-password"}
                        value={password}
                        error={!!passwordError}
                        helperText={passwordError}
                        onChange={({ target: { value } }) => {
                            setPassword(value);
                        }}
                        id="password-input"
                        margin={"normal"}
                        required
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
                            },
                            endAdornment: passwordError && (
                                <InputAdornment className={classes.inputAdornedEnd}>
                                    <ErrorIcon className={classes.errorIcon} />
                                </InputAdornment>
                            )
                        }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <ButtonWithFeedback color="secondary" variant="contained" onClick={submitForm} status={status} fullWidth onTimeout={setStatus}>
                    Save
                </ButtonWithFeedback>
            </DialogActions>
        </>
    );
};

export default ResetPassword;
