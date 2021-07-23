import { useTheme } from "@material-ui/core";

import { useMedia } from "hooks/UserMedia/MediaProvider";
import Video from "../Video/Video";
import { Overlay } from "../Overlay/Overlay";
import ViewfinderError from "./ViewfinderError";
import ViewfinderInfo from "./ViewfinderInfo";
import { useApp } from "hooks/Global/GlobalAppState";
import { useEffect } from "react";

function SetupViewfinder() {
    const theme = useTheme();
    const {
        auth: { user }
    } = useApp();
    const {
        mediaState: { videoEnabled, videoStream },

        videoError,
        audioError,
        resetErrors,
        stop
    } = useMedia();

    useEffect(() => {
        return () => stop(true);
    }, []);

    return (
        <Overlay
            timeout={4000}
            style={{
                position: "relative",
                height: 0,
                paddingTop: "56.25%",
                width: "100%",
                overflow: "hidden",
                transition: theme.transitions.create(),
                border: `solid .06125rem ${theme.palette.common.white}`
            }}
        >
            <ViewfinderInfo
                isLocal={true}
                videoEnabled={videoEnabled}
                setup={true}
                user={user}
                type={"private"}
                isOwner={false}
                isHost={false}
                audioLevel={0}
                onRemoteClick={() => {}}
            />
            <Video videoEnabled={videoEnabled} stream={videoStream} flipped={true} volume={0} muted={true} />
            <ViewfinderError error={videoError || audioError} onDismiss={resetErrors} />
        </Overlay>
    );
}

export default SetupViewfinder;
