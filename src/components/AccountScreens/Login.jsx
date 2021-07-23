import { makeStyles, Typography,  Button, DialogContent, DialogActions, Toolbar, Divider, Box } from "@material-ui/core";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import useLoginFormState from "hooks/Forms/useLoginFormState";
import LoginForm from "../AccountForms/LoginForm";
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
const Login = ({ onForgotPasswordClicked, onSignUpClicked, message, onFinished }) => {
    const formState = useLoginFormState({ onFinished });
    const { error, submitForm, setStatus, status } = formState;
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Box component="div" position="relative" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.headerContainer}>
                        <Typography variant="h6" className={classes.title}>
                            Log In
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
            <DialogContent className={classes.content}>
                {error && (
                    <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                        {error}
                    </Typography>
                )}
                <LoginForm {...formState} onForgotPasswordClicked={onForgotPasswordClicked} />
            </DialogContent>
            <DialogActions className={classes.actions}>
                <ButtonWithFeedback color="secondary" variant="contained" fullWidth onClick={submitForm} status={status} onTimeout={setStatus}>
                    Log In
                </ButtonWithFeedback>
                <Button
                    variant="outlined"
                    color="primary"
                    //   classes={{ root: classes.accountButton, label: classes.accountButtonLabel }}
                    fullWidth
                    onClick={onSignUpClicked}
                >
                    No account? Sign up for free
                </Button>
            </DialogActions>
        </div>
    );
};

export default Login;
