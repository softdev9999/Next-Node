import React from "react";
import { useCallback } from "react";
import { useTheme, makeStyles, Typography, IconButton, ButtonBase, Tooltip } from "@material-ui/core";
import { Remote } from "../Icon/Icon";
import { ShowOnHover } from "../Overlay/Overlay";
import CircleHeadphones from "../Icon/svg/CircleHeadphones.svg";
import UserAvatar from "../UserAvatar/UserAvatar";

const useStyles = makeStyles((theme) => ({
    container: {
        zIndex: 3,
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    },
    errorContainer: {
        zIndex: 3,
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundColor: theme.palette.error.main
    },
    nameEnabled: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: "auto",
        height: "3rem",
        width: "100%",
        backgroundColor: "rgba(0,0,0,.5)",
        zIndex: 10,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-end",
        marginRight: theme.spacing(1)
    },
    liveHostAvatar: {
        position: "absolute",
        right: "50%",
        top: "50%",
        transform: "translate(0%,-50%)",
        width: "40%",
        zIndex: 12,
        height: "auto",
        backgroundColor: theme.palette.secondary.dark
    },
    privateAvatar: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        width: "30%",
        zIndex: 12,
        height: "auto",
        backgroundColor: theme.palette.secondary.dark
    },
    privateAvatarChat: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        width: "80%",
        zIndex: 12,
        height: "auto",
        backgroundColor: theme.palette.secondary.dark
    },
    setupHeadphones: {
        zIndex: 100,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        width: "35%",
        height: "auto",
        borderRadius: "50%"
        //  backgroundColor: theme.palette.secondary.main
    },
    headphonesCircle: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
        boxShadow: "4px 4px 20px 0 rgba(0,0,0,0.25)"
    },
    liveHostNameDisabled: {
        position: "absolute",
        //  backgroundImage: "linear-gradient(90deg, transparent, #000)",
        backgroundColor: "rgba(0,0,0,.5)",
        left: 0,
        right: 0,
        bottom: 0,
        top: "auto",
        height: "5rem",
        width: "100%",
        zIndex: 10,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    liveHostNameDisabledInner: {
        position: "relative",
        paddingRight: theme.spacing(1),
        flex: "0 0 auto",
        width: "55%"
    },
    liveHostNameDisabledInnerHost: {
        position: "relative",
        paddingRight: theme.spacing(1),
        flex: "0 0 auto",
        width: "40%"
    },
    privateNameDisabled: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0,0,0,.5)",
        zIndex: 15
    },
    remoteIconEnabled: {
        height: "3rem",
        width: "3rem",
        backgroundColor: "transparent",
        color: "white",
        display: "flex",
        padding: theme.spacing(0.25),
        marginLeft: theme.spacing(1),
        borderTopLeftRadius: 500,
        borderBottomLeftRadius: 500,
        fontSize: "1.5rem"
    },
    remoteIconEnabledLocal: {
        height: "3rem",
        width: "3rem",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        display: "flex",
        padding: theme.spacing(0.25),
        marginLeft: theme.spacing(1),
        borderTopLeftRadius: 500,
        borderBottomLeftRadius: 500,
        fontSize: "1.5rem"
    },
    remoteIconDisabledLocal: {
        height: "100%",
        width: "1rem",
        backgroundColor: "transparent",
        color: "white",
        fontSize: "1.5rem"
    },
    remoteIconLiveDisabled: {
        height: "3rem",
        width: "3rem",
        backgroundColor: "transparent",
        color: "white",
        fontSize: "1.5rem"
    },
    remoteIconPrivateDisabled: {
        width: "3rem",
        backgroundColor: "transparent",
        color: "white",
        position: "absolute",
        left: "25%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 15,
        fontSize: "1.5rem"
    },
    audioIndicatorEnabled: {
        pointerEvents: "none",
        position: "absolute",
        zIndex: 11,
        width: "100%",
        height: "100%",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    audioIndicatorLiveHostDisabled: {
        position: "absolute",
        right: "50%",
        top: "50%",
        zIndex: 11,

        transform: "translate(0%,-50%)",
        width: "40%",
        height: "auto"
    },
    audioIndicatorDisabled: {
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 11,

        transform: "translate(-50%,-50%)",
        width: "30%",
        height: "auto",
        borderRadius: "50%"
    },
    audioIndicatorInner: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        borderRadius: "inherit",
        transition: theme.transitions.create(["borderWidth", "transform"], { duration: 50 })
    },
    avatarFallbackOuter: {
        height: 0,
        paddingTop: "100%",
        width: "100%",
        position: "relative"
    },
    avatarFallbackInner: {
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 11,

        transform: "translate(-50%,-50%)",
        width: "100%",
        height: "auto",
        borderRadius: "50%",
        textAlign: "center",
        fontSize: "3rem",
        color: "white"
    }
}));

function ViewfinderInfo({ user, videoEnabled, isOwner, isHost, isLocal, type, audioLevel, onRemoteClick, setup }) {
    const theme = useTheme();
    const classes = useStyles();

    const getAudioStyle = () => {
        if (videoEnabled) {
            return { border: `inset .25rem ${theme.functions.rgba("#FFFFFF", audioLevel ** 4)}` };
        } else {
            return { transform: `scale(${1 + audioLevel ** 4 / 4})` };
        }
    };

    const getBackground = useCallback(() => {
        if (type == "public" && !videoEnabled) {
            if (user && user.bannerImageUrl) {
                return { backgroundImage: `url(${user.bannerImageUrl})` };
            } else {
                const defaultImageModifier = user ? (user.id % 3) + 1 : 1;
                return { backgroundImage: `url(${"/images/profilebanner-" + defaultImageModifier + ".jpg"})` };
            }
        } else {
            return { backgroundColor: "transparent" };
        }
    }, [user, type, videoEnabled, setup]);

    const getAvatar = useCallback(() => {
        if (user && !videoEnabled) {
            if (type == "public") {
                return (
                    <UserAvatar className={isOwner ? classes.liveHostAvatar : classes.privateAvatar} user={user} disableLink>
                        <div className={classes.avatarFallbackOuter}>
                            <div className={classes.avatarFallbackInner}>
                                {user && user.username
                                    ? user.username.substring(0, 1).toUpperCase()
                                    : user.displayName && user.displayName.substring(0, 1).toUpperCase()}
                            </div>
                        </div>
                    </UserAvatar>
                );
            } else {
                return (
                    <UserAvatar className={classes.privateAvatar} user={user} disableLink>
                        <div className={classes.avatarFallbackOuter}>
                            <div className={classes.avatarFallbackInner}>
                                {user && user.username
                                    ? user.username.substring(0, 1).toUpperCase()
                                    : user.displayName && user.displayName.substring(0, 1).toUpperCase()}
                            </div>
                        </div>
                    </UserAvatar>
                );
            }
        } else {
            return null;
        }
    }, [user, isOwner, isHost, type, videoEnabled]);

    const getName = useCallback(() => {
        if (user && !setup) {
            if (!videoEnabled) {
                if (type == "public") {
                    if (isOwner) {
                        return (
                            <div key={"overlay"} className={classes.liveHostNameDisabled}>
                                <div className={isHost ? classes.liveHostNameDisabledInnerHost : classes.liveHostNameDisabledInner}>
                                    <Typography style={{ flex: "0 1 100%" }} align="right" variant="h6">
                                        {user.displayName}
                                    </Typography>
                                    <Typography style={{ flex: "0 1 100%", fontStyle: "italic" }} color="textSecondary" align="right" variant="body1">
                                        @{user.username}
                                    </Typography>
                                </div>
                                {isHost && (
                                    <Tooltip title="Pass the Remote">
                                        <IconButton
                                            onClick={onRemoteClick}
                                            style={{ flex: "0 0 3rem" }}
                                            classes={{ root: classes.remoteIconLiveDisabled }}
                                        >
                                            <Remote style={{ color: "white" }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <>
                                <ShowOnHover key={"overlay"} className={classes.privateNameDisabled}>
                                    <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                                        {user.displayName && (
                                            <Typography variant="h6" align="center">
                                                {user.displayName}
                                            </Typography>
                                        )}
                                        {user.username && (
                                            <Typography variant="body1" align="center">
                                                @{user.username}
                                            </Typography>
                                        )}
                                    </div>
                                </ShowOnHover>
                                {isHost && (
                                    <IconButton onClick={onRemoteClick} classes={{ root: classes.remoteIconPrivateDisabled }}>
                                        <Remote />
                                    </IconButton>
                                )}
                            </>
                        );
                    }
                } else {
                    //private room
                    return (
                        <>
                            <ShowOnHover key={"overlay"} className={classes.privateNameDisabled}>
                                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                                    {user.displayName && (
                                        <Typography variant="h6" align="center">
                                            {user.displayName}
                                        </Typography>
                                    )}
                                    {user.username && (
                                        <Typography variant="body1" align="center">
                                            @{user.username}
                                        </Typography>
                                    )}
                                </div>
                            </ShowOnHover>
                            {isHost && (
                                <IconButton onClick={onRemoteClick} classes={{ root: classes.remoteIconPrivateDisabled }}>
                                    <Remote />
                                </IconButton>
                            )}
                        </>
                    );
                }
            } else {
                return (
                    <ShowOnHover key={"overlay"} className={classes.nameEnabled}>
                        <Typography variant="h5">{user.username || user.displayName}</Typography>
                        {isHost && (
                            <ButtonBase
                                disabled={!isLocal}
                                classes={{ root: isLocal ? classes.remoteIconEnabledLocal : classes.remoteIconEnabled }}
                                onClick={onRemoteClick}
                            >
                                <Remote />
                            </ButtonBase>
                        )}
                    </ShowOnHover>
                );
            }
        } else {
            return <div />;
        }
    }, [user, isOwner, isHost, type, isLocal, videoEnabled, setup]);

    const getVolumeIndicatorClass = useCallback(() => {
        if (videoEnabled) {
            return classes.audioIndicatorEnabled;
        } else {
            if (type == "public" && isOwner) {
                return classes.audioIndicatorLiveHostDisabled;
            } else {
                return classes.audioIndicatorDisabled;
            }
        }
    }, [type, isOwner, videoEnabled, setup]);

    const getVolumeIndicatorInnerStyle = () => {
        if (videoEnabled) {
            return { height: "100%", width: "100%", borderRadius: "0%" };
        } else {
            return { backgroundColor: "rgba(255,255,255,.3)", height: 0, paddingTop: "100%", width: "100%", borderRadius: "50%" };
        }
    };

    return (
        <div className={classes.container} style={{ ...getBackground() }}>
            {setup && !videoEnabled && (
                <div className={classes.setupHeadphones}>
                    <div style={{ height: 0, paddingTop: "100%", width: "100%" }} />
                    <div className={classes.headphonesCircle}>
                        <CircleHeadphones />
                    </div>
                </div>
            )}
            {getAvatar()}
            {
                <div className={getVolumeIndicatorClass()}>
                    <div className={classes.audioIndicatorInner} style={{ ...getVolumeIndicatorInnerStyle(), ...getAudioStyle() }} />
                </div>
            }
            {getName()}
        </div>
    );
}
export default ViewfinderInfo;
