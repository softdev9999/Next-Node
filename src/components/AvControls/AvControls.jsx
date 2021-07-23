import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useCurrentRoom } from "hooks/Room/Room";
import DeviceSelect from "../Sidebar/Video/Controls/DeviceSelect";
import { ga } from "utils/Tracking";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import Coachmark from "../Coachmark/Coachmark";
import { Tooltip, IconButton } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/SyncRounded";
import VideocamIcon from "@material-ui/icons/VideocamRounded";
import VideocamOffIcon from "@material-ui/icons/VideocamOffRounded";
import MicIcon from "@material-ui/icons/MicRounded";
import MicOffIcon from "@material-ui/icons/MicOffRounded";
import SettingsIcon from "@material-ui/icons/SettingsRounded";
import { useExtension } from "hooks/Extension/Extension";
import config from "config/index";
const useStyles = makeStyles(() => ({
    menuButtonInactiveRoot: {
        color: "rgba(255,255,255,.7)",
        flex: "0 0 auto"
    },
    menuButtonRoot: {
        color: "rgba(255,255,255,1)",
        flex: "0 0 auto"
    }
}));

const AvControls = ({ classes: passedStyles }) => {
    const classes = Object.assign({}, useStyles(), passedStyles);

    const { roomSettings } = useCurrentRoom();
    const { sendMessage } = useExtension();
    const {
        selectDevice,
        startAudio,
        startVideo,

        setAudioEnabled,
        setVideoEnabled,
        media: { audioEnabled, videoEnabled, audioTrack, videoTrack },
        status,
        lastUpdated,
        permissions
    } = useMedia();
    const [anchorEl, setAnchorEl] = useState(null);
    const hasStartedVideo = useRef(false);

    const openSettings = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
    };

    const openSetupPopup = () => {
        console.log("open setup popup");
        sendMessage("openPopup", "background", { url: config.getStartUrl() + "camera", key: "avSetup" });
        //sendMessage("openAvSetupPopup", "background", {});
    };

    const toggleAudio = () => {
        if (permissions.audio === true) {
            if (status.audio != "initializing") {
                if (audioEnabled) {
                    setAudioEnabled(false);
                } else {
                    if (audioTrack) {
                        setAudioEnabled(true);
                    } else {
                        hasStartedVideo.current = true;
                        startAudio();
                    }
                }
            }
        } else if (permissions.audio === false) {
            //TODO: show help for resetting permissions
            alert("allow camera");
        } else {
            openSetupPopup();
        }
    };

    const toggleVideo = () => {
        console.log(permissions, status);
        if (status.video != "initializing") {
            if (permissions.video === true) {
                if (videoEnabled) {
                    setVideoEnabled(false);
                } else {
                    if (videoTrack) {
                        ga("Turned on camera");
                        setVideoEnabled(true);
                    } else {
                        console.log("has started?", hasStartedVideo.current);

                        startVideo();

                        hasStartedVideo.current = true;
                    }
                }
            } else if (permissions.video === false) {
                alert("allow camera");
            } else {
                openSetupPopup();
            }
        }
    };

    useEffect(() => {
        if (videoEnabled) {
            roomSettings.setItem("videoEnabled", true);
        } else if (videoEnabled === false) {
            roomSettings.setItem("videoEnabled", false);
        }
        if (audioEnabled) {
            roomSettings.setItem("audioEnabled", true);
        } else if (audioEnabled === false) {
            roomSettings.setItem("audioEnabled", false);
        }
    }, [lastUpdated]);

    return (
        <>
            <Coachmark timeout={3000} type="tooltip" title={videoEnabled ? "turn off camera" : "turn on camera"}>
                <IconButton
                    onClick={toggleVideo}
                    classes={{ root: classes.button }}
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
            </Coachmark>

            <Tooltip arrow={true} title={audioEnabled ? "mute microphone" : "un-mute microphone"}>
                <IconButton
                    classes={{ root: classes.button }}
                    onClick={toggleAudio}
                    className={audioEnabled ? classes.menuButtonRoot : classes.menuButtonInactiveRoot}
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
            </Tooltip>

            <Tooltip arrow={true} title={"camera and mic settings"}>
                <IconButton classes={{ root: classes.button }} onClick={openSettings} className={classes.menuButtonRoot}>
                    <SettingsIcon className={classes.menuButton} />
                </IconButton>
            </Tooltip>

            <DeviceSelect
                onDeviceChange={selectDevice}
                visible={!!anchorEl}
                anchorEl={anchorEl}
                onDismiss={() => {
                    setAnchorEl(null);
                }}
            />
        </>
    );
};

export default AvControls;
