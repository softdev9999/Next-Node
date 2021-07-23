import React, { useState, useEffect, useMemo } from "react";
import { Typography, MenuItem, useTheme, DialogTitle, DialogContent } from "@material-ui/core";

import { User } from "hooks/User/User";
import { useCurrentRoom } from "hooks/Room/Room";
import { useApp } from "hooks/Global/GlobalAppState";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import Video from "../Video/Video";
import { Overlay } from "../Overlay/Overlay";
import ViewfinderInfo from "./ViewfinderInfo";
import NavPopup from "../NavPopup/NavPopup";
import ViewfinderError from "./ViewfinderError";
function LocalViewfinder() {
    const theme = useTheme();
    const {
        auth: { user: localuser, userId }
    } = useApp();
    const {
        participants,
        room: { owner, type: roomType },
        syncing: { passRemote, host },

        roomSettings
    } = useCurrentRoom();
    const {
        mediaState: { videoEnabled, audioEnabled, videoStream },
        audioLevel,
        start,
        startVideo,
        startAudio,

        videoError,
        audioError,
        permissions,
        resetErrors
    } = useMedia();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showRemotePass, setShowRemotePass] = useState(false);
    const isOwner = useMemo(() => owner.id == userId, [userId, owner]);

    useEffect(() => {
        if (!videoEnabled && !audioEnabled) {
            checkEnabled();
        }
    }, [permissions]);

    const checkEnabled = () => {
        return roomSettings.readAll().then(() => {
            console.log("videoEnabled", roomSettings.getItem("videoEnabled"), "audioEnabled", roomSettings.getItem("audioEnabled"));
            if (permissions.video && roomSettings.getItem("videoEnabled")) {
                if (permissions.audio && roomSettings.getItem("audioEnabled")) {
                    start();
                } else {
                    startVideo();
                }
            } else if (roomSettings.getItem("audioEnabled") && permissions.audio) {
                startAudio();
            } else {
                return false;
            }
        });
    };

    const openPassRemote = ({ currentTarget }) => {
        if (currentTarget) {
            setAnchorEl(currentTarget);
        } else {
            setAnchorEl(null);
        }
        setShowRemotePass(true);
    };

    return (
        <Overlay
            timeout={4000}
            style={{
                position: "relative",
                height: 0,
                paddingTop: videoEnabled || audioEnabled ? "56.25%" : "56.25%",
                width: "100%",
                transition: theme.transitions.create(),
                overflow: "hidden",
                border: videoEnabled || audioEnabled ? `solid .06125rem ${theme.palette.primary.main}` : "0"
            }}
        >
            <Video videoEnabled={videoEnabled} stream={videoStream} flipped={true} volume={0} muted={true} />
            <ViewfinderInfo
                isLocal={true}
                videoEnabled={videoEnabled}
                audioEnabled={audioEnabled}
                user={localuser}
                type={roomType}
                isOwner={isOwner}
                isHost={host == userId}
                audioLevel={audioLevel}
                onRemoteClick={openPassRemote}
            />
            <ViewfinderError error={videoError || audioError} onDismiss={resetErrors} />

            {participants && (
                <NavPopup anchorEl={anchorEl} open={showRemotePass} onDismiss={() => setShowRemotePass(false)} disableDismissPassing>
                    <DialogTitle disableTypography>
                        <Typography variant="h3" align="center">
                            Pass the Remote
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {participants.length == 0 && (
                            <Typography align="center">
                                {roomType == "public" ? "No other co-hosts are here yet." : "No one else is here yet."}
                            </Typography>
                        )}
                        {participants
                            .filter((p) => p.userId && p.userId != userId)
                            .map((p) => (
                                <User key={p.userId} userId={p.userId}>
                                    {({ user }) =>
                                        user && (
                                            <MenuItem
                                                onClick={() => {
                                                    setShowRemotePass(false);
                                                    passRemote(user.id);
                                                }}
                                            >
                                                {user.username ? user.username : user.displayName}
                                            </MenuItem>
                                        )
                                    }
                                </User>
                            ))}
                    </DialogContent>
                </NavPopup>
            )}
        </Overlay>
    );
}

export default LocalViewfinder;
