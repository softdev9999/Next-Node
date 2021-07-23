import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Typography, TextField, Button, IconButton, DialogContent, Toolbar, Divider, Box } from "@material-ui/core";

import { resetPassword } from "utils/API";
import { normalizePhone, validatePhone } from "utils/phone";
import { sendPhoneVerify, getPhoneVerify } from "utils/API";
import config from "../../config";

import ArrowBack from "@material-ui/icons/ArrowBackIos";
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
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontSize: theme.functions.rems(20),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    divider: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)"
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
    content: {
        padding: theme.spacing(6, 4, 8)
    },
    paragraph: {
        fontSize: theme.spacing(2),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24),
        fontWeight: 200,
        marginBottom: theme.spacing(1)
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
const ForgotPassword = ({ onLoginClicked, onCancel, hideCancel, onFinished, showBackButton }) => {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);

    const [phoneCheck, setPhoneCheck] = useState(false);
    const [phoneVerify, setPhoneVerify] = useState("");
    const [phoneVerifyError, setPhoneVerifyError] = useState(null);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    const onStatusTimeout = () => {
        setStatus(null);
        if (status == "success") {
            onFinished();
        }
    };

    const submitForm = (e) => {
        console.log({ e });
        e && e.preventDefault();

        if (!validate()) {
            console.log("ERROR!");
            return;
        }
        setLoading(true);

        if (validatePhone(email)) {
            let phoneNormalized = normalizePhone(email);

            setPhoneCheck(true);

            if (phoneVerify) {
                return getPhoneVerify(phoneNormalized, phoneVerify, true)
                    .then((res) => {
                        setLoading(false);
                        console.log("** PHONE VERIFY **", res);

                        if (res && res.status && res.status == "approved") {
                            // generate token and route to forget page
                            if (res.crypt) {
                                window.location.href = config.WEB_HOST + "/account/forgot?reset=" + res.crypt;
                            }

                            return false;
                        } else {
                            setPhoneVerifyError("Invalid verification code. Please check and try again.");
                        }
                    })
                    .catch((err) => {
                        console.log("** ERR **", err);
                        setLoading(false);
                        setPhoneVerifyError("Invalid verification code. Please check and try again..");
                    });
            } else {
                return sendPhoneVerify(phoneNormalized).then((res) => {
                    setLoading(false);
                    return false;
                });
            }
        } else {
            resetPassword({ email })
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    setStatus("success");
                })
                .catch((err) => {
                    setError(err.message);

                    setLoading(false);
                });
        }
    };

    const validate = () => {
        let valid = true;
        clearErrors();

        if (validatePhone(email)) {
            return true;
        }

        if (!email || !email.match(/^.+@([\w-]+\.)+[\w-]{2,8}$/gi)) {
            setEmailError("Please enter a valid phone or email");
            valid = false;
        }

        return valid;
    };

    const clearForm = () => {
        clearErrors();
        setEmail("");
    };

    const clearErrors = () => {
        setError(null);
        setEmailError(null);
    };
    return (
        <div className={classes.container}>
            <Box component="div" position="relative" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    {showBackButton && (
                        <IconButton disableRipple className={classes.backButton} onClick={onLoginClicked}>
                            <ArrowBack className={classes.iconBackButton} />
                        </IconButton>
                    )}
                    <Typography variant="h6" className={classes.title}>
                        Forgot password
                    </Typography>
                </Toolbar>
                <Divider component="div" className={classes.divider} />
            </Box>
            <DialogContent className={classes.content}>
                <Grid container alignItems="center" justify="center" direction="column" style={{ overflowY: "hidden" }}>
                    {phoneCheck ? (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="body1" className={classes.paragraph}>
                                    Enter the verification code sent to your phone
                                </Typography>
                                <form className={classes.form} onSubmit={submitForm}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="verification code"
                                        autoFocus={true}
                                        required={true}
                                        value={phoneVerify}
                                        error={!!phoneVerifyError}
                                        helperText={phoneVerifyError}
                                        onChange={({ target: { value } }) => {
                                            setPhoneVerify(value);
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
                                </form>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <ButtonWithFeedback
                                    timeout={5000}
                                    onTimeout={onStatusTimeout}
                                    color="secondary"
                                    variant="contained"
                                    onClick={submitForm}
                                    disabled={loading}
                                    fullWidth
                                    status={status}
                                >
                                    verify code
                                </ButtonWithFeedback>
                            </Grid>
                        </>
                    ) : (
                        <Grid item container xs={12} spacing={2}>
                            {error && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center" style={{ width: "100%" }} color="error">
                                        {error}
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                {status != "success" ? (
                                    <Typography variant="body1" className={classes.paragraph}>
                                        Enter the email address or phone number associated with your account, and we will send you a code to reset
                                        your password.
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" className={classes.paragraph}>
                                        If there is an account associated with this, we will send you a code to reset your password.
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <form className={classes.form} onSubmit={submitForm}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="email / phone number"
                                        autoFocus={true}
                                        required={true}
                                        value={email}
                                        error={!!emailError}
                                        helperText={emailError}
                                        autoComplete="phone"
                                        onChange={({ target: { value } }) => {
                                            setEmail(value);
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
                                </form>
                            </Grid>
                            <Grid item xs={12} container spacing={1} alignItems="center" justify="center" style={{ marginTop: "0.5rem" }}>
                                {!hideCancel && (
                                    <Grid item xs={12} sm={6}>
                                        <Button variant="outlined" color="default" fullWidth onClick={onCancel}>
                                            CANCEL
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={hideCancel ? 12 : 6}>
                                    <ButtonWithFeedback
                                        timeout={5000}
                                        onTimeout={onStatusTimeout}
                                        color="secondary"
                                        variant="contained"
                                        onClick={submitForm}
                                        disabled={loading}
                                        fullWidth
                                        status={status}
                                    >
                                        Send reset code
                                    </ButtonWithFeedback>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
        </div>
    );
};

export default ForgotPassword;
