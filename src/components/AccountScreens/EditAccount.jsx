import React, { useState, useEffect, useRef } from "react";
import { useApp } from "hooks/Global/GlobalAppState";

import { makeStyles, Grid, Typography, TextField, Button, Switch, FormControlLabel } from "@material-ui/core";

import ToggleTextField from "components/ToggleTextField/ToggleTextField";

import { normalizePhone, validatePhone } from "utils/phone";
import { sendPhoneVerify, getPhoneVerify } from "utils/API";

const useStyles = makeStyles((theme) => ({
    form: {
        //padding: theme.spacing(1, 2)
    },
    avatar: {
        width: "10rem",
        height: "10rem",
        margin: "auto"
    },
    hero: {
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        cursor: "pointer"
    },
    cssOutlinedInput: {
        "&$cssFocused $notchedOutline": {
            borderColor: "red !important"
        },
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

            background: `linear-gradient(  45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        height: (props) => (props.multiline ? "auto" : 48),

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
    customLabel: {
        background: theme.palette.scener.blackberry,
        padding: "0 10px",
        zIndex: 5
    },
    inputPlace: {
        zIndex: 5
    },
    testing: {
        background: "rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,1)",
        "&:hover": {
            background: "rgba(255,255,255,0.1)"
        }
    }
}));
const EditAccount = ({ title }) => {
    const classes = useStyles();
    const {
        auth: { user, update },
        popups: { deleteAccount }
    } = useApp();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(null);

    const [phoneVerify, setPhoneVerify] = useState("");
    const [phoneVerifyError, setPhoneVerifyError] = useState(null);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(null);

    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [newPasswordRepeatError, setNewPasswordRepeatError] = useState(null);
    const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);

    const [showNewPhoneInput, setShowNewPhoneInput] = useState(false);

    const [error, setError] = useState(null);
    const [loading_, setLoading] = useState(false);

    const phoneVerifyRef = useRef();

    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    useEffect(() => {
        if (user) {
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setUsername(user.username || "");
            setPassword("********");
            setNewPasswordRepeat("");
            setNewPassword("");
        }
    }, [user]);

    const saveField = (field) => {
        if (!validate(field)) {
            console.log("ERROR!");
            return Promise.resolve(false);
        }
        setLoading(true);

        let updates = field;

        return update(updates)
            .then((res) => {
                console.log(res);
                setLoading(false);
                setShowNewPasswordInput(false);

                return true;
            })
            .catch((e) => {
                setLoading(false);
                setError(e.message);

                return false;
            });
    };

    const checkPhone = (val) => {
        if (val && val.length >= 8) {
            let phoneNormalized = normalizePhone(val);

            if (phoneVerify && phoneVerify.length >= 6) {
                setLoading(true);

                return getPhoneVerify(phoneNormalized, phoneVerify)
                    .then((res) => {
                        setLoading(false);

                        if (res && res.status && res.status == "approved") {
                            setShowNewPhoneInput(false);
                            setPhoneVerify("");

                            return saveField({ phone: phoneNormalized });
                        } else {
                            setPhoneVerifyError("Invalid verification code. Please check and try again.");
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        setPhoneVerifyError("Invalid verification code. Please check and try again.");
                    });
            } else {
                if (validatePhone(phoneNormalized)) {
                    setLoading(true);
                    return sendPhoneVerify(phoneNormalized).then((res) => {
                        setLoading(false);
                        if (res && res.status) {
                            setShowNewPhoneInput(true);
                            setTimeout(() => {
                                requestAnimationFrame(() => {
                                    if (phoneVerifyRef.current) {
                                        phoneVerifyRef.current.focus();
                                    }
                                });
                            }, 500);
                        } else {
                            setPhoneError("Could not verify phone number. Please try again later.");
                        }

                        return false;
                    });
                } else {
                    setShowNewPhoneInput(false);
                    setPhoneError("Invalid phone number.");
                }
            }
        } else {
            setPhoneError("Invalid phone number.");
        }

        return Promise.resolve(false);
    };

    const validate = (field) => {
        console.log("save field", field);
        let valid = true;
        clearErrors();
        if (!field) {
            return false;
        }

        if (field.username && (field.username.length < 3 || !field.username.match(/^[a-zA-Z0-9_.]{3,20}$/gi))) {
            setUsernameError('Username must be at least 4 characters long and only contain letters, numbers, "_", or ".".');

            valid = false;
        }
        if (field.email && !field.email.match(/^.+@([\w-]+\.)+[\w-]{2,6}$/gi)) {
            setEmailError("Invalid email.");
            valid = false;
        }
        if (field.phone && !validatePhone(field.phone)) {
            setPhoneError("Invalid phone number.");
            valid = false;
        }

        if (field.newPassword) {
            if (!field.password) {
                setPasswordError("Enter your current password.");
                valid = false;
            }
            if (!field.newPasswordRepeat || field.newPasswordRepeat != field.newPassword) {
                setNewPasswordRepeatError("New passwords must match.");
                valid = false;
            }
            if (field.newPassword.length < 8 && field.newPassword != "********") {
                setNewPasswordError("Password must be at least 8 characters long.");
            }
        }

        return valid;
    };

    const clearForm = () => {
        clearErrors();
        if (user) {
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setUsername(user.username || "");
            setPassword("");
            setNewPassword("");

            setNewPasswordRepeat("");
        }
    };

    const clearErrors = () => {
        setError(null);
        setUsernameError(null);

        setEmailError(null);
        setPhoneError(null);
        setPhoneVerifyError(null);
        setPasswordError(null);
        setNewPasswordError(null);
        setNewPasswordRepeatError(null);
    };

    return (
        <Grid container spacing={1} alignItems="center" justify="center" direction="column">
            <Grid item container xs={12} spacing={2}>
                {title && (
                    <Grid item xs={12}>
                        <Typography align="center" variant="h3">
                            {title}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    {error && (
                        <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                            {error}
                        </Typography>
                    )}
                </Grid>
                {
                    <Grid item xs={12}>
                        <form className={classes.form}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <ToggleTextField
                                        placeholder={"username"}
                                        autoComplete={"new-username"}
                                        label={"Username"}
                                        error={!!usernameError}
                                        helperText={usernameError}
                                        value={username}
                                        saveOnEnter={true}
                                        onSave={(val) => {
                                            return saveField({ username: val });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ToggleTextField
                                        placeholder={"email address"}
                                        autoComplete={"email"}
                                        label={"Email"}
                                        value={email}
                                        error={emailError}
                                        saveOnEnter={true}
                                        onSave={(val) => {
                                            return saveField({ email: val });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ToggleTextField
                                        placeholder={"phone number"}
                                        type={"tel"}
                                        label={"phone number"}
                                        value={phone}
                                        error={phoneError}
                                        disabled={showNewPhoneInput}
                                        saveOnEnter={false}
                                        onCancel={() => {
                                            setShowNewPhoneInput(false);
                                            setPhoneError(null);
                                            setPhoneVerifyError(null);
                                        }}
                                        onSave={(val) => {
                                            //return saveField({ phone: val, phoneVerify });
                                            return checkPhone(val);
                                        }}
                                        autoComplete={"phone"}
                                    >
                                        {showNewPhoneInput && (
                                            <TextField
                                                fullWidth
                                                label={"Verification code"}
                                                variant={"outlined"}
                                                placeholder={"enter verification code"}
                                                type={"text"}
                                                required
                                                value={phoneVerify}
                                                error={!!phoneVerifyError}
                                                helperText={phoneVerifyError}
                                                onChange={({ target: { value } }) => {
                                                    setPhoneVerify(value);
                                                }}
                                                margin={"normal"}
                                                onKeyPress={({ key }) => {
                                                    if (key == "Enter") {
                                                        //saveField({ phone: phone, phoneVerify: phoneVerify });
                                                    }
                                                }}
                                                inputRef={phoneVerifyRef}
                                                inputProps={{ className: classes.inputPlace }}
                                                InputLabelProps={{
                                                    classes: {
                                                        root: classes.customLabel
                                                    },
                                                    required: false
                                                }}
                                                InputProps={{
                                                    classes: {
                                                        root: classes.cssOutlinedInput,
                                                        notchedOutline: classes.notchedOutline
                                                    }
                                                }}
                                            />
                                        )}
                                    </ToggleTextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <ToggleTextField
                                        placeholder={"••••••••"}
                                        clearOnEdit={true}
                                        type={"password"}
                                        label={"Current password"}
                                        value={password}
                                        error={passwordError}
                                        saveOnEnter={true}
                                        onEdit={() => {
                                            setShowNewPasswordInput(true);
                                        }}
                                        onCancel={() => {
                                            setShowNewPasswordInput(false);
                                        }}
                                        onSave={(val) => {
                                            return saveField({ password: val, newPassword, newPasswordRepeat });
                                        }}
                                        onFocus={() => {
                                            if (password.match(/^\**$/gi)) {
                                                //  setPassword("");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (password.length == 0) {
                                                //  setPassword("********");
                                            }
                                        }}
                                        autoComplete={"current-password"}
                                    >
                                        {showNewPasswordInput && (
                                            <>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label={"New password"}
                                                        variant={"outlined"}
                                                        placeholder={"••••••••"}
                                                        type={"password"}
                                                        value={newPassword}
                                                        error={!!newPasswordError}
                                                        helperText={newPasswordError}
                                                        autoComplete={"new-password"}
                                                        onChange={({ target: { value } }) => {
                                                            setNewPassword(value);
                                                        }}
                                                        margin={"normal"}
                                                        required={true}
                                                        onKeyPress={({ key }) => {
                                                            if (key == "Enter") {
                                                                saveField({ password, newPassword, newPasswordRepeat });
                                                            }
                                                        }}
                                                        inputProps={{ className: classes.inputPlace }}
                                                        InputLabelProps={{
                                                            classes: {
                                                                root: classes.customLabel
                                                            },
                                                            required: false
                                                        }}
                                                        InputProps={{
                                                            classes: {
                                                                root: classes.cssOutlinedInput,
                                                                notchedOutline: classes.notchedOutline
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label={"Re-type new password"}
                                                        variant={"outlined"}
                                                        placeholder={"••••••••"}
                                                        type={"password"}
                                                        value={newPasswordRepeat}
                                                        error={!!newPasswordRepeatError}
                                                        helperText={newPasswordRepeatError}
                                                        autoComplete={"new-password"}
                                                        onChange={({ target: { value } }) => {
                                                            setNewPasswordRepeat(value);
                                                        }}
                                                        margin={"normal"}
                                                        required={true}
                                                        onKeyPress={({ key }) => {
                                                            if (key == "Enter") {
                                                                saveField({ password, newPassword, newPasswordRepeat });
                                                            }
                                                        }}
                                                        inputProps={{ className: classes.inputPlace }}
                                                        InputLabelProps={{
                                                            classes: {
                                                                root: classes.customLabel
                                                            },
                                                            required: false
                                                        }}
                                                        InputProps={{
                                                            classes: {
                                                                root: classes.cssOutlinedInput,
                                                                notchedOutline: classes.notchedOutline
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                    </ToggleTextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                                        control={
                                            <Switch
                                                //    disabled={loading}
                                                color="secondary"
                                                checked={!user.unsubscribed}
                                                onChange={() => {
                                                    saveField({ unsubscribed: !user.unsubscribed });
                                                }}
                                            />
                                        }
                                        label="Receive news and announcement emails"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        style={{ marginBottom: "1rem" }}
                                        control={
                                            <Switch
                                                color="secondary"
                                                checked={!user.hidden}
                                                onChange={() => {
                                                    saveField({ hidden: user.hidden ? "" : "|featured" });
                                                }}
                                            />
                                        }
                                        label="Show featured button on streaming service sites"
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                                    <Button
                                        variant="contained"
                                        classes={{ root: classes.testing }}
                                        fullWidth={true}
                                        onClick={() => deleteAccount.show(true)}
                                    >
                                        Delete Account
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                }
            </Grid>
        </Grid>
    );
};

export default EditAccount;
