import React, { useState, useEffect, useRef } from "react";
import classname from "classnames";
import { Box, Grid, Typography, Button, makeStyles, TextField, Switch, Tooltip } from "@material-ui/core";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/HostInstall_Stars.svg";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import { useRouter } from "next/router";
import AddEvent from "../Event/AddEvent";
import Event from "components/Event/Event";

import LinkIcon from "@material-ui/icons/Link";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import useAPI from "utils/useAPI";
import { createRoom } from "utils/API";
import config from "../../config";
import { useApp } from "hooks/Global/GlobalAppState";

import CheckMarkIcon from "@material-ui/icons/CheckRounded";
import ScenerThemeDefault from "theme/ScenerThemeDefault";
import useSWR from "swr";

const useStyles = makeStyles((theme) => ({
    container: {
        width: theme.functions.rems(726),
        minHeight: theme.functions.rems(448)
    },
    choiceButton: {
        width: "100%",
        marginBottom: "1rem",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        textTransform: "inherit"
    },
    leftContainer: {
        padding: theme.spacing(6, 6, 7, 7),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    rightContainer: {
        padding: theme.spacing(6, 6, 7, 7),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    contentContainer: {
        padding: theme.spacing(3, 5)
    },
    gutterTop: {
        marginTop: theme.spacing(6)
    },
    gutterBottom: {
        marginBottom: theme.spacing(2.6)
    },
    actions: {
        marginTop: theme.spacing(4),
        width: "100%"
    },
    outlinedInput: {
        background: theme.functions.rgba(theme.palette.common.white, 0.1),
        height: theme.functions.rems(36),
        borderRadius: 0,
        fontSize: theme.functions.rems(12),
        letterSpacing: 0,
        textAlign: "center",
        "&$disabled": {
            color: theme.palette.common.white
        }
    },
    notchedOutline: {
        border: "none"
    },
    toggleButton: {
        color: "white",
        border: "none",
        backgroundColor: theme.functions.rgba(theme.palette.primary.dark, 0.3)
    },
    toggleButtonSelected: {
        border: "none",
        background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientDark})`
    },
    hostButton: {
        maxHeight: theme.functions.rems(36),
        maxWidth: theme.functions.rems(232),
        minWidth: theme.functions.rems(232),
        minHeight: theme.functions.rems(36),
        borderRadius: theme.functions.rems(18),
        "&:hover": {
            borderColor: "transparent",
            backgroundColor: theme.functions.rgba(theme.palette.scener.pink, 1)
        }
    },
    copyButton: {
        marginBottom: theme.spacing(3),
        maxHeight: theme.functions.rems(36),
        minHeight: theme.functions.rems(36),
        maxWidth: theme.functions.rems(232),
        minWidth: theme.functions.rems(232)
    },
    smallHostButton: {
        maxHeight: theme.functions.rems(36),
        maxWidth: theme.functions.rems(161),
        minHeight: theme.functions.rems(36),
        minWidth: theme.functions.rems(161),
        borderRadius: theme.functions.rems(18)
    },
    splitFooter: {
        width: "100%",
        background: theme.gradients.create("90", theme.palette.primary.light, theme.palette.primary.main),
        padding: "0.75rem",
        cursor: "pointer",
        minHeight: theme.functions.rems(48),
        maxHeight: theme.functions.rems(48),
        "&:hover": {
            background: theme.gradients.create("90", theme.palette.secondary.light, theme.palette.primary.lightest)
        }
    },
    primaryLargeText: {
        fontWeight: "bold",
        lineHeight: theme.functions.rems(42)
    },
    iconSize: {
        display: "flex",
        fontSize: "1.5rem",
        marginRight: "0.5rem"
    },
    spacerHorizontal: {
        marginLeft: theme.functions.rems(15),
        marginRight: theme.functions.rems(15)
    },
    primaryText: {
        fontWeight: "bold",
        marginBottom: theme.functions.rems(12)
    },
    secondaryText: {
        fontWeight: "bold",
        letterSpacing: 0,
        maxWidth: theme.functions.rems(272),
        marginBottom: theme.functions.rems(12)
    },
    paragraphText: {
        fontWeight: 400
    },
    switchContainer: {
        marginTop: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(0.7),
        height: theme.functions.rems(36),
        maxHeight: theme.functions.rems(36),
        backgroundColor: theme.functions.rgba("#D8D8D8", 0.1),
        width: "100%",
        maxWidth: theme.functions.rems(232)
    },
    thumb: {
        width: theme.functions.rems(18),
        height: theme.functions.rems(18),
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.5),
        boxShadow: "0 0 6px 0 #100835"
    },
    track: {
        borderRadius: theme.functions.rems(6),
        height: theme.functions.rems(12),
        width: theme.functions.rems(35),
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.5)
    },
    colorSecondary: {
        "&$checked + $track": {
            opacity: 1,
            backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.2)
        }
    },
    checked: {
        "& $thumb": {
            backgroundColor: theme.palette.common.white
        }
    },
    disabled: {},
    backButton: {
        left: "17%!important"
    },
    eventLeftContainer: {
        height: "100%",
        minHeight: theme.functions.rems(332),
        padding: theme.spacing(8, 7)
    },
    eventRightContainer: {
        height: "100%",
        minHeight: theme.functions.rems(332),
        padding: theme.spacing(6, 6, 0, 0)
    },
    eventBottomContainer: {
        padding: theme.spacing(2),
        minHeight: theme.functions.rems(116),
        maxHeight: theme.functions.rems(116)
    },
    joinLeftContainer: {
        padding: theme.spacing(14, 8, 0),
        height: "100%"
    },
    joinRightContainer: {
        padding: theme.spacing(14, 4, 7)
    }
}));

class HostingNode {
    constructor(id, title, desc, optionList, parentId, actions, callback) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.optionList = optionList;
        this.parentId = parentId;
        this.actions = actions;
        this.callback = callback;
    }
}

const generatePasscode = () => {
    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
        .replace("A", "B")
        .replace("E", "F")
        .replace("I", "J")
        .replace("O", "P")
        .replace("U", "V")
        .replace("1", "2")
        .replace("0", "X");
};

const HostingPickerCard = ({ onFinished, contentId }) => {
    const classes = useStyles();
    const router = useRouter();
    const copyRef = useRef();

    const [loading, setLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(null);
    const [shareurl, setShareurl] = useState(null);

    const [isPrivate, setIsPrivate] = useState(false);
    const [scheduleLater, setScheduleLater] = useState(false);

    const [currentRoom, setCurrentRoom] = useState(null);

    const [showPasscode, setShowPasscode] = useState(false);
    const [passcode, setPasscode] = useState(generatePasscode());

    const [currentEvent, setCurrentEvent] = useState(null);

    const {
        auth: { user }
    } = useApp();

    const { host } = useAPI();
    const { data: events, error: eventsError_ } = useSWR(() => "/users/" + user.id + "/events");

    useEffect(() => {
        if (events) {
            if (events && events.length > 0) {
                events.filter((t) => t.roomId && t.roomId > 0).sort((a, b) => a.startTime - b.startTime);

                if (events[0] && events[0].startTime) {
                    let curTime = Math.floor(Date.now() / 1000);

                    let timeUntilNextEvent = +events[0].startTime - curTime;

                    if (timeUntilNextEvent < 3600 && timeUntilNextEvent > -1800) {
                        setCurrentEvent(events[0]);
                    }
                }
            }
        }
    }, [events]);

    const setupPublicRoom = () => {
        let pass = isPrivate ? generatePasscode() : null; // no vowels. replace letters that are easily mistaken for others

        setLoading(true);
        host({ contentId, roomType: "public", unlisted: isPrivate, passcode: pass })
            .then(() => {
                // this returns too soon, so don't set loading false here until fixed
                //setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const setupPrivateRoom = () => {
        setLoading(true);
        host({ contentId, roomType: "private" })
            .then(() => {
            })
            .catch(() => setLoading(false));
    };

    const joinRoom = (roomId) => {
        setLoading(true);
        router.push("/join/[roomId]/[step]", "/join/" + roomId + "/camera", { shallow: true });
    };

    const learnMore = () => {
        window.open("/faq", "_blank");
    };

    const goBack = () => {
        setShareurl(null);
        setScheduleLater(false);
    };

    const getRoomLink = () => {
        setLoading(true);
        createRoom("private", false)
            .then((r) => {
                if (r && r.code && r.member) {
                    setLoading(false);
                    setShareurl(config.WEB_HOST + "/join/" + r.code);
                    setCurrentRoom(r);
                }
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    };

    const copyClipboard = (el) => {
        if (process.browser) {
            ga("Copied Invite Link");

            el.focus();
            el.select();
            document.execCommand("copy");
            setHasCopied(true);
            setTimeout(function () {
                if (el) {
                    setHasCopied(false);
                }
            }, 1500);
        }
    };

    const rightContent = currentEvent ? (
        <Grid container alignContent="flex-start" justify="center" className={classes.eventRightContainer}>
            <Grid item xs={12}>
                <Event timer={true} isLive={false} event={currentEvent} host={user} background={false} isHostEvent={true} />
            </Grid>
        </Grid>
    ) : shareurl ? (
        <Grid container alignContent="center" justify="center" className={classes.joinRightContainer}>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h3" align="center" className={classes.secondaryText}>
                        Copy this watch party link and share it with your friends
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        size="small"
                        margin="dense"
                        variant="outlined"
                        value={shareurl}
                        inputProps={{ style: { textAlign: "center" } }}
                        InputProps={{
                            classes: {
                                root: classes.outlinedInput,
                                disabled: classes.disabled,
                                notchedOutline: classes.notchedOutline
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid container alignContent="center" justify="space-around" direction="column" className={classes.actions}>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disabled={!shareurl}
                        onClick={() => copyClipboard(copyRef.current)}
                        className={classes.copyButton}
                        style={{ backgroundColor: hasCopied && ScenerThemeDefault.palette.success.main }}
                        endIcon={!hasCopied ? <LinkIcon style={{ color: "currentColor" }} /> : <CheckMarkIcon style={{ color: "currentColor" }} />}
                    >
                        {!hasCopied ? "copy link" : "copied!"}
                    </Button>
                    <textarea ref={copyRef} readOnly={true} style={{ position: "absolute", left: -9999 }} value={shareurl} />
                </Grid>
                <Grid item>
                    <ButtonWithFeedback
                        className={classes.hostButton}
                        fullWidth
                        disabled={loading}
                        status={loading ? "loading" : null}
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            currentRoom && joinRoom(currentRoom.id);
                        }}
                    >
                        Join room
                    </ButtonWithFeedback>
                </Grid>
            </Grid>
        </Grid>
    ) : scheduleLater ? (
        <Grid container alignContent="center" justify="center">
            <Grid item>
                <AddEvent
                    hideTitle
                    hideBack
                    isHostEvent
                    withCode={isPrivate ? passcode : null}
                    onSave={(event) => {
                        //console.log("event saved", event);
                        setLoading(true);
                        router.push("/" + user.username);
                    }}
                />
            </Grid>
        </Grid>
    ) : (
        <Grid container alignContent="center" alignItems="center" justify="flex-start" direction="column" className={classes.rightContainer}>
            <Grid container alignItems="flex-start" justify="center" direction="column">
                <Grid item>
                    <Typography variant="h2" align="center" className={classes.primaryText}>
                        Theater
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5" align="left" className={classes.paragraphText}>
                        Host a private or public watch party for unlimited guests. Invite co-hosts to join you on camera or mic
                    </Typography>
                </Grid>
                <Grid container alignItems="center" justify="space-between" className={classes.switchContainer}>
                    <Tooltip title="Private theaters are given a passcode that is required to join">
                        <Grid item style={{ cursor: "help" }}>
                            <Typography variant="h5" align="left" className={classes.switchText}>
                                Private?
                            </Typography>
                        </Grid>
                    </Tooltip>
                    <Grid item>
                        <Switch
                            value={true}
                            checked={isPrivate}
                            onChange={(event) => {
                                setIsPrivate(event.target.checked);
                                setPasscode(event.target.checked ? generatePasscode() : null);
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container alignContent="center" justify="space-around" direction="column" className={classes.actions}>
                <Grid item xs={12} container>
                    <ButtonWithFeedback
                        disabled={loading}
                        status={loading ? "loading" : null}
                        variant="outlined"
                        color="primary"
                        className={classname(classes.hostButton, classes.gutterBottom)}
                        fullWidth
                        onClick={() => {
                            setupPublicRoom();
                        }}
                    >
                        Host now
                    </ButtonWithFeedback>
                </Grid>
                <Grid item xs={12} container>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.hostButton}
                        fullWidth
                        onClick={() => {
                            setScheduleLater(true);
                        }}
                    >
                        Schedule for later
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );

    const background = (
        <div
            style={{
                backgroundImage: `url(/images/cards/PostInstall.png)`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
            }}
        />
    );

    const foreground = <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-28.2%, -5%) scale(1)" }} />;

    const bottomContent = currentEvent ? (
        <Grid container alignContent="center" alignItems="center" justify="center" direction="row" className={classes.eventBottomContainer}>
            <Grid item style={{ marginRight: "2rem" }}>
                <Typography variant="h2" align="center">
                    Host a different watch party
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    color="primary"
                    className={classes.smallHostButton}
                    onClick={() => {
                        setCurrentEvent(null);
                    }}
                >
                    Host
                </Button>
            </Grid>
        </Grid>
    ) : (
        <Grid
            container
            alignContent="center"
            alignItems="flex-end"
            justify="center"
            direction="row"
            className={classes.splitFooter}
            onClick={learnMore}
        >
            <Grid item>
                <Typography variant="h5" align="center" className={classes.spacerHorizontal}>
                    Visit our FAQ to learn more
                </Typography>
            </Grid>
            <Grid item>
                <ChevronRightIcon className={classes.iconSize} />
            </Grid>
        </Grid>
    );

    const leftContent = currentEvent ? (
        <Grid container alignContent="flex-start" justify="flex-start" className={classes.eventLeftContainer}>
            <Grid item>
                <Typography variant="h1" gutterBottom className={classname(classes.primaryLargeText, classes.gutterBottom)}>
                    Starting soon
                </Typography>
            </Grid>
            <Grid item>
                <ButtonWithFeedback
                    className={classes.smallHostButton}
                    fullWidth
                    disabled={loading}
                    status={loading ? "loading" : null}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        currentEvent.roomId && joinRoom(currentEvent.roomId);
                    }}
                >
                    Host now
                </ButtonWithFeedback>
            </Grid>
        </Grid>
    ) : shareurl ? (
        <Grid container alignContent="flex-start" justify="center" className={classes.joinLeftContainer}>
            <Typography component="h1" variant="h1" className={classes.primaryLargeText} align="left">
                Invite friends to your watch party room
            </Typography>
        </Grid>
    ) : scheduleLater ? (
        <Grid container alignContent="center" alignItems="center" justify="space-around" direction="column" style={{ padding: "4rem 3.5rem" }}>
            <Typography component="h1" variant="h1" className={classes.primaryLargeText} align="left">
                Schedule a watch party for later
            </Typography>
        </Grid>
    ) : (
        <Grid container alignContent="center" alignItems="center" justify="flex-start" direction="column" className={classes.leftContainer}>
            <Grid container alignItems="flex-start" justify="center" direction="column">
                <Grid item>
                    <Typography variant="h2" align="center" className={classes.primaryText}>
                        Room
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5" align="left" className={classes.paragraphText}>
                        Invite-only for up to 10 friends.
                    </Typography>
                    <Typography variant="h5" align="left" className={classes.paragraphText}>
                        Everyone can turn on their camera.
                    </Typography>
                </Grid>
            </Grid>
            <Grid container alignContent="center" justify="space-around" direction="column" className={classes.gutterTop}>
                <Grid item xs={12} container>
                    <ButtonWithFeedback
                        disabled={loading}
                        status={loading ? "loading" : null}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        className={classname(classes.hostButton, classes.gutterBottom)}
                        onClick={() => {
                            setupPrivateRoom();
                        }}
                    >
                        Host now
                    </ButtonWithFeedback>
                </Grid>
                <Grid item xs={12} container>
                    <ButtonWithFeedback
                        disabled={loading}
                        status={loading ? "loading" : null}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        className={classes.hostButton}
                        onClick={() => {
                            getRoomLink();
                        }}
                    >
                        Create link for later
                    </ButtonWithFeedback>
                </Grid>
            </Grid>
        </Grid>
    );

    return (
        <SplitCard
            fullHeight={false}
            foreground={foreground}
            leftContent={leftContent}
            rightContent={rightContent}
            background={background}
            showHomeButton={false}
            containerProps={{
                className: classes.container
            }}
            backButton={classes.backButton}
            onBack={(shareurl || scheduleLater) && goBack}
            onLearn={learnMore}
            leftBackground={currentEvent && "rgba(16,8,53,0.85)"}
            rightBackground={(currentEvent && "rgba(16,8,53,0.85)") || "rgba(16,8,53,0.6)"}
            leftWidth={scheduleLater || currentEvent ? 5 : 6}
            rightWidth={scheduleLater || currentEvent ? 7 : 6}
        />
    );
};

export default HostingPickerCard;
