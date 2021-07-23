import classname from "classnames";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Link from "next/link";
import { Grid, Typography, TextField, CircularProgress, Button } from "@material-ui/core";
import { useExtension } from "hooks/Extension/Extension";

import { useApp } from "hooks/Global/GlobalAppState";

import config from "../../config";
import { getRoom, getContentById } from "utils/API";
import { isChrome, isMobile } from "utils/Browser";
import { useRouter } from "next/router";
import SplitCard from "../SplitCard/SplitCard";

import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import useAPI from "utils/useAPI";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import JoinButton from "components/Join/JoinButton";
import GetScenerButton from "components/GetScenerButton/GetScenerButton";
import NavLink from "components/NavLink/NavLink";

const useStyles = makeStyles((theme) => ({
    usernameContainer: {
        borderBottom: "solid .0625rem" + theme.palette.primary.main,
        marginRight: theme.spacing(1)
    },
    background: {
        backgroundImage: `url(/images/cards/PostInstall.png)`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%"
    },
    backgroundOverlay: {
        position: "absolute",
        background: "rgba(0,0,0,0.2)",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
    },
    button: {
        minWidth: theme.functions.rems(160),
        minHeight: theme.functions.rems(40),
        borderRadius: theme.functions.rems(18),
        boxShadow: "4px 4px 10px 0 rgba(0,0,0,0.18)"
    },
    outlinedButton: {
        border: "none",
        "&:hover,&:focus,&:active": {
            border: "none"
        },
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            opacity: 0.7,
            borderRadius: theme.spacing(6),
            background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        "&:before": {
            content: "''",
            background: theme.functions.rgba(theme.palette.scener.midnight, 0.9),
            backgroundClip: "padding-box",
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
    buttonLabel: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.4,
        zIndex: 5
    },
    contentContainer: {
        padding: "3rem",
        margin: 0,
        width: "100%",
        height: "100%",
        [theme.breakpoints.down("xs")]: {
            padding: "1rem"
        }
    },
    brandContainer: {
        flexBasis: "50%"
    },
    brandLink: {
        display: "flex",
        paddingTop: theme.spacing(7)
    },
    brandIcon: {
        height: "4rem",
        width: "auto",
        maxWidth: "100vw"
    },
    itemContainer: {
        flexBasis: "100%",
        paddingLeft: theme.spacing(7.5),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(0)
        }
    },
    item: {
        flexBasis: 0
    },
    primary: {
        fontFamily: "Montserrat,Roboto,sans-serif",
        fontSize: theme.functions.rems(40),
        fontWeight: 800,
        letterSpacing: 0
    },
    secondary: {
        fontSize: theme.functions.rems(18),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    username: {
        fontWeight: 800,
        color: theme.palette.primary.main,
        fontSize: theme.functions.rems(18),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    spacerTop: {
        marginTop: theme.functions.rems(28)
    }
}));

const StartCard = ({ room, owner, roomError, onFinished, contentId, service, showHomeButton }) => {
    const classes = useStyles();
    const theme = useTheme();
    const router = useRouter();
    const {
        auth: { user },
        popups: { hosting, addScener }
    } = useApp();
    const [status, setStatus] = useState(null);
    const { isExtensionInstalled, needsUpdate, country } = useExtension();
    useEffect(() => {
        if (isExtensionInstalled && onFinished) {
            onFinished();
        }
    }, [isExtensionInstalled]);

    const [error, setError] = useState(null);
    const [code, setCode] = useState("");
    const [content, setContent] = useState(null);
    const onChrome = useMemo(() => isChrome(), []);
    const mobile = useMemo(() => isMobile(), []);

    const checkCode = () => {
        if (!code) {
            setError("Invalid code.");
            return;
        }
        setError(null);
        getRoom(code)
            .then((d) => {
                if (d && d.id) {
                    console.log(d);

                    if (d.username) {
                        router.push("/[username]", "/" + d.username);
                        addScener.show(false);
                    } else {
                        router.push("/join/[roomCode]", "/join/" + code);
                        addScener.show(false);
                    }
                } else {
                    setError("Invalid or expired code.");
                    setStatus("error");
                }
            })
            .catch((e) => {
                console.error(e);
                setStatus("error");
                setError(e.message);
            });
    };

    useEffect(() => {
        if (contentId) {
            // start on this content
            getContentById(contentId).then((contentData) => {
                if (contentData) {
                    console.log("*** CONTENT **", contentData);
                    setContent(contentData);

                    if (user && user.id && user.username) {
                        hosting.show(true, { content: contentData });
                    }
                }
            });
        } else if (service && country) {
            let startURL = config.getServiceStart(service, country);

            if (user && user.id && user.username && startURL) {
                let contentData = {
                    id: 1,
                    service: service,
                    url: startURL
                };

                hosting.show(true, { content: contentData });
            }
        }
    }, [contentId, user, service, country]);

    const getRightContent = useCallback(() => {
        if (room && !roomError) {
            return isExtensionInstalled || mobile ? (
                <Grid item container spacing={2} alignItems="center" justify="center" style={{ padding: "3rem", margin: 0, width: "100%" }}>
                    <Grid item xs={12}>
                        <Typography variant="h3">Almost there!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <JoinButton fullWidth type={"private"} roomId={room.id} roomCode={room.code} user={owner} title={"Join the Party"} />
                    </Grid>
                </Grid>
            ) : (
                <Grid item container spacing={2} alignItems="center" justify="center" style={{ padding: "3rem", margin: 0, width: "100%" }}>
                    <Grid item xs={12}>
                        <Typography variant="h3">Chrome extension required.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <NavLink href="/join/[roomId]/[step]" as={"/join/" + room.code + "/extension"} passHref>
                            <Button variant="contained" color="secondary" fullWidth>
                                Get Scener
                            </Button>
                        </NavLink>
                    </Grid>
                </Grid>
            );
        } else {
            return null;
        }
    }, [room, error, roomError, status, isExtensionInstalled, mobile]);

    const getLeftContent = useCallback(() => {
        if (room && !roomError) {
            return owner ? (
                <Grid container spacing={2} direction="column" wrap="nowrap" className={classes.contentContainer}>
                    <Grid container spacing={1} direction="column" className={classes.itemContainer}>
                        <Grid item xs={12} sm={12} className={classes.item}>
                            <Typography variant="h3" className={classes.primary}>
                                Join the Party!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={10} className={classes.item}>
                            <Typography variant="h4" className={classes.secondary}>
                                <Typography component="span" className={classes.username}>
                                    @{owner.username}
                                </Typography>{" "}
                                is hosting a private watch party.
                                {user && room.participants.filter((p) => p.userId != user.id).length > 1 && " See who's already there:"}
                            </Typography>
                        </Grid>
                        {room.participants.filter((p) => p.userId != user.id).length > 1 && (
                            <Grid item xs={12} sm={10} className={classname(classes.item, classes.spacerTop)}>
                                <Grid container spacing={3} alignContent="flex-start" justify="flex-start">
                                    {room.participants.map((p) => {
                                        return !user || p.userId != user.id ? (
                                            <Grid key={p.userId} item xs={12} sm={6}>
                                                <div className={classes.usernameContainer}>
                                                    <Typography>@{p.username}</Typography>
                                                </div>
                                            </Grid>
                                        ) : null;
                                    })}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={2} direction="column" justify="center" align="center" className={classes.contentContainer}>
                    <Grid item xs={12} className={classes.item}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            );
        } else if (roomError) {
            return (
                <Grid container spacing={2} direction="column" wrap="nowrap" className={classes.contentContainer}>
                    <Grid container spacing={1} direction="column" className={classes.itemContainer}>
                        <Grid item xs={12} sm={10} className={classes.item}>
                            <Typography variant={"h3"}>Uh oh!</Typography>
                        </Grid>
                        <Grid item xs={12} sm={10} className={classes.item}>
                            <Typography variant={"h4"}>Looks like you entered an invalid code.</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.item}>
                            <TextField
                                value={code}
                                onChange={({ currentTarget: { value } }) => {
                                    setCode(value.toUpperCase());
                                    if (value.length == 0) {
                                        setError(null);
                                    }
                                }}
                                error={!!error}
                                helperText={error}
                                variant="outlined"
                                margin={"normal"}
                                label="have a code?"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                fullWidth
                                onKeyPress={({ key }) => {
                                    if (key == "Enter") {
                                        checkCode();
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    wrap="nowrap"
                    className={classes.contentContainer}
                    alignItems={"center"}
                    justify="center"
                >
                    <CircularProgress size={"10vh"} color="inherit" />
                </Grid>
            );
        }
    }, [room, owner, isExtensionInstalled, needsUpdate, user, code, error, roomError, onChrome, mobile, content]);

    const getBackground = useCallback(() => {
        return (
            <div
                style={{
                    backgroundImage: theme.gradients.dark,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%"
                }}
            />
        );
    }, [room, owner, isExtensionInstalled, user, theme]);

    const getForeground = useCallback(() => {
        return <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-12.8%, 20%)", width: "110%" }} />;
    }, [room, owner, isExtensionInstalled, user]);

    return (
        <SplitCard
            showHomeButton={showHomeButton}
            foreground={getForeground()}
            leftContent={getLeftContent()}
            rightContent={getRightContent()}
            background={getBackground()}
        />
    );
};

export default StartCard;
