import React from "react";
import { makeStyles, TextField, Typography, InputAdornment, CircularProgress } from "@material-ui/core";
//import SegmentedInput from "../SegmentedInput/SegmentedInput";
import ErrorIcon from "@material-ui/icons/ErrorOutlineOutlined";
import CheckIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import NotUniqueIcon from "@material-ui/icons/CloseOutlined";
import { useCallback } from "react";

import dynamic from "next/dynamic";
const MuiPhoneNumber = dynamic(import("material-ui-phone-number"), { ssr: false }); // this plugin doesnt support SSR
import { normalizePhone } from "utils/phone";

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

const CreateAccountForm = ({
    step,

    username,
    usernameUnique,
    usernameError,
    setUsername,
    displayName,
    displayNameError,
    setDisplayName,
    setBirthday,
    birthday,
    birthdayError,

    setEmail,
    email,
    emailUnique,
    emailError,

    setPhone,
    phone,
    phoneUnique,
    phoneError,

    setVerifyPhone,
    verifyPhone,
    verifyPhoneError,

    password,
    passwordError,
    setPassword,
    submitForm,

    currentChecks,
    showPassword
}) => {
    const classes = useStyles();

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

       const getEmailIcon = useCallback(() => {
        if (emailUnique[email] === false) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <NotUniqueIcon className={classes.errorIcon} />
                </InputAdornment>
            );
        } else if (emailError) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <ErrorIcon className={classes.errorIcon} />
                </InputAdornment>
            );
        } else if (emailUnique[email] == "loading") {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <CircularProgress color="inherit" size="2em" />
                </InputAdornment>
            );
        } else if (emailUnique[email] === true) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <CheckIcon className={classes.successIcon} />
                </InputAdornment>
            );
        } else {
            return null;
        }
    }, [email, emailUnique, emailError, currentChecks]);

    /*const getPhoneIcon = useCallback(() => {
        if (phoneUnique[phone] === false) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <NotUniqueIcon className={classes.errorIcon} />
                </InputAdornment>
            );
        } else if (phoneError) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <ErrorIcon className={classes.errorIcon} />
                </InputAdornment>
            );
        } else if (phoneUnique[phone] == "loading") {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <CircularProgress color="inherit" size="2em" />
                </InputAdornment>
            );
        } else if (phoneUnique[phone] === true) {
            return (
                <InputAdornment className={classes.inputAdornedEnd}>
                    <CheckIcon className={classes.successIcon} />
                </InputAdornment>
            );
        } else {
            return null;
        }
    }, [phone, phoneUnique, phoneError, currentChecks]);*/

    const killSubmit = (e) => e.preventDefault() && e.stopPropagation();

    return (
        <>
            {step == 0 && (
                <form onSubmit={killSubmit}>
                    <TextField
                        autoFocus
                        label="name"
                        fullWidth
                        variant="outlined"
                        placeholder="name"
                        autoComplete="name"
                        value={displayName}
                        error={!!displayNameError}
                        helperText={displayNameError}
                        onChange={({ target: { value } }) => {
                            setDisplayName(value);
                        }}
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
                            endAdornment: displayNameError ? (
                                <InputAdornment className={classes.inputAdornedEnd}>
                                    <ErrorIcon className={classes.errorIcon} />
                                </InputAdornment>
                            ) : null
                        }}
                    />
                    {/*}<MuiPhoneNumber
                        label="phone number"
                        fullWidth
                        variant="outlined"
                        placeholder="phone number"
                        autoComplete="phone"
                        defaultCountry={"us"}
                        disableDropdown={true}
                        value={phone}
                        onEnterKeyPress={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            submitForm();
                        }}
                        onChange={(value) => {
                            setPhone(value);
                        }}
                        onBlur={() => {
                            setTimeout(() => {
                                setPhone(normalizePhone(phone));
                            }, 200);
                        }}
                        required
                        error={!!phoneError || phoneUnique[phone] === false}
                        helperText={phoneUnique[phone] === false ? "Phone number already in use." : phoneError}
                        id="phone-input"
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
                            endAdornment: getPhoneIcon()
                        }}
                    />*/}

                    <TextField
                        label="email"
                        fullWidth
                        variant="outlined"
                        placeholder="email address"
                        autoComplete="email"
                        value={email}
                        error={!!emailError || emailUnique[email] === false}
                        helperText={emailUnique[email] === false ? "Email already in use." : emailError}
                        onChange={({ target: { value } }) => {
                            setEmail(value);
                        }}
                        id="email-input"
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
                            endAdornment: getEmailIcon()
                        }}
                    />
                    {/* <SegmentedInput
                                        onChange={setBirthday}
                                        value={birthday}
                                        error={!!birthdayError}
                                        helperText={birthdayError}
                                        inputProps={{ variant: "outlined", inputProps: { style: { textAlign: "center" } } }}
                                        segments={[2, 2, 4]}
                                        divider="-"
                                        placeholders={["MM", "DD", "YYYY"]}
                                        segmentProps={[{ autoComplete: "bday-month" }, { autoComplete: "bday-day" }, { autoComplete: "bday-year" }]}
                                    />*/}
                    <TextField
                        label="age"
                        placeholder="Confirm your age"
                        onChange={({ target: { value } }) => {
                            if (value && value > 120) {
                                setBirthday(120);
                            } else if (value && value < 1) {
                                setBirthday(1);
                            } else {
                                setBirthday(value);
                            }
                        }}
                        type="number"
                        fullWidth
                        value={birthday}
                        required
                        error={!!birthdayError}
                        helperText={birthdayError}
                        variant={"outlined"}
                        autoComplete={"birthday"}
                        margin={"normal"}
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
                </form>
            )}
            {/*step == 1 && (
                <form onSubmit={killSubmit}>
                    <Typography>Enter the code sent to your phone number</Typography>
                    <TextField
                        fullWidth
                        label="verify code"
                        autoFocus={true}
                        variant={"outlined"}
                        placeholder={"enter verification code"}
                        type={"text"}
                        value={verifyPhone}
                        error={!!verifyPhoneError}
                        helperText={verifyPhoneError}
                        onChange={({ target: { value } }) => {
                            setVerifyPhone(value);
                        }}
                        id="verify-phone-input"
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
            )*/}
            {step == 1 && (
                <form onSubmit={killSubmit}>
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
            )}
        </>
    );
};

export default CreateAccountForm;
