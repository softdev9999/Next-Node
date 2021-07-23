import { useEffect, useState } from "react";
import { withStyles, IconButton, useTheme, Typography } from "@material-ui/core";

import CloseIcon from "@material-ui/icons/CloseRounded";
import { useCurrentRoom } from "hooks/Room/Room";
import { useUser } from "hooks/User/User";
import { Overlay } from "../Overlay/Overlay";
import Video from "../Video/Video";
import ViewfinderInfo from "./ViewfinderInfo";
import VolumeControl from "../VolumeControl/VolumeControl";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import { updateRole } from "utils/API";
import NavPopup from "../NavPopup/NavPopup";
import { useRef } from "react";
import RemoveCoHostConfirmation from "../SidebarAlerts/RemoveCoHostConfirmation";
import useAudioProcessor from "hooks/UserMedia/useAudioProcessor";
function RemoteViewfinder({ participant, classes }) {
    const {
        room: {
            id: roomId,
            type: roomType,
            owner,
            member: { role }
        },

        roomSettings,
        syncing: { host },
        chat
    } = useCurrentRoom();

    const { userId, mediaStream, audioEnabled, videoEnabled } = participant;
    const theme = useTheme();
    const [connectionState, setConnectionState] = useState(participant.state);
    const [volume, setVolume] = useState(-1);
    const [muted, setMuted] = useState(false);
    const removeButtonRef = useRef(null);
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const { user } = useUser(userId);
    const [stream, setStream] = useState(mediaStream);
    const { audioLevel } = useAudioProcessor({ audioStream: stream, output: false, pan: 0, volume: 1, audioEnabled: true, muted: false });

    const {
        devices: { outputDevice }
    } = useMedia();
    useEffect(() => {
        console.log("participant changed", { participant });
        if (participant) {
            let savedSettings = roomSettings.getItem("Participant:" + roomId + ":" + participant.userId);
            if (savedSettings && savedSettings.volume >= 0 && !isNaN(savedSettings.volume)) {
                setVolume(savedSettings.volume);
            } else {
                setVolume(1);
            }
            if (savedSettings && savedSettings.muted) {
                setMuted(savedSettings.muted);
            } else {
                setMuted(false);
            }
        }
    }, [participant]);

    const onMediaStreamChange = (newStream) => {
        setStream(newStream);
    };
    useEffect(() => {
        console.log(userId, user);
    }, [userId, user]);
    useEffect(() => {
        if (volume >= 0 && !isNaN(volume)) {
            roomSettings.setItem("Participant:" + roomId + ":" + participant.userId, { volume, muted });
        }
    }, [volume, muted]);

    useEffect(() => {
        if (participant) {
            console.log("add mediaStreamChange listener", participant);
            participant.on("mediaStreamChange", onMediaStreamChange);
            participant.on("connectionStateChanged", setConnectionState);
            return () => {
                console.log("remove mediaStreamChange listener");
                participant.off("mediaStreamChange", onMediaStreamChange);
                participant.off("connectionStateChanged", setConnectionState);
            };
        }
    }, [participant]);

    const updateGuest = () => {
        updateRole(roomId, userId, "audience").then((data) => {
            if (data) {
                chat.sendData({ eventName: "updatedRole", userId: userId });
            }
        });
    };

    return (
        <Overlay
            disabled={connectionState != "CONNECTED"}
            timeout={4000}
            style={{
                position: "relative",
                height: 0,
                paddingTop: participant.videoEnabled || participant.audioEnabled ? "56.25%" : "56.25%",
                width: "100%",
                transition: theme.transitions.create(),
                overflow: "hidden",
                border: participant.videoEnabled || participant.audioEnabled ? `solid .06125rem ${theme.palette.primary.main}` : "0"
            }}
        >
            <Video stream={stream} videoEnabled={videoEnabled} volume={volume} muted={muted} output={outputDevice} />

            <ViewfinderInfo
                isLocal={true}
                videoEnabled={videoEnabled}
                audioEnabled={audioEnabled}
                user={user}
                type={roomType}
                isOwner={owner.id == userId}
                isHost={host == userId}
                audioLevel={audioLevel}
            />
            <NavPopup
                anchorEl={removeButtonRef.current}
                open={showRemoveConfirmation}
                onDismiss={(res) => {
                    if (res === true) {
                        updateGuest();
                    }
                    setShowRemoveConfirmation(false);
                }}
            >
                <RemoveCoHostConfirmation user={user} />
            </NavPopup>
            <div className={classes.overlayContainer}>
                {role == "owner" && roomType == "public" && (
                    <div className={classes.removeCoHostContainer}>
                        <IconButton
                            ref={removeButtonRef}
                            onClick={() => setShowRemoveConfirmation(true)}
                            classes={{ root: classes.removeCohostButton }}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                )}
                {connectionState != "CONNECTED" && (
                    <div className={classes.connectionState}>
                        <Typography variant="subtitle1" style={{ animation: "pulse-50 2s ease-in-out infinite" }}>
                            {connectionState}
                        </Typography>
                    </div>
                )}
                <div className={classes.volumeContainer}>
                    <VolumeControl onVolumeChange={setVolume} onMutedChange={setMuted} muted={muted} volume={volume} audioEnabled={audioEnabled} />
                </div>
            </div>
        </Overlay>
    );
}

const styles = (theme) => ({
    remoteNoVideo: {
        position: "absolute",
        cursor: "pointer",
        zIndex: 500,
        top: 0,
        left: theme.spacing(1 / 2),
        "&:hover": {
            backgroundColor: "rgba(0,0,0,.4)"
        }
    },
    liveIndicator: {
        zIndex: 500,
        padding: theme.spacing(0.5, 1.5),
        position: "absolute",
        right: theme.spacing(2),
        top: theme.spacing(),
        backgroundColor: "rgba(200,0,0,.6)",
        borderRadius: 10000
    },

    remoteRoot: {
        position: "absolute",
        left: theme.spacing(),
        top: theme.spacing(0.5),
        zIndex: 500,
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0)"
        }
    },
    overlayContainer: {
        position: "absolute",
        zIndex: 4,
        width: "100%",
        height: "100%",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "space-between",

        transition: theme.transitions.create()
    },
    viewfinderVideo: {
        zIndex: 2,
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create(),
        objectFit: "cover",
        objectPosition: "center center"
    },
    noVideo: {
        zIndex: 9,
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        paddingLeft: theme.functions.rems(44),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create()
    },
    overlayRow: {
        display: "flex",
        padding: theme.spacing(0.5),
        width: "100%",
        maxHeight: "70%",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    },
    name: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        display: "flex",
        width: "auto",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "rgba(0,0,0,.3)",
        transition: theme.transitions.create(),
        position: "absolute",
        right: 0,
        bottom: theme.spacing(1 / 2),
        borderTopLeftRadius: 2000,
        borderBottomLeftRadius: 2000
    },
    nameDisabled: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        display: "flex",
        width: "auto",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "rgba(0,0,0,.3)",
        transition: theme.transitions.create(),
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        borderRadius: 2000
    },
    viewfinderControls: {
        flex: "0 1 100%",
        justifyContent: "flex-end",
        position: "absolute",
        bottom: 0,
        right: 10,
        zIndex: 999,
        transition: theme.transitions.create("opacity")
    },
    viewfinderControlsFull: {
        width: "100%",
        flex: "0 1 100%",
        position: "absolute",
        bottom: 20,
        zIndex: 999,
        transition: theme.transitions.create("opacity")
    },

    audioEnabledRoot: {
        flex: "0 0 auto",
        backgroundColor: "rgba(0,0,0,.4)",
        color: "white",
        fontSize: "1.5rem",
        transition: theme.transitions.create("background-color"),

        "&:hover": {
            backgroundColor: "rgba(0,0,0,.7)",
            transition: theme.transitions.create("background-color")
        }
    },
    audioMutedRoot: {
        flex: "0 0 auto",
        backgroundColor: "rgba(255,0,0,.4)",
        color: "white",
        fontSize: "1.5rem",
        transition: theme.transitions.create("background-color"),
        "&:hover": {
            backgroundColor: "rgba(255,0,0,.7)",
            transition: theme.transitions.create("background-color")
        }
    },
    removeCohostButton: {
        backgroundColor: "rgba(0,0,0,.3)",
        color: "white",
        transition: theme.transitions.create("background-color"),
        "&:hover": {
            backgroundColor: "rgba(0,0,0,.5)",
            transition: theme.transitions.create("background-color")
        }
    },
    volumeContainer: {
        position: "absolute",
        left: theme.spacing(2),
        bottom: theme.spacing(1),
        transition: theme.transitions.create(),
        borderRadius: "50%",
        zIndex: 100
    },

    removeCoHostContainer: {
        position: "absolute",
        right: theme.spacing(0.5),
        top: theme.spacing(0.5)
    },
    connectionState: {
        position: "absolute",
        widht: "100%",
        height: "100%",
        left: "0%",
        top: "0%",
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,.8)"
    }
});
export default withStyles(styles)(RemoteViewfinder);
