import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Slider, IconButton, Popover, useTheme } from "@material-ui/core";

import SoundOnIcon from "@material-ui/icons/VolumeUpRounded";
import SoundOffIcon from "@material-ui/icons/VolumeOffRounded";
import MicOffIcon from "@material-ui/icons/MicOffRounded";
import { useOverlay } from "../Overlay/Overlay";
import { useRef } from "react";
import { useEffect } from "react";
const useStyles = makeStyles((theme) => ({
    volumeContainer: {
        padding: theme.spacing(1, 0, 0, 0),
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
        transition: theme.transitions.create()
    },
    volumeSlider: {
        //    height: "calc(100% - 1rem)",
        marginBottom: theme.spacing(1)
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
    audioEnabledTransparentRoot: {
        flex: "0 0 auto",
        backgroundColor: "rgba(0,0,0,0)",
        color: "white",
        fontSize: "1.5rem",
        transition: theme.transitions.create("background-color"),

        "&:hover": {
            backgroundColor: "rgba(0,0,0,.4)",
            transition: theme.transitions.create("background-color")
        }
    },
    audioMutedTransparentRoot: {
        flex: "0 0 auto",
        backgroundColor: "rgba(255,0,0,0)",
        color: "white",
        fontSize: "1.5rem",
        transition: theme.transitions.create("background-color"),
        "&:hover": {
            backgroundColor: "rgba(255,0,0,.4)",
            transition: theme.transitions.create("background-color")
        }
    },
    sliderPopup: {
        height: "10rem",
        width: "2rem",
        minWidth: "2rem",
        maxWidth: "2rem",
        borderRadius: 2000,
        overflow: "hidden",
        padding: theme.spacing(0.5, 0.25)
    }
}));

const VolumeControl = ({ audioEnabled, volume, muted, onVolumeChange, onMutedChange }) => {
    const classes = useStyles();
    const overlayVisible = useOverlay();
    const theme = useTheme();
    const buttonRef = useRef();
    const inactivityTimer = useRef();
    const [showSlider, setShowSlider] = useState(false);

    useEffect(() => {
        return () => {
            clearTimeout(inactivityTimer.current);
        };
    }, [showSlider]);

    const onMouseOut = () => {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            setShowSlider(false);
        }, 3000);
    };

    return (
        <>
            <IconButton
                ref={buttonRef}
                onMouseOver={() => setShowSlider(true)}
                style={{
                    opacity: overlayVisible || muted || !audioEnabled ? 1 : 0,
                    transition: theme.transitions.create()
                }}
                size="small"
                //disabled={!audioEnabled}
                onClick={() => onMutedChange(!muted)}
                classes={{ root: !audioEnabled ? classes.audioMutedTransparentRoot : !muted ? classes.audioEnabledRoot : classes.audioMutedRoot }}
            >
                {audioEnabled && (muted ? 0 : 1) * volume > 0 ? (
                    <SoundOnIcon htmlColor={"white"} />
                ) : !audioEnabled ? (
                    <MicOffIcon />
                ) : (
                    <SoundOffIcon htmlColor="white" />
                )}
            </IconButton>
            <Popover
                anchorEl={buttonRef.current}
                disablePortal={true}
                disableAutoFocus
                disableEnforceFocus
                open={showSlider}
                onClose={() => setShowSlider(false)}
                classes={{ paper: classes.sliderPopup }}
                container={() => (typeof document === "undefined" ? null : document.body)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >
                <div className={classes.volumeContainer} onMouseOut={onMouseOut}>
                    <Slider
                        scale={(x) => Math.log(x)}
                        classes={{ vertical: classes.volumeSlider }}
                        orientation="vertical"
                        value={(muted ? 0 : 1) * volume * 100}
                        max={100}
                        min={0}
                        onChange={(_event, value) => {
                            if (muted) {
                                onMutedChange(false);
                            }
                            onVolumeChange(value / 100);
                        }}
                    />
                    <IconButton
                        style={{
                            opacity: 1,
                            transition: theme.transitions.create()
                        }}
                        size="small"
                        disabled={!audioEnabled}
                        onClick={() => onMutedChange(!muted)}
                        classes={{ root: !muted ? classes.audioEnabledTransparentRoot : classes.audioMutedRoot }}
                    >
                        {audioEnabled && (muted ? 0 : 1) * volume > 0 ? (
                            <SoundOnIcon htmlColor={"white"} />
                        ) : !audioEnabled ? (
                            <MicOffIcon />
                        ) : (
                            <SoundOffIcon htmlColor="white" />
                        )}
                    </IconButton>
                </div>
            </Popover>
        </>
    );
};

export default VolumeControl;
