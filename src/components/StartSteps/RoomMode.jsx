import {  Grid, Button, ButtonBase, makeStyles, Typography } from "@material-ui/core";
import React from "react";

import AudioIcon from "@material-ui/icons/Mic";
import VideoIcon from "@material-ui/icons/Videocam";
import ChatIcon from "@material-ui/icons/ChatBubble";
import { useState } from "react";
import FixedRatioBox from "../FixedRatioBox/FixedRatioBox";
const FixedRatioBoxProps = {
    xs: 0.2,
    sm: 0.5,
    md: 1,
    lg: 1
};
const useStyles = makeStyles((theme) => ({
    main: {
        width: "100%"
    },
    badge: {
        position: "absolute",
        left: 20,
        top: -2
    },
    mainBody: {
        width: "100%",
        padding: theme.spacing(),
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    bigButtonRoot: {
        height: "100%",
        width: "100%",
        borderRadius: ".5rem",
        padding: theme.spacing(1),
        flexFlow: "row wrap",
        justifyContent: "center",
        alignContent: "center",
        opacity: 0.6,
        border: `${theme.palette.common.white} .125rem solid`,
        "&:hover": {
            opacity: 0.9,
            backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.3),
            // color: theme.palette.primary.main,
            border: `${theme.palette.primary.main} .125rem solid`
        }
    },
    bigButtonRootSelected: {
        height: "100%",
        width: "100%",
        borderRadius: ".5rem",
        padding: theme.spacing(1),
        flexFlow: "row wrap",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        border: `${theme.palette.common.white} .125rem solid`,
        opacity: 1,

        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.common.white,
            border: `${theme.palette.common.white} .125rem solid`
        }
    },

    bigButtonLabel: {},
    bigButtonIcon: {
        fontSize: "3em",
        marginBottom: "1rem",
        [theme.breakpoints.down("xs")]: {
            fontSize: "2em",
            marginBottom: ".25rem"
        }
    }
}));

function RoomMode({ onRoomModeSelected }) {
    const classes = useStyles();
    const [roomMode, setRoomMode] = useState("video");
    return (
        <>
            <Grid item xs={12} sm={12} md={4}>
                <FixedRatioBox {...FixedRatioBoxProps}>
                    <ButtonBase
                        onClick={() => setRoomMode("video")}
                        classes={{
                            root: roomMode == "video" ? classes.bigButtonRootSelected : classes.bigButtonRoot
                        }}
                    >
                        <VideoIcon className={classes.bigButtonIcon} />
                        <Typography>Video + Chat</Typography>
                    </ButtonBase>
                </FixedRatioBox>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                <FixedRatioBox {...FixedRatioBoxProps}>
                    <ButtonBase
                        onClick={() => setRoomMode("audio")}
                        classes={{
                            root: roomMode == "audio" ? classes.bigButtonRootSelected : classes.bigButtonRoot
                        }}
                    >
                        <AudioIcon className={classes.bigButtonIcon} />
                        <Typography>Audio + Chat</Typography>
                    </ButtonBase>
                </FixedRatioBox>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                <FixedRatioBox {...FixedRatioBoxProps}>
                    <ButtonBase
                        onClick={() => setRoomMode("chat")}
                        classes={{
                            root: roomMode == "chat" ? classes.bigButtonRootSelected : classes.bigButtonRoot
                        }}
                    >
                        <ChatIcon className={classes.bigButtonIcon} />
                        <Typography>Chat Only</Typography>
                    </ButtonBase>
                </FixedRatioBox>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button variant="contained" fullWidth onClick={() => onRoomModeSelected(roomMode)}>
                    Let{"'"}s go!
                </Button>
            </Grid>
        </>
    );
}

export default RoomMode;
