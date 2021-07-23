import classname from "classnames";
import { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography, Grid, Divider, Link, IconButton, Tooltip } from "@material-ui/core";
import ReminderPopup from "components/Event/ReminderPopup";
import { useApp } from "hooks/Global/GlobalAppState";
import ServiceIcon from "../Icon/ServiceIcon";
import LaunchIcon from "@material-ui/icons/Launch";
import LinkIcon from "@material-ui/icons/Link";
import CheckMarkIcon from "@material-ui/icons/CheckRounded";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import ShareIcon from "@material-ui/icons/SystemUpdateAlt";
import config from "../../config";
import UserAvatar from "../UserAvatar/UserAvatar";
import { isMobile } from "utils/Browser";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
    event: {
        width: "100%",
        display: "flex",
        alignContent: "center",
        paddingBottom: theme.spacing(2)
    },
    eventGrid: {
        background: theme.gradients.create("0", theme.palette.primary.light, theme.palette.secondary.light),
        padding: theme.spacing(2),
        margin: 0
    },
    eventGridPlain: {
        padding: theme.spacing(2),
        margin: 0
    },
    eventImage: {
        width: "100%",
        maxHeight: "20rem",
        maxWidth: "27.5rem",
        objectFit: "contain",
        borderRadius: theme.spacing(2)
    },
    eventDetail: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    },
    eventHeader: {
        width: "100%",
        padding: theme.spacing(2)
    },
    eventFooter: {
        width: "100%",
        background: theme.gradients.create("90", theme.palette.primary.light, theme.palette.primary.main),
        padding: theme.spacing(2),
        cursor: "pointer",
        "&:hover": {
            background: theme.gradients.create("90", theme.palette.secondary.light, theme.palette.primary.lightest)
        }
    },
    eventShareFooter: {
        width: "100%",
        background: theme.gradients.create("90", theme.palette.primary.light, theme.palette.primary.main),
        padding: theme.spacing(2)
    },
    cellCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    hostUsername: {
        background: theme.gradients.create("90", theme.palette.primary.main, theme.palette.primary.lightest),
        padding: "0.5rem 3rem",
        position: "relative",
        top: "-1rem"
    },
    eventStartTime: {
        marginBottom: theme.spacing(2),
        opacity: "0.7"
    },
    eventHostStartTime: {
        marginBottom: theme.spacing(2),
        fontWeight: "bold",
        letterSpacing: 0.21,
        lineHeight: theme.functions.rems(20),
        fontSize: theme.functions.rems(12)
    },
    dateItem: {
        color: "rgba(255,255,255,0.8)"
    },
    defaultDivider: {
        backgroundColor: theme.palette.common.white,
        marginTop: theme.spacing(0.6),
        marginBottom: theme.spacing(0.6)
    },
    lightDivider: {
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.3),
        marginTop: theme.spacing(0.6),
        marginBottom: theme.spacing(0.6)
    },
    primaryText: {
        fontSize: theme.functions.rems(16),
        fontWeight: "bold",
        letterSpacing: 0,
        lineHeight: theme.functions.rems(20),
        textAlign: "center",
        color: theme.palette.common.white
    },
    dateItemNumber: {
        fontFamily: "'Nova Mono', monospace",
        fontWeight: 400,
        color: theme.palette.common.white,
        fontSize: theme.functions.rems(56),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(60)
    },
    dateItemName: {
        fontSize: theme.functions.rems(14),
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: theme.palette.common.white,
        lineHeight: theme.functions.rems(20)
    },
    dateSeparator: {
        height: theme.functions.rems(28),
        width: 1,
        backgroundColor: theme.palette.common.white,
        marginLeft: theme.functions.rems(20),
        marginRight: theme.functions.rems(20),
        marginTop: theme.functions.rems(16)
    },
    smallSeparator: {
        width: 1,
        height: theme.functions.rems(14),
        marginTop: theme.functions.rems(6),
        marginLeft: "1.3rem",
        marginRight: "1.3rem",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    serviceIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.functions.rems(10),
        marginBottom: theme.functions.rems(5)
    },
    button: {
        backgroundColor: "transparent",
        padding: "0.3rem 1rem"
    },
    largeProfile: {
        height: "10rem",
        width: "10rem",

        border: "0.3rem solid #FFF !important",
        boxShadow: "0px 0px 0.5rem 0.5rem rgba(0,0,0,0.3)"
    },
    profileBackground: {
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundImage: `url(/images/profilebanner-1.jpg)`,
        padding: "1rem"
    }
}));

function Event({ event, host, width, reminder, isLive, userHeader, onShare, background = true, isHostEvent }) {
    const classes = useStyles();

    const [reminderSet, setReminderSet] = useState(false);
    const [shareToggle, setShareToggle] = useState(false);
    const [popupTarget, setPopupTarget] = useState(null);
    const [url, setUrl] = useState("");
    const {
        auth: { userId, isFollowingUser }
    } = useApp();

    const copyRef = useRef();

    const [hasCopied, setHasCopied] = useState(null);
    //const [shareUrl, setShareUrl] = useState(null);

    const copyClipboard = (el) => {
        if (process.browser) {
            ga("Copied Event Link");

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

    const postToFacebook = (link) => {
        let shareLink = "https://www.facebook.com/dialog/share?app_id=542101952898971&display=popup&href=" + encodeURIComponent(link);
        window.open(shareLink, "_blank");
        //setShareUrl(link);
    };

    const postToTwitter = (link) => {
        let shareLink = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(link);
        window.open(shareLink, "_blank");
    };

    const calculateTimeLeft = () => {
        let timeLeft = null;

        if (event && event.startTime) {
            const difference = +(event.startTime * 1000) - +new Date();

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24))
                        .toString()
                        .padStart(2, "0"),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
                        .toString()
                        .padStart(2, "0"),
                    minutes: Math.floor((difference / 1000 / 60) % 60)
                        .toString()
                        .padStart(2, "0"),
                    seconds: Math.floor((difference / 1000) % 60)
                        .toString()
                        .padStart(2, "0")
                };
            }
        }

        return timeLeft;
    };

    const formatDate = (d) => {
        //return d;
        return moment.unix(d).format("dddd, MMMM Do, h:mm A");
    };

    const shareEvent = () => {
        //onShare && onShare();
        if (isMobile()) {
          try {
            navigator.share({
              url: url,
              title: event.name
            });
          } catch(e) {
            // sharesheet error
          }
        } else {
          setShareToggle(true);
        }
    };

    const DateItem = ({ name, amount }) => {
        return name ? (
            <>
                <Grid item container direction="column">
                    <Typography
                        className={classname({
                            [classes.dateItem]: !isHostEvent,
                            [classes.dateItemNumber]: isHostEvent
                        })}
                        variant="h2"
                        align="center"
                    >
                        {amount}
                    </Typography>
                    <Typography
                        className={classname({
                            [classes.dateItem]: !isHostEvent,
                            [classes.dateItemName]: isHostEvent
                        })}
                        variant="body2"
                        align="center"
                    >
                        {name}
                    </Typography>
                </Grid>
                {name !== "seconds" && (
                    <Grid item>
                        <div
                            className={classname({
                                [classes.smallSeparator]: !isHostEvent,
                                [classes.dateSeparator]: isHostEvent
                            })}
                        />
                    </Grid>
                )}
            </>
        ) : (
            <></>
        );
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        let t = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 500);

        if (event && event.id && host && host.username) {
            setUrl(config.WEB_HOST + "/" + host.username + "?eventId=" + event.id);
        }

        return () => clearInterval(t);
    }, [event, host]);

    let isSupposedToBeLive =
        event &&
        host &&
        !userHeader &&
        event.userId != host.id &&
        event.startTime < Date.now() / 1000 &&
        event.startTime + 1800 > Date.now() / 1000 &&
        !isLive;
    let canShare = event && onShare;

    return (
        <Grid container className={classes.event}>
            {host && host.id != userId && !isFollowingUser(host.id) && !isSupposedToBeLive && !userHeader && (
                <Grid item className={classes.eventHeader}>
                    <Typography variant="h5" align="center">
                        Follow @{host.username} and get notified of upcoming events
                    </Typography>
                </Grid>
            )}
            {isSupposedToBeLive && (
                <Grid item className={classes.eventFooter}>
                    <Typography variant="h4" align="center" style={{ fontWeight: 900, animation: "pulse-50 2s infinite linear" }}>
                        Waiting for @{host.username} to go live
                    </Typography>
                </Grid>
            )}
            {userHeader && host && (
                <Grid container className={classes.profileBackground} alignContent="center" justify="center" direction="column">
                    <Grid item className={classes.cellCenter}>
                        <UserAvatar alt={host && host.username} className={classes.largeProfile} user={host} disableLink />
                    </Grid>
                    <Grid item className={classes.hostUsername}>
                        <Typography variant="h4" align="center" style={{ fontWeight: 900 }}>
                            @{host.username}
                        </Typography>
                    </Grid>
                </Grid>
            )}
            {event && (
                <Grid
                    className={background ? classes.eventGrid : classes.eventGridPlain}
                    style={{ width: width ? width : "100%" }}
                    container
                    spacing={1}
                    alignContent="center"
                    justify="flex-start"
                    direction="column"
                    wrap="wrap"
                >
                    <Grid item className={classes.eventDetail}>
                        <Typography
                            variant="h4"
                            align="center"
                            className={classname({
                                [classes.primaryText]: isHostEvent
                            })}
                        >
                            {event.url ? (
                                <Link href={event.url} target="_blank" color="white">
                                    {event.title}
                                </Link>
                            ) : (
                                event.title
                            )}
                            {event.url && (
                                <Tooltip title={event.url}>
                                    <IconButton href={event.url} target="_blank">
                                        <LaunchIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Divider
                            component="div"
                            variant="fullWidth"
                            className={classname({
                                [classes.defaultDivider]: isHostEvent,
                                [classes.lightDivider]: !isHostEvent
                            })}
                        />
                    </Grid>
                    {event.service && (
                        <Grid item>
                            <Box className={classes.serviceIcon}>
                                <ServiceIcon name={event.service} height="1rem" opacity="0.7" centered />
                            </Box>
                        </Grid>
                    )}

                    {event.startTime && (
                        <Grid item>
                            <Typography
                                variant="body2"
                                align="center"
                                className={classname({
                                    [classes.eventStartTime]: !isHostEvent,
                                    [classes.eventHostStartTime]: isHostEvent
                                })}
                            >
                                {formatDate(event.startTime)}
                            </Typography>
                        </Grid>
                    )}
                    {event.startTime && timeLeft && (
                        <Grid item className={classes.eventDetail}>
                            <Grid container style={{ width: "auto" }} wrap="nowrap">
                                <DateItem name="days" amount={timeLeft.days} />
                                <DateItem name="hours" amount={timeLeft.hours} />
                                <DateItem name="minutes" amount={timeLeft.minutes} />
                                <DateItem name="seconds" amount={timeLeft.seconds} />
                            </Grid>

                            {reminder && (
                                <Button
                                    style={{ margin: 5 }}
                                    disabled={reminderSet}
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        setPopupTarget(e.currentTarget);
                                    }}
                                >
                                    {reminderSet ? "Reminder Set" : "Set Reminder"}
                                </Button>
                            )}
                        </Grid>
                    )}
                    {event.image && (
                        <Grid item>
                            <img src={event.image} className={classes.eventImage} />
                        </Grid>
                    )}

                    {event.description && (
                        <Grid item className={classes.eventDetail}>
                            <Typography>{event.description}</Typography>
                        </Grid>
                    )}
                    <ReminderPopup
                        eventHost={host}
                        event={event}
                        visible={popupTarget}
                        target={popupTarget}
                        onDismiss={(res) => {
                            setPopupTarget(null);
                            if (res && res.success) {
                                setReminderSet(true);
                            }
                        }}
                    />
                </Grid>
            )}
            {canShare && (
                <>
                    {!shareToggle ? (
                        <Grid container alignContent="center" justify="center" direction="row" className={classes.eventFooter} onClick={shareEvent}>
                            <Grid item className={classes.cellCenter}>
                                <ShareIcon style={{ transform: "rotate(180deg)", fontSize: "1.5rem", marginRight: "0.5rem" }} />
                            </Grid>
                            <Grid item className={classes.cellCenter}>
                                <Typography variant="h5" align="center">
                                    Share this event link
                                </Typography>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container alignContent="center" justify="space-around" direction="row" className={classes.eventShareFooter}>
                            <Grid item>
                                <Typography variant="h5" align="center">
                                    Share on:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={classes.button}
                                    onClick={() => postToTwitter(url)}
                                    startIcon={<TwitterIcon style={{ color: "currentColor" }} />}
                                >
                                    Twitter
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={classes.button}
                                    onClick={() => postToFacebook(url)}
                                    startIcon={<FacebookIcon style={{ color: "currentColor" }} />}
                                >
                                    Facebook
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={classes.button}
                                    onClick={() => copyClipboard(copyRef.current)}
                                    startIcon={
                                        !hasCopied ? (
                                            <LinkIcon style={{ color: "currentColor" }} />
                                        ) : (
                                            <CheckMarkIcon style={{ color: "currentColor" }} />
                                        )
                                    }
                                >
                                    {!hasCopied ? "Copy URL" : "Copied!"}
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                    <textarea ref={copyRef} readOnly={true} style={{ position: "absolute", left: -9999 }} value={url} />
                </>
            )}
        </Grid>
    );
}

export default Event;
