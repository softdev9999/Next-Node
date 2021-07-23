import { useEffect, useState, useRef } from "react";
import DeviceSelect from "./DeviceSelect";
import { IconButton, withStyles, Tooltip } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/SyncRounded";

import VideocamIcon from "@material-ui/icons/VideocamRounded";
import VideocamOffIcon from "@material-ui/icons/VideocamOffRounded";
import MicIcon from "@material-ui/icons/MicRounded";
import MicOffIcon from "@material-ui/icons/MicOffRounded";
import SettingsIcon from "@material-ui/icons/SettingsRounded";
import ScenerTheme from "theme/ScenerThemeDefault";
import AudioInfoView from "./AudioInfoView";
import HangUpIcon from "@material-ui/icons/CallEndRounded";
import { useApp } from "hooks/Global/GlobalAppState";
import { useCurrentRoom } from "hooks/Room/Room";
import { useContainerDimensions } from "hooks/Dimensions/Dimensions";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import Coachmark from "../../../Coachmark/Coachmark";
import { ga } from "utils/Tracking";
import { updateRole } from "utils/API";

function MediaControls({ classes }) {
    const {
        auth: { userId }
    } = useApp();
    const {
        room: {
            id: roomId,
            type: roomType,
            member: { role }
        },
        refreshRoom
    } = useCurrentRoom();
    const componentRef = useRef();
    const { width: controlsWidth, height: controlsHeight_ } = useContainerDimensions(componentRef);

    const {
        selectDevice,
        startAudio,
        startVideo,

        start,
        setAudioEnabled,
        setVideoEnabled,
        media: { audioEnabled, videoEnabled, audioTrack, videoTrack },
        status
    } = useMedia();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showHeadphonesInfo, setShowHeadphonesInfo] = useState(false);
    const [shrink, setShrink] = useState(false);

    const hasStartedVideo = useRef(false);

    useEffect(() => {
        console.log("*** WIDTH ***", controlsWidth);
        if (controlsWidth && controlsWidth > 0 && controlsWidth != 104) {
            setShrink(controlsWidth < 220);
        }
    }, [controlsWidth]);

    useEffect(() => {
        if (videoEnabled) {
            hasStartedVideo.current = true;
        }
    }, [videoEnabled]);

    useEffect(() => {
        if (audioEnabled) {
            setShowHeadphonesInfo(true);
        }
    }, [audioEnabled]);

    const renderDeviceSelect = () => {
        return (
            <DeviceSelect
                onDeviceChange={selectDevice}
                visible={settingsOpen}
                onDismiss={() => {
                    setSettingsOpen(false);
                }}
            />
        );
    };

    const openSettings = () => {
        setSettingsOpen(!settingsOpen);
    };

    const toggleAudio = () => {
        if (audioEnabled) {
            //   if (roomType != "public") {
            // stopAudio();
            //   } else {
            setAudioEnabled(false);
            //   }
        } else {
            if (audioTrack) {
                setAudioEnabled(true);
            } else {
                hasStartedVideo.current = true;
                startAudio();
            }
        }
    };

    const toggleVideo = () => {
        if (videoEnabled) {
            // if (roomType != "public") {
            // stopVideo();
            // } else {
            setVideoEnabled(false);
            //  }
        } else {
            if (videoTrack) {
                ga("Turned on camera");
                setVideoEnabled(true);
            } else {
                console.log("has started?", hasStartedVideo.current);
                if (hasStartedVideo.current) {
                    startVideo();
                } else {
                    hasStartedVideo.current = true;
                    start();
                }
            }
        }
    };

    const changeRole = () => {
        if (role == "host") {
            updateRole(roomId, userId, "audience").then((res) => {
                if (res.userId) {
                    refreshRoom();
                }
            });
        }
    };

    return (
        <div
            className={classes.buttonList}
            ref={componentRef}
            style={{
                opacity: 1,
                transition: ScenerTheme.transitions.create()
            }}
        >
            <Coachmark timeout={3000} type="tooltip" title={videoEnabled ? "turn off camera" : "turn on camera"}>
                <div>
                    <IconButton
                        disabled={status.video == "initializing"}
                        onClick={toggleVideo}
                        color={"primary"}
                        size={shrink ? "small" : "medium"}
                        className={videoEnabled ? classes.menuButtonRoot : classes.menuButtonInactiveRoot}
                    >
                        {status.video == "initializing" ? (
                            <div style={{ transform: "scaleX(-1)" }}>
                                <SyncIcon
                                    className={classes.menuButton}
                                    style={{
                                        animation: "spin 3s infinite linear reverse"
                                    }}
                                />
                            </div>
                        ) : videoEnabled ? (
                            <VideocamIcon className={classes.menuButton} />
                        ) : (
                            <VideocamOffIcon className={classes.menuButton} />
                        )}
                    </IconButton>
                </div>
            </Coachmark>

            <Tooltip arrow={true} title={audioEnabled ? "mute microphone" : "un-mute microphone"}>
                <div>
                    {" "}
                    <IconButton
                        disabled={status.audio == "initializing"}
                        onClick={toggleAudio}
                        color={"primary"}
                        size={shrink ? "small" : "medium"}
                        className={videoEnabled ? classes.menuButtonRoot : classes.menuButtonInactiveRoot}
                    >
                        {status.audio == "initializing" ? (
                            <div style={{ transform: "scaleX(-1)" }}>
                                <SyncIcon
                                    className={classes.menuButton}
                                    style={{
                                        animation: "spin 3s infinite linear reverse"
                                    }}
                                />
                            </div>
                        ) : audioEnabled ? (
                            <MicIcon className={classes.menuButton} />
                        ) : (
                            <MicOffIcon className={classes.menuButton} />
                        )}
                    </IconButton>
                </div>
            </Tooltip>

            <Tooltip arrow={true} title={"camera and mic settings"}>
                <div>
                    <IconButton
                        size={shrink ? "small" : "medium"}
                        onClick={openSettings}
                        className={videoEnabled ? classes.menuButtonRoot : classes.menuButtonInactiveRoot}
                    >
                        <SettingsIcon className={classes.menuButton} />
                    </IconButton>
                </div>
            </Tooltip>
            {role == "host" && roomType == "public" && (
                <Tooltip arrow={true} title={"stop co-hosting"}>
                    <div>
                        <IconButton
                            size={shrink ? "small" : "medium"}
                            onClick={changeRole}
                            className={videoEnabled ? classes.dangerousButtonRoot : classes.dangerousButtonInactiveRoot}
                        >
                            <HangUpIcon className={classes.menuButton} />
                        </IconButton>
                    </div>
                </Tooltip>
            )}

            {settingsOpen && renderDeviceSelect()}
            {showHeadphonesInfo && (
                <AudioInfoView
                    onDismiss={() => {
                        setShowHeadphonesInfo(false);
                    }}
                />
            )}
        </div>
    );
}

const styles = (theme) => ({
    buttonList: {
        flex: "1 1 100%",
        display: "flex",
        minHeight: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    mediaControls: {
        backgroundColor: "#aaa",
        flex: "0 1 100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        position: "absolute"
    },
    menuButtonInactiveRoot: {
        color: "white",

        margin: 5,
        background: "rgba(0, 0, 0, 0.7)"
    },
    menuButtonRoot: {
        color: "white",

        margin: 5,
        background: "rgba(0, 0, 0, 0.5)"
    },
    dangerousButtonInactiveRoot: {
        color: "white",

        margin: 5,
        background: "rgba(255, 0, 0, 0.7)"
    },
    dangerousButtonRoot: {
        color: "white",

        margin: 5,
        background: "rgba(255, 0, 0, 0.5)"
    },
    menuButton: {
        color: "white",
        fill: "white",
        transition: ScenerTheme.transitions.create()
    },
    menuButtonDark: {},
    menuButtonRd: {
        borderRadius: 70,
        padding: 10,
        backgroundColor: theme.palette.secondary.main,
        color: "black",
        height: 70,
        width: 70,
        marginRight: 20,
        marginLeft: 20,
        fontSize: "10rem"
    },
    bgGradient: {
        display: "flex",
        width: "100%",
        height: "60px",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundImage: "linear-gradient(180deg, rgba(88, 35, 102, 1) 0%, rgba(38, 22, 75, 1) 100%)"
    },
    mrow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    mcol: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    mleft: {
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    }
});

export default withStyles(styles)(MediaControls);
