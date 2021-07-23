import React, { useState, useEffect, useRef } from "react";
import { useExtension } from "hooks/Extension/Extension";

import { Button, IconButton, withStyles, Typography, Tooltip, useTheme } from "@material-ui/core";

import PauseIcon from "@material-ui/icons/PauseCircleOutline";
import PlayIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useCurrentRoom } from "hooks/Room/Room";
import useRoomStatus from "hooks/Room/RoomStatus";

import ArrowDownIcon from "@material-ui/icons/ArrowDropDownRounded";
import ErrorIcon from "@material-ui/icons/Error";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ArrowRightIcon from "@material-ui/icons/ArrowRightAlt";
import SettingsIcon from '@material-ui/icons/Settings';

import { TV, Remote, LoadingDots, Ticket } from "components/Icon/Icon";
import { useApp } from "hooks/Global/GlobalAppState";
import MobileInfo from "../Mobile/MobileInfo";
import config from "config";

const RoomStatusBar = ({ classes, onOpenService, selectServiceButtonRef }) => {
    // status.extra = { title, message, icon }
    const theme = useTheme();
    const { status } = useRoomStatus();
    const {
        auth: { userId }
    } = useApp();
    const {
        syncing: { host }
    } = useCurrentRoom();
    const { isExtensionInstalled, openContentTab } = useExtension();

    const isHost = host == userId;
    const [showExtra, setShowExtra] = useState(false);
    const [lastStatus, setLastStatus] = useState(null);
    const [shownExtras, setShownExtras] = useState(new Set([]));
    const [showMobilePrompt, setShowMobilePrompt] = useState(false);

    const extraTimeout = useRef();

    useEffect(() => {
        if (status && status.extra) {
            let extras = new Set(shownExtras);

            // only show extras that have ID's once per iteration of room
            if (status.extra.id) {
                setLastStatus(status.extra.id);

                if (lastStatus != status.extra.id) {
                    if (!shownExtras.has(status.extra.id)) {
                        extras.add(status.extra.id);
                        setShownExtras(extras);
                        setShowExtra(true);

                        if (status.extra.timeout) {
                            if (extraTimeout.current) {
                                clearTimeout(extraTimeout.current);
                                extraTimeout.current = null;
                            }

                            extraTimeout.current = setTimeout(() => {
                                setShowExtra(false);
                            }, status.extra.timeout * 1000);
                        }
                    } else {
                        setShowExtra(false);
                    }
                }
            } else if (status.extra.always) {
                setLastStatus(null);
                setShowExtra(true);
            } else {
                setLastStatus(null);
                setShowExtra(false);
            }
        } else {
            setLastStatus(null);
            setShowExtra(false);
        }

        ////console.log('*** STATUS BEFORE ***', status);
    }, [status, shownExtras, lastStatus]);

    const getLogo = () => {
        //console.log("get logo", status.hostService);

        if (config.SERVICE_LIST[status.hostService] && config.SERVICE_LIST[status.hostService].statusName) {
            return config.SERVICE_LIST[status.hostService].statusName;
        } else {
            return null;
        }
    };

    const serviceButtonClick = () => {

        if (isExtensionInstalled) {
          if (status.hostService && config.SERVICE_LIST[status.hostService] && config.SERVICE_LIST[status.hostService].promptStart) {
            // this service has config options
            openContentTab(config.getStartUrl() + "service?setting=" + status.hostService);
          }
        } else {
          setShowMobilePrompt(true);
        }
    };

    const serviceButtonActive = () => {
      return !isExtensionInstalled || (status.hostService && config.SERVICE_LIST[status.hostService] && config.SERVICE_LIST[status.hostService].promptStart);
    };

    useEffect(() => {
        if (!isExtensionInstalled) {
            setShowMobilePrompt(true);
        }
    }, [isExtensionInstalled]);

    const renderServiceButton = () => {
        if ((isHost || status.relaunchButton) && isExtensionInstalled) {
            if (isHost) {
                return (
                    <Button
                        fullWidth
                        classes={{ root: classes.menuButtonService, label: classes.menuButtonRelaunchLabel }}
                        variant={"text"}
                        onClick={() => onOpenService()}
                        endIcon={<ArrowDownIcon style={{ fontSize: "2em" }} />}
                    >
                        {getLogo() || "SELECT SERVICE"}
                    </Button>
                );
            } else if (status.hostService) {
                return (
                    <Button
                        fullWidth
                        classes={{ root: classes.menuButtonRelaunch, label: classes.menuButtonRelaunchLabel }}
                        variant={"text"}
                        onClick={() => onOpenService(status.hostService)}
                    >
                        Relaunch&nbsp;&nbsp;
                        {getLogo()}
                    </Button>
                );
            }
        } else if (status.hostService) {
            return (
                <div onClick={serviceButtonClick} className={serviceButtonActive() ? classes.menuButtonRelaunch : classes.menuButtonRelaunchDisabled} style={{ color: "white", fontSize: "0.8em" }}>

                    {getLogo()}
                    {isExtensionInstalled && config.SERVICE_LIST[status.hostService] && config.SERVICE_LIST[status.hostService].promptStart && (
                      <Tooltip title={"Settings"}>
                        <IconButton style={{ padding: 0, marginLeft: "0.5rem" }}>
                          <SettingsIcon style={{fontSize: "1rem"}} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!isExtensionInstalled && (
                        <IconButton style={{ padding: 0, marginLeft: "0.5rem" }}>
                            <TV style={{ height: "2rem" }} />
                        </IconButton>
                    )}

                </div>
            );
        } else {
            return null;
        }
    };

    useEffect(() => {
        return () => {
            if (extraTimeout.current) {
                clearTimeout(extraTimeout.current);
                extraTimeout.current = null;
            }
        };
    }, []);

    useEffect(() => {
        //console.log(status);
    }, [status]);

    let statusClasses = {
        default: classes.videoStatusBar,
        active: classes.videoStatusBarActive,
        warning: classes.videoStatusBarWarning
    };

    let statusIcons = {
        pause: <PauseIcon className={classes.statusIcon} />,
        play: <PlayIcon className={classes.statusIcon} />,
        choose: <ArrowBackIcon className={classes.statusIconDark} />,
        loading: <LoadingDots style={{ width: "4rem", height: "4rem", color: "white" }} />,
        remote: (
            <IconButton className={classes.largeIconWrapper} disabled>
                <Remote style={{ animation: "wiggle 1.5s infinite ease" }} className={classes.largeIcon} />
            </IconButton>
        ),
        ticket: (
            <IconButton className={classes.largeIconWrapper} disabled>
                <Ticket style={{ width: "3rem", animation: "wiggle 1.5s infinite ease" }} className={classes.largeIcon} />
            </IconButton>
        ),
        thumbsup: (
            <IconButton className={classes.largeIconWrapper} disabled>
                <ThumbUpIcon style={{ animation: "punch 1s infinite linear" }} className={classes.largeIcon} />
            </IconButton>
        ),
        playarrow: (
            <IconButton style={{ animation: "pulse-50 1.5s infinite ease" }} className={classes.largeIconWrapper} disabled>
                <PlayIcon className={classes.largeIcon} />
            </IconButton>
        ),
        error: <ErrorIcon style={{ animation: "pulse-50 1.5s infinite ease", fontSize: "5rem", color: "white" }} className={classes.largeIcon} />
    };

    let showBarStatus = !showExtra || (status.extra && status.extra.showMain);

    return (
        <>
            <div className={status && statusClasses[status.class]}>
                {showBarStatus && status && status.icon && statusIcons[status.icon] ?
                  <Tooltip title={isExtensionInstalled ? (status.timer || "0:00") : null}>
                    {statusIcons[status.icon]}
                  </Tooltip> : " "}
                <Typography
                    noWrap={true}
                    variant={"body2"}
                    className={classes.statusText}
                    style={{
                        marginLeft: showBarStatus && status.icon ? "0rem" : "1rem",
                        maxWidth: "100%",
                        lineHeight: "33px",
                        color: status.class != "warning" ? "#fff" : "#fff"
                    }}
                >
                    {status.timer && !isExtensionInstalled && (
                        <span
                            style={{
                                color: "#ddd",
                                minWidth: "4.5rem",
                                letterSpacing: ".07em",
                                display: "inline-block",
                                fontWeight: 900
                            }}
                        >
                            {status.timer}{" "}
                        </span>
                    )}
                    {showBarStatus ? status.message : " " + status.title}
                </Typography>

                <div style={{ flex: "1 1 0%" }} ref={selectServiceButtonRef}>
                    {renderServiceButton()}
                </div>
            </div>
            {status && status.extra && showExtra && (
                <div
                    className={status.extra.showMain || status.class == "default" ? classes.videoStatusLargeDefault : classes.videoStatusLarge}
                    style={{ marginTop: status.extra.showMain ? 0 : 0 }}
                >
                    <div className={classes.videoStatusLargeIcon}>{status.extra.icon && statusIcons[status.extra.icon]}</div>
                    <div className={classes.videoStatusLargeMessage}>
                        <Typography align="left" variant="h5">
                            {status.extra.title}
                            {status.extra.message && (
                                <span style={{ display: "block", ...theme.typography.body1, fontSize: "0.9rem" }}>{status.extra.message}</span>
                            )}

                        </Typography>
                    </div>
                </div>
            )}
            {isHost && !isExtensionInstalled && (
                <div className={classes.videoStatusBarWarning}>
                    <ArrowRightIcon style={{ marginLeft: "0.35em", fontSize: "3em", transform: "rotate(90deg)" }} />
                    <Typography
                        variant={"body1"}
                        align={"center"}
                        className={classes.statusText}
                        style={{
                            maxWidth: "100%",
                            padding: 10,
                            fontWeight: 700,
                            color: "#fff"
                        }}
                    >
                        You have the remote
                    </Typography>
                    <Typography
                        variant={"body2"}
                        align={"center"}
                        style={{
                            fontSize: "0.7em",
                            paddingRight: 20,
                            paddingTop: 5,
                            paddingBottom: 2,
                            maxWidth: "100%",
                            color: "#fff"
                        }}
                    >
                        To sync, <b>pass the remote</b> to someone using the Scener Chrome Extension on their laptop.
                    </Typography>
                </div>
            )}
            <MobileInfo visible={showMobilePrompt} onDismiss={() => setShowMobilePrompt(null)} />
        </>
    );
};

const styles = (theme) => ({
    statusIcon: {
        fontSize: theme.spacing(4),
        margin: theme.spacing(0.5),
        "& circle": {
            fill: "white !important"
        }
    },
    largeIcon: {
        fontSize: theme.spacing(6),
        color: theme.palette.primary.dark
    },
    largeIconWrapper: {
        minWidth: theme.spacing(9.5),
        minHeight: theme.spacing(9.5),
        backgroundColor: "white !important"
    },
    statusIconDark: {
        fontSize: theme.spacing(4),
        color: theme.palette.primary.dark,
        margin: theme.spacing(0.5)
    },
    statusText: {
        margin: theme.spacing(0.5),
        marginLeft: theme.spacing(1),
        flex: "0 1 100%"
    },

    menuButtonRelaunch: {
        backgroundColor: theme.palette.primary.darkest,
        borderRadius: 0,
        cursor: "pointer",
        whiteSpace: "nowrap",
        padding: theme.spacing(1.5),
        paddingLeft: theme.spacing(2),
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.light},${theme.palette.primary.darkest})`,
        "&:hover": {
            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.light},${theme.palette.primary.main})`
        }
    },
    menuButtonRelaunchDisabled: {
        backgroundColor: theme.palette.primary.darkest,
        borderRadius: 0,
        whiteSpace: "nowrap",
        padding: theme.spacing(1.5),
        paddingLeft: theme.spacing(2),
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.light},${theme.palette.primary.darkest})`
    },
    menuButtonRelaunchLabel: {
        whiteSpace: "nowrap"
    },
    menuButtonService: {
        minHeight: theme.functions.rems(39),
        backgroundColor: theme.palette.primary.darkest,
        borderRadius: 0,
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.light})`,
        "&:hover": {
            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.light},${theme.palette.primary.main})`
        }
    },
    menuButtonCancel: {
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.functions.rgba("#FF0000", 0.8),
        padding: 0,
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing(),
        marginLeft: 20,
        maxHeight: 30
    },
    menuButton: {
        color: "white",
        fontSize: 30
    },
    videoStatusBarActive: {
        maxWidth: "100vw",
        width: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.primary.dark,
        color: "#FFF"
    },
    videoStatusBarWarning: {
        maxWidth: "100vw",
        width: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        backgroundColor: theme.palette.primary.light,
        borderBottom: "1px solid #000"
    },
    videoStatusBar: {
        width: "100%",
        maxWidth: "100vw",
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.primary.dark,
        color: "#fff"
    },
    videoStatusLarge: {
        width: "100%",
        maxWidth: "100vw",
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "center",
        height: theme.spacing(16),
        minHeight: theme.spacing(21.5),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.darkest})`,
        color: "#fff"
    },
    videoStatusLargeDefault: {
        width: "100% ",
        maxWidth: "100vw",
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "center",
        padding: theme.spacing(4),
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.darkest})`,
        color: "#fff"
    },
    videoStatusLargeIcon: {
        display: "flex",
        marginRight: theme.spacing(2.5),
        flexFlow: "column",
        alignContent: "center",
        justifyContent: "center"
    },
    videoStatusLargeMessage: {
        display: "flex",
        alignItems: "center"
    },
    remoteViewfinderContainer: {
        width: "100%",
        display: "flex",
        flexFlow: "row wrap",
        alignContent: "flex-start",
        justifyContent: "flex-start"
    }
});

export default withStyles(styles)(RoomStatusBar);
