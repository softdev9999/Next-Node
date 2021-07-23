import classname from "classnames";
import React from "react";
import { makeStyles, Typography, Button, IconButton, Link, DialogContent, DialogActions, Toolbar, Divider, Box } from "@material-ui/core";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
//import SegmentedInput from "../SegmentedInput/SegmentedInput";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import useCreateAccountState from "hooks/Forms/useCreateAccountFormState";
import CreateAccountForm from "../AccountForms/CreateAccountForm";

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


const CreateAccount = ({ onLoginClicked, onFinished, message }) => {
    const classes = useStyles();
    const formState = useCreateAccountState({ onFinished });
    const { step, setStep, submitForm, error, status, setStatus } = formState;


    return (
        <div className={classes.container}>
            <Box component="div" position="relative" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    {step > 0 && (
                        <IconButton disableRipple className={classes.backButton} onClick={() => setStep(step - 1)}>
                            <ArrowBackIosIcon className={classes.iconBackButton} />
                        </IconButton>
                    )}
                    <div className={classes.headerContainer}>
                        <Typography variant="h6" className={classes.title}>
                            {(step == 1 && "Last step") || "Create Account"}
                        </Typography>
                        {message && (
                            <Typography variant="caption" align="center" className={classes.subTitle}>
                                {message}
                            </Typography>
                        )}
                    </div>
                </Toolbar>
                <Divider component="div" className={classes.divider} />
            </Box>
            <DialogContent
                className={classname(classes.content, {
                    [classes.padderZero]: step === 1
                })}
            >
                {error && (
                    <Typography variant="body1" align="center" style={{ width: "100%" }} color="error">
                        {error}
                    </Typography>
                )}

                <CreateAccountForm {...formState} />

            </DialogContent>
            {step === 0 && <Divider className={classes.divider} />}
            <DialogActions
                className={classname(classes.actions, {
                    [classes.padderTop]: step === 1
                })}
            >
                {step === 0 && (
                    <Typography component="div" variant="body2" className={classes.paragraph}>
                        By continuing you agree to Scener{"'"}s{" "}
                        <Link href="/terms" target="_blank" className={classes.link}>
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms" target="_blank" className={classes.link}>
                            Privacy Policy
                        </Link>
                    </Typography>
                )}
                <ButtonWithFeedback color="secondary" variant="contained" onClick={submitForm} status={status} fullWidth onTimeout={setStatus}>
                    {step < 1 ? "Next" : "Create Account"}
                </ButtonWithFeedback>
                {step === 0 && (
                    <Button classes={{ root: classes.accountButton, label: classes.accountButtonLabel }} fullWidth onClick={onLoginClicked}>
                        Have an account? Log in here.
                    </Button>
                )}
            </DialogActions>
        </div>
    );
};

export default CreateAccount;
