import React from "react";
import { Grid, Typography, Button, makeStyles, Divider, Link, Toolbar, IconButton } from "@material-ui/core";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import CreateAccountForm from "../AccountForms/CreateAccountForm";
import useCreateAccountState from "hooks/Forms/useCreateAccountFormState";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(0),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    rightContainer: {
        padding: theme.spacing(3, 3, 8, 3),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    contentContainer: {
        padding: theme.spacing(3, 5)
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

const CreateAccountCard = ({ onFinished, onLoginClicked }) => {
    const classes = useStyles();
    const formState = useCreateAccountState({ onFinished });
    const { step, setStep, submitForm, status, setStatus } = formState;


    const leftContent = (
        <Grid container spacing={0} alignContent="flex-start" justify="center" className={classes.container}>
            <Grid item xs={12} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    {step > 0 && (
                        <IconButton disableRipple className={classes.backButton} onClick={() => setStep(step - 1)}>
                            <ArrowBackIosIcon className={classes.iconBackButton} />
                        </IconButton>
                    )}
                    <div className={classes.headerContainer}>
                        <Typography variant="h6" className={classes.title}>
                            {step == 1 ? "Last step" : "Create Account"}
                        </Typography>
                    </div>
                </Toolbar>
                <Divider variant="fullWidth" />
            </Grid>{" "}

            <Grid item xs={12} className={classes.contentContainer}>
                <CreateAccountForm {...formState} />
            </Grid>
            <Grid item xs={7} className={classes.actions}>
                {step === 0 && (
                    <Typography component="div" variant="body2" className={classes.paragraph} align={"center"}>
                        By continuing you agree to Scener???s{" "}
                        <Link href="/terms" target="_blank" className={classes.link}>
                            Terms&nbsp;of&nbsp;Service
                        </Link>
                        &nbsp;and&nbsp;
                        <Link href="/terms" target="_blank" className={classes.link}>
                            Privacy&nbsp;Policy
                        </Link>
                    </Typography>
                )}
                <ButtonWithFeedback color="secondary" variant="contained" onClick={submitForm} status={status} fullWidth onTimeout={setStatus}>
                    {step < 1 ? "Next" : "Create Account"}
                </ButtonWithFeedback>
            </Grid>
        </Grid>
    );

    const background = (
        <div
            style={{
                backgroundImage: `url(/images/cards/PostInstall.jpg)`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
            }}
        />
    );

    const foreground = (
        <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-10%,-30%) scale(1)", width: "110%" }} />
    );

    const rightcontent = (
        <Grid container spacing={0} alignContent="flex-end" justify="center" className={classes.rightContainer}>
            <Grid item>
                {step == 0 ? (
                    <Button classes={{ root: classes.accountButton, label: classes.accountButtonLabel }} fullWidth onClick={onLoginClicked}>
                        Have an account? Log in here.
                    </Button>
                ) : null}
            </Grid>
        </Grid>
    );

    return (
        <SplitCard
            foreground={foreground}
            leftContent={leftContent}
            rightContent={rightcontent}
            background={background}
            showHomeButton={false}
            leftWidth={7}
            rightWidth={5}
        />
    );
};

export default CreateAccountCard;
