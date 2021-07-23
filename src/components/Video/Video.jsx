import { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    viewfinderContainer: {
        backgroundColor: theme.functions.rgba(theme.palette.primary.dark, 0.5),
        border: `${theme.palette.primary.main} .0625rem inset`
    },
    overlayContainer: {
        position: "absolute",
        zIndex: 10,
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
        backgroundColor: "transparent",
        backgroundImage: `url(/images/LoadingIcon.gif)`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        transition: theme.transitions.create(),
        objectFit: "cover",
        objectPosition: "center center"
    }
}));
function Video({ flipped, stream, videoEnabled, muted, volume, output }) {
    const classes = useStyles();
    const videoRef = useRef();
    const playPromise = useRef();

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    useEffect(() => {
        console.log({ stream });
        if (videoRef.current && stream && (!videoRef.current.srcObject || videoRef.current.srcObject.id != stream.id)) {
            videoRef.current.srcObject = stream;
            play();
        } else if (videoRef.current && !stream) {
            videoRef.current.srcObject = null;
        }
    }, [stream]);

    useEffect(() => {
        if (videoRef.current && volume >= 0) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        console.log(output);

      
    }, [output]);

    const play = () => {
        if (videoRef.current) {
            if (!playPromise.current) {
                playPromise.current = videoRef.current.play();
                if (playPromise.current) {
                    playPromise.current
                        .then(() => {
                            playPromise.current = null;
                        })
                        .catch(() => {
                            playPromise.current = null;
                        });
                }
            }
            return playPromise.current;
        }
    };
    const setVideoEl = (el) => {
        if (el) {
            videoRef.current = el;

            if (stream && (!videoRef.current.srcObject || videoRef.current.srcObject.id != stream.id)) {
                videoRef.current.srcObject = stream;
            }
            if (volume >= 0) {
                videoRef.current.volume = volume;
            }
            if (output && output.deviceId && typeof videoRef.current.setSinkId !== "undefined") {
            //    videoRef.current.setSinkId(output.deviceId);
            }
            play();
        }
    };

    return (
        <video
            muted={muted}
            className={classes.viewfinderVideo}
            style={{ transform: flipped ? "rotateY(180deg)" : "none", opacity: videoEnabled ? 1 : 0 }}
            ref={setVideoEl}
            playsInline={true}
        />
    );
}

export default Video;
