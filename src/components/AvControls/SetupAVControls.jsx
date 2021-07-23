import { useRef, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import { Grid, Select, MenuItem, Typography, ButtonBase, CircularProgress } from "@material-ui/core";

import VideocamIcon from "@material-ui/icons/VideocamRounded";
import VideocamOffIcon from "@material-ui/icons/VideocamOffRounded";
import MicIcon from "@material-ui/icons/MicRounded";
import MicOffIcon from "@material-ui/icons/MicOffRounded";
import HeadphoneIcon from "@material-ui/icons/Headset";
import AudioIndicator from "../AudioIndicator/AudioIndicator";
const useStyles = makeStyles((theme) => ({
    disabled: {
        opacity: 0.8
    },
    buttonWrapper: {
        backgroundColor: "rgba(150,150,150,.1)",
        borderRadius: "0.4rem",
        height: "5rem",
        padding: theme.spacing(0, 2),
        overflow: "hidden",
        position: "relative"
    },
    initButtonRoot: {
        height: "5rem",
        borderRadius: "0.4rem",
        padding: theme.spacing(0, 2),

        marginRight: theme.spacing(-2),
        marginLeft: theme.spacing(-2),
        // border: "solid .125rem white",
        width: `calc(100% + ${theme.spacing(4)})`,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        transition: theme.transitions.create(["backgroundColor", "color"]),
        "&:hover": {
            backgroundColor: "rgba(255,255,255,.2)"
        }
    },
    initButtonLabel: {
        marginLeft: theme.spacing(2),
        flex: "0 1 100%",
        textAlign: "left"
    },
    initButtonError: {
        height: "5rem",
        borderRadius: "1rem",
        padding: theme.spacing(0, 2),

        marginRight: theme.spacing(-2),
        marginLeft: theme.spacing(-2),
        // border: "solid .125rem white",
        width: `calc(100% + ${theme.spacing(4)})`,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        transition: theme.transitions.create(["backgroundColor", "color"]),
        backgroundColor: "rgba(255,0,0,.4)",
        "&:hover": {
            backgroundColor: "rgba(255,0,0,.4)"
        }
    },
    enableButtonRoot: {
        flex: "0 0 4rem",
        height: "4rem",
        width: "4rem",
        border: "solid .125rem white",
        borderRadius: "2rem",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transition: theme.transitions.create(["backgroundColor", "color"]),
        marginRight: theme.spacing(2),
        "&:hover": {
            backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.5)
        }
    },
    enableButtonLabel: {
        marginLeft: theme.spacing(0.5),
        fontSize: "1.2rem"
    },
    disableButtonRoot: {
        flex: "0 0 4rem",
        height: "4rem",
        width: "4rem",
        border: "solid .125rem white",
        borderRadius: "2rem",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
        transition: theme.transitions.create(["backgroundColor", "width", "color"]),
        marginRight: theme.spacing(2),
        "&:hover": {
            backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.5)
        }
    },
    disableButtonLabel: {
        marginLeft: theme.spacing(0.5),
        fontSize: "1.2rem"
    },
    buttonIconContainerInit: {
        borderRadius: "50%",
        height: "4rem",
        width: "4rem",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        border: "solid .125rem white",
        flex: "0 0 4rem"
    },
    buttonIconContainer: {
        borderRadius: "2rem",
        height: "4rem",
        width: "4rem",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        border: "solid .125rem transparent",
        flex: "0 0 4rem"
    },
    buttonIcon: {
        fontSize: "2rem",
        height: "2rem",
        width: "2rem"
    },
    mediaSelect: {
        flex: "0 1 100%",
        overflow: "hidden",
        width: "100%"
    },
    headphoneIconContainer: {
        flex: "0 0 3rem",
        height: "3rem",
        width: "3rem",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center"
    },

    audioIndicator: {
        position: "absolute",
        top: ".5rem",
        left: "5.75rem",
        right: "1rem",
        height: ".5rem"
    }
}));

const SetupAvControls = ({ autostart }) => {
    const classes = useStyles();

    const {
        start,
        startAudio,
        startVideo,
        stopAudio,
        stopVideo,
        media: { audioEnabled, videoEnabled },
        status,
        audioLevel,

        permissions,
        requestPermissions,
        checkPermissions,
        devices: {
            audioDevice,
            selectAudioDevice,
            videoDevice,
            selectVideoDevice,
            availableDevices,
            selectOutputDevice,
            outputDevice,
            loadAvailableDevices
        }
    } = useMedia();

    const hasEnabled = useRef({ audio: !!audioEnabled, video: !!videoEnabled }).current;
    useEffect(() => {
        if (autostart) {
            checkPermissions().then(({ audio, video }) => {
                if (audio && video) {
                    start();
                } else if (video) {
                    startVideo();
                } else if (audio) {
                    startAudio();
                }
            });
        }
    }, []);

    useEffect(() => {
        if (audioEnabled) {
            hasEnabled.audio = true;
        }
        if (videoEnabled) {
            hasEnabled.video = true;
        }
    }, [audioEnabled, videoEnabled]);

    const toggleAudio = async () => {
        if (permissions.audio === false) {
            console.log("SHOW HELP");
            window.open("/help/permissions", "scener-help");
        } else {
            if (permissions.video === null && permissions.audio === null) {
                let res = await requestPermissions();
                if (res !== true) {
                    return;
                } else {
                    loadAvailableDevices();
                }
            }
            if (status.audio != "initializing") {
                if (audioEnabled) {
                    stopAudio();
                } else {
                    startAudio(audioDevice);
                }
            }
        }
    };

    const toggleVideo = async () => {
        if (permissions.video === false) {
            console.log("SHOW VIDEO HELP");
            window.open("/help/permissions", "scener-help");
        } else {
            if (permissions.video === null && permissions.audio === null) {
                let res = await requestPermissions();
                if (res !== true) {
                    return;
                } else {
                    loadAvailableDevices();
                }
            }
            if (status.video != "initializing") {
                if (videoEnabled) {
                    stopVideo();
                } else {
                    startVideo(videoDevice);
                }
            }
        }
    };

    const videoUnavailable = useMemo(() => !availableDevices || !availableDevices.video.length, [availableDevices]);
    const audioUnavailable = useMemo(() => !availableDevices || !availableDevices.audio.length, [availableDevices]);
    const outputUnavailable = useMemo(() => !availableDevices || !availableDevices.output.length, [availableDevices]);

    const getVideoButtonClass = () => {
        if (hasEnabled.video) {
            if (videoEnabled) {
                return classes.disableButtonRoot;
            } else {
                return classes.enableButtonRoot;
            }
        } else {
            if (permissions.video !== false) {
                return classes.initButtonRoot;
            } else {
                return classes.initButtonError;
            }
        }
    };

    const getAudioButtonClass = () => {
        if (hasEnabled.audio) {
            if (audioEnabled) {
                return classes.disableButtonRoot;
            } else {
                return classes.enableButtonRoot;
            }
        } else {
            if (permissions.audio !== false) {
                return classes.initButtonRoot;
            } else {
                return classes.initButtonError;
            }
        }
    };

    return (
        <Grid container spacing={1} alignContent="flex-start" justify="flex-start">
            <Grid item xs={12} sm={12}>
                <Grid container alignItems="center" justify="space-between" wrap="nowrap" className={classes.buttonWrapper}>
                    <ButtonBase
                        disabled={videoUnavailable || status.video == "initializing"}
                        onClick={toggleVideo}
                        classes={{
                            root: getVideoButtonClass(),
                            disabled: classes.disabled
                        }}
                    >
                        <div className={!hasEnabled.video ? classes.buttonIconContainerInit : classes.buttonIconContainer}>
                            {status.video == "initializing" ? (
                                <CircularProgress size={"1em"} color="inherit" />
                            ) : (videoEnabled || !hasEnabled.video) && !videoUnavailable && permissions.video !== false ? (
                                <VideocamIcon className={classes.buttonIcon} />
                            ) : (
                                <VideocamOffIcon className={classes.buttonIcon} />
                            )}
                        </div>
                        {permissions.video === false && (
                            <span className={classes.initButtonLabel}>
                                <Typography variant="h5">Error: Permission Denied</Typography>
                                <Typography variant="subtitle1">How do I fix this?</Typography>
                            </span>
                        )}
                        {!hasEnabled.video && !videoUnavailable && permissions.video !== false && (
                            <Typography variant="h5" className={classes.initButtonLabel}>
                                Enable Camera
                            </Typography>
                        )}
                        {!hasEnabled.video && videoUnavailable && (
                            <Typography variant="h5" className={classes.initButtonLabel}>
                                No Camera Found
                            </Typography>
                        )}
                    </ButtonBase>

                    {hasEnabled.video && (
                        <Select
                            disabled={videoUnavailable}
                            className={classes.mediaSelect}
                            value={videoDevice ? videoDevice.deviceId : ""}
                            onChange={({ target: { value } }) => selectVideoDevice(value)}
                            inputProps={{
                                name: "video"
                            }}
                        >
                            {!videoUnavailable && !videoDevice && <MenuItem value={""}>Select a Camera</MenuItem>}
                            {!videoUnavailable &&
                                availableDevices.video.map((d) => (
                                    <MenuItem key={d.deviceId} value={d.deviceId}>
                                        {d.label}
                                    </MenuItem>
                                ))}
                        </Select>
                    )}
                </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
                <Grid container alignItems="center" justify="space-between" wrap="nowrap" className={classes.buttonWrapper}>
                    <ButtonBase
                        disabled={status.audio == "initializing" || audioUnavailable}
                        onClick={toggleAudio}
                        classes={{
                            root: getAudioButtonClass(),
                            disabled: classes.disabled
                        }}
                    >
                        <div className={!hasEnabled.video ? classes.buttonIconContainerInit : classes.buttonIconContainer}>
                            {status.audio == "initializing" ? (
                                <CircularProgress size={"1em"} color="inherit" />
                            ) : (audioEnabled || !hasEnabled.audio) && !audioUnavailable && permissions.audio !== false ? (
                                <MicIcon className={classes.buttonIcon} />
                            ) : (
                                <MicOffIcon className={classes.buttonIcon} />
                            )}
                        </div>
                        {permissions.audio === false && (
                            <span className={classes.initButtonLabel}>
                                <Typography variant="h5">Error: Permission Denied</Typography>
                                <Typography variant="subtitle1">How do I fix this?</Typography>
                            </span>
                        )}
                        {!hasEnabled.audio && !audioUnavailable && permissions.audio !== false && (
                            <Typography variant="h5" className={classes.initButtonLabel}>
                                Enable Microphone
                            </Typography>
                        )}
                        {!hasEnabled.audio && audioUnavailable && (
                            <Typography variant="h5" className={classes.initButtonLabel}>
                                No Microphone Found
                            </Typography>
                        )}
                    </ButtonBase>
                    {hasEnabled.audio && (
                        <>
                            <div className={classes.audioIndicator}>
                                <AudioIndicator horizontal audioEnabled={audioEnabled} audioLevel={audioLevel} />
                            </div>
                            <Select
                                disabled={audioUnavailable}
                                className={classes.mediaSelect}
                                value={audioDevice ? audioDevice.deviceId : ""}
                                onChange={({ target: { value } }) => selectAudioDevice(value)}
                                inputProps={{
                                    name: "audio",
                                    id: "audio-select"
                                }}
                            >
                                {!audioUnavailable && !audioDevice && <MenuItem value={""}>Select a Microphone</MenuItem>}
                                {!audioUnavailable &&
                                    availableDevices.audio.map((d) => (
                                        <MenuItem key={d.deviceId} value={d.deviceId}>
                                            {d.label}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </>
                    )}
                </Grid>
            </Grid>

            {false && !outputUnavailable && (
                <Grid item xs={12} sm={12}>
                    <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                        <div className={classes.headphoneIconContainer}>
                            <HeadphoneIcon className={classes.buttonIcon} />
                        </div>
                        <Select
                            disabled={outputUnavailable}
                            className={classes.mediaSelect}
                            value={outputDevice ? outputDevice.deviceId : ""}
                            onChange={({ target: { value } }) => selectOutputDevice(value)}
                            inputProps={{
                                name: "output",
                                id: "output-select"
                            }}
                        >
                            <MenuItem value={""}></MenuItem>
                            {!outputUnavailable &&
                                availableDevices.output.map((d) => (
                                    <MenuItem key={d.deviceId} value={d.deviceId}>
                                        {d.label}
                                    </MenuItem>
                                ))}
                        </Select>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default SetupAvControls;
