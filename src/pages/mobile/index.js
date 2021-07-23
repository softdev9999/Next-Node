import Head from "next/head";
import Page from "components/Page/Page";
import { Button, Divider, Grid, Link, makeStyles, TextField, Typography } from "@material-ui/core";
import withAppState from "components/Page/withAppState";
import { useRouter } from "next/router";
import useAPI from "utils/useAPI";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
import LaptopVideo from "components/LaptopVideo/LaptopVideo";
import classname from "classnames";
import { useCallback, useEffect, useState } from "react";
import ButtonWithFeedback from "components/ButtonWithFeedback/ButtonWithFeedback";
import { requestEmailLink } from "utils/API";
import { useApp } from "hooks/Global/GlobalAppState";
import MailIcon from "@material-ui/icons/MailOutline";
import config from "config";
import { trackEventAll } from "utils/Tracking";
const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "stretch",
        [theme.breakpoints.down("xs")]: {
            flexFlow: "column nowrap"
        }
    },
    header: {
        padding: theme.spacing(1, 5, 3)
    },
    section: {
        padding: theme.spacing(3, 3),
        width: "100%"
    },
    sectionBackground: {
        padding: theme.spacing(3, 3),
        width: "100%",
        background: theme.gradients.create(338.38, theme.functions.rgba("#390354", 0.7), theme.functions.rgba("#270670", 0.7))
    },
    innerBackground: {
        padding: theme.spacing(3, 3),
        width: "100%",
        background: theme.functions.rgba(theme.palette.primary.main, 0.3)
    },

    content: {
        padding: theme.spacing(0.5, 0)
    },
    inner: {
        padding: theme.spacing(2, 0),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: "row nowrap"
    },
    padderBottomZero: {
        paddingBottom: 0
    },
    h1: {},
    tandc: {
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
    paragraph: {
        fontSize: theme.spacing(2),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    paragraphPadder: {
        marginBottom: theme.spacing(4)
    },
    paragraphBottom: {
        marginBottom: theme.spacing(3)
    },
    divider: {
        margin: theme.spacing(3, 0)
    },
    subtitle: {
        color: theme.functions.rgba(theme.palette.common.white, 0.5)
    },
    code: {
        letterSpacing: ".1em",
        textTransform: "uppercase"
    },
    textInput: {
        paddingTop: theme.functions.rems(6),
        marginBottom: theme.spacing(1)
    }
}));
function MobilePage() {
    const classes = useStyles();
    const {
        auth: { user }
    } = useApp();
    const [email, setEmail] = useState((user && user.email) || "");
    const [emailError, setEmailError] = useState(null);
    const [status, setStatus] = useState(null);

    const getPageTitle = useCallback(() => {
        return "Scener – Watch Netflix and more with friends";
    }, []);

    useEffect(() => {
        if (user && user.email) {
            setEmail(user.email);
        }
    }, [user]);

    const onStatusTimeout = useCallback(
        (newStatus) => {
            if (status == "error") {
                setStatus(newStatus);
            }
        },
        [status]
    );

    const submit = useCallback((emailValue) => {
        setStatus("loading");
        setEmailError(null);
        if (!emailValue || !emailValue.match(/^.+@([\w-]+\.)+[\w-]{2,6}$/gi)) {
            setEmailError("Invalid email.");
            setStatus("error");

            return false;
        }
        trackEventAll("startCheckout");

        return requestEmailLink(emailValue)
            .then(() => {
                setStatus("success");
            })
            .catch((e) => {
                setEmailError(e.message);
                setStatus("error");
                return e.message;
            });
    }, []);

    const resetForm = useCallback(() => {
        if (user && user.email) {
            setEmail(user.email);
        }
        setEmailError(null);
        setStatus(null);
    }, [user]);

    const share = useCallback(async () => {
        let params = { utm_source: "mobile" };
        if (user && user.id && user.email) {
            params.utm_sharer = user.id;
        }
        if (typeof navigator !== "undefined" && navigator.share) {
            trackEventAll("share");
            let urlParams = new URLSearchParams(params);
            try {
                await navigator.share({ url: config.WEB_HOST + "?" + urlParams.toString() });
            } catch (e) {
                console.log(e);
            }
        }
    }, [user]);

    //use roomCode if we want to load dynamic data
    return (
        <Page>
            <Head>
                <title>{getPageTitle()} </title>
                {createOpenGraphTags({ title: getPageTitle() })}

                {/* OG TAGS GO HERE*/}
            </Head>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexFlow: "column nowrap" }}>
                <div className={classes.section}>
                    <LaptopVideo style={{ width: "100%" }} />
                </div>{" "}
                <div className={classes.section}>
                    <div className={classes.sectionBackground}>
                        <div className={classes.content}>
                            <Typography variant="h4" align="center" gutterBottom>
                                To get Scener, go to
                            </Typography>
                            <Typography variant="h2" align="center" gutterBottom>
                                www.scener.com
                            </Typography>
                            <Typography variant="h4" align="center" gutterBottom>
                                on your computer
                            </Typography>
                        </div>
                        <div className={classes.divider}>
                            <Divider variant="fullWidth" />
                        </div>

                        {status !== "success" ? (
                            <>
                                <div className={classes.content}>
                                    <Typography variant="h6" sytle={{ fontWeight: 400 }} align="center" gutterBottom>
                                        Or, we can email you a download&nbsp;link:
                                    </Typography>
                                </div>
                                <div className={classes.content}>
                                    <TextField
                                        autoComplete={"email"}
                                        type={"email"}
                                        autoCapitalize={"off"}
                                        disabled={!!status}
                                        value={email}
                                        variant="filled"
                                        fullWidth
                                        error={!!emailError}
                                        helperText={emailError}
                                        margin="dense"
                                        InputProps={{ disableUnderline: true, classes: { inputMarginDense: classes.textInput } }}
                                        placeholder="email address"
                                        onKeyPress={({ key }) => {
                                            if (key == "Enter") {
                                                submit(email);
                                            }
                                        }}
                                        onChange={({ currentTarget }) => setEmail(currentTarget.value)}
                                    />
                                </div>{" "}
                                <div className={classes.content}>
                                    <Typography component="div" variant="body2" className={classes.tandc}>
                                        By continuing you agree to Scener{"'"}s{" "}
                                        <Link href="/terms" target="_blank" className={classes.link}>
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/terms" target="_blank" className={classes.link}>
                                            Privacy Policy
                                        </Link>
                                    </Typography>
                                </div>
                                <div className={classes.inner}>
                                    <ButtonWithFeedback
                                        status={status}
                                        onTimeout={onStatusTimeout}
                                        color="secondary"
                                        variant={"contained"}
                                        onClick={() => submit(email)}
                                        successMessage={"Email sent"}
                                    >
                                        Send me a link
                                    </ButtonWithFeedback>
                                </div>
                            </>
                        ) : (
                            <div className={classes.innerBackground}>
                                <div className={classes.inner}>
                                    <MailIcon style={{ fontSize: "2rem", marginRight: "1rem", height: "2rem", width: "2rem" }} />
                                    <Typography variant="h3" sytle={{ fontWeight: 400 }} align="center">
                                        Email sent
                                    </Typography>
                                </div>
                                <div className={classes.inner}>
                                    <Typography align="center" variant="body1">
                                        Check your inbox for a link to download&nbsp;Scener
                                    </Typography>
                                </div>
                                <div className={classes.inner}>
                                    <Button variant="contained" color="secondary" onClick={() => share()}>
                                        Invite friends
                                    </Button>
                                </div>
                                <div className={classes.inner}>
                                    <Typography variant="caption">
                                        {"Can't find the email? Check your spam or "}
                                        <Link onClick={() => resetForm()} className={classes.link}>
                                            use a different email.
                                        </Link>
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default withAppState(MobilePage);
