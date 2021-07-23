import React, { useRef, useEffect, useState } from "react";
import { withStyles, useTheme } from "@material-ui/core";

function Viewfinder({
    style,
    classes,
    flipped,
    videoEnabled,
    muted,
    videoRef,
    audioLevel,

    children
}) {    const theme = useTheme();

    const [overlayVisible, setOverlayVisible] = useState(false);
    const overlayTimeout = useRef(null);
    useEffect(() => {
        showOverlay();
        () => {
            clearTimeout(overlayTimeout.current);
        };
    }, []);

    const showOverlay = () => {
        if (overlayTimeout.current) {
            clearTimeout(overlayTimeout.current);
            overlayTimeout.current = null;
        }
        setOverlayVisible(true);
        overlayTimeout.current = setTimeout(() => {
            hideOverlay();
        }, 4000);
    };

    const hideOverlay = () => {
        if (overlayTimeout.current) {
            clearTimeout(overlayTimeout.current);
            overlayTimeout.current = null;
        }
        setOverlayVisible(false);
    };

    return (
        <div
            onMouseOver={showOverlay}
            onMouseOut={hideOverlay}
            onMouseMove={showOverlay}
            style={{
                height: 0,
                paddingTop: "56.25%",
                position: "relative",
                overflow: "hidden",
                transition: theme.transitions.create(),
                ...style
            }}
            className={classes.viewfinderContainer}
        >
            <div
                style={{
                    border: `rgba(255,255,255,0) .125rem inset`,
                    pointerEvents: "none",
                    borderColor: theme.functions.rgba("#FFFFFF", audioLevel ** 4),
                    position: "absolute",
                    zIndex: 11,
                    width: "100%",
                    height: "100%",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }}
            />
            {children({ overlayVisible })}
            <video
                muted={muted}
                className={classes.viewfinderVideo}
                style={{ transform: flipped ? "rotateY(180deg)" : "none", opacity: videoEnabled ? 1 : 0 }}
                ref={videoRef}
                playsInline={true}
            />
        </div>
    );
}

const styles = (theme) => ({
    viewfinderContainer: {
        backgroundColor: theme.functions.rgba(theme.palette.primary.dark, 0.5),
        border: `${theme.palette.common.white} .0625rem inset`
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
    liveIndicator: {
        backgroundColor: "rgba(0,0,0,.7)",
        borderRadius: 10000
    },
    name: {
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing(),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        display: "flex",
        width: "100%",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "rgba(90,90,90,.5)",
        transition: theme.transitions.create()
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
        backgroundColor: "rgba(0,0,0,.4)",
        color: "white",
        fontSize: "1.5rem",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,.7)"
        }
    }
});

export default withStyles(styles)(Viewfinder);
