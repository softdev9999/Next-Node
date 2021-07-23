import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip, Button } from "@material-ui/core";
import { useApp } from "hooks/Global/GlobalAppState";
import { useCurrentRoom } from "hooks/Room/Room";
import { useExtension } from "hooks/Extension/Extension";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import { useEffect } from "react";
import { updateRole } from "utils/API";
import NavPopup from "../NavPopup/NavPopup";
import AddCohostPopup from "../AddCohostPopup/AddCohostPopup";
import StopCoHostingConfirmation from "../SidebarAlerts/StopCoHostingConfirmation";

const useStyles = makeStyles((theme) => ({
    popoverPaper: {
        backgroundImage: theme.gradients.create(65, `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 100%`)
    },
    button: {
        backgroundColor: theme.palette.secondary.main,
        borderRadius: theme.spacing(1.6),
        boxShadow: "none",
        fontSize: theme.spacing(1.6),
        fontWeight: "bold",
        letterSpacing: 0.4,
        lineHeight: theme.spacing(1.6),
        maxHeight: theme.spacing(2.5),
        marginRight: ".25rem",
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: "none",
            borderColor: theme.palette.secondary.main
        }
    }
}));

const CoHostButton = () => {
    const classes = useStyles();
    const {
        auth: { userId }
    } = useApp();
    const {
        room: {
            id: roomId,
            member: { role }
        },
        chat,
        refreshRoom
    } = useCurrentRoom();
    const { sendMessage } = useExtension();
    const {
        media: { audioEnabled, videoEnabled },
        status
    } = useMedia();
    const [hasEnabled, setHasEnabled] = useState(false);
    const cohostButtonRef = useRef(null);
    const [showAddGuest, setShowAddGuest] = useState(false);
    const [showStopConfirmation, setShowStopConfirmation] = useState(false);

    useEffect(() => {
        if (videoEnabled || audioEnabled) {
            setHasEnabled(true);
        }
    }, [videoEnabled, audioEnabled]);

    const openSetupPopup = () => {
        sendMessage("openAvSetupPopup", "background", {});
    };

    const joinAsCohost = () => {
        openSetupPopup();
    };

    const stopCohosting = () => {
        if (role == "host") {
            updateRole(roomId, userId, "audience").then((res) => {
                if (res.userId) {
                    chat.sendData({ eventName: "participantDisconnected", userId: userId });

                    refreshRoom();
                }
            });
        }
    };

    return role == "owner" ? (
        <>
            <NavPopup
                classes={{ paper: classes.popoverPaper }}
                open={!!showAddGuest}
                onDismiss={() => setShowAddGuest(false)}
                anchorEl={cohostButtonRef.current}
            >
                <AddCohostPopup />
            </NavPopup>
            <Tooltip title={"invite a co-host"}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    onClick={() => setShowAddGuest(true)}
                    ref={cohostButtonRef}
                >
                    Add Co-Host
                </Button>
            </Tooltip>
        </>
    ) : hasEnabled ? (
        <>
            <NavPopup
                classes={{ paper: classes.popoverPaper }}
                open={!!showStopConfirmation}
                onDismiss={(res) => {
                    if (res === true) {
                        stopCohosting();
                    }
                    setShowStopConfirmation(false);
                }}
                anchorEl={cohostButtonRef.current}
            >
                <StopCoHostingConfirmation />
            </NavPopup>
            <Tooltip title={"stop co-hosting"}>
                <Button
                    disabled={status.audio == "initializing" || status.video == "initializing"}
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    onClick={() => setShowStopConfirmation(true)}
                    ref={cohostButtonRef}
                >
                    Stop Co-hosting
                </Button>
            </Tooltip>
        </>
    ) : (
        <Tooltip title="join as co-host">
            <Button
                disabled={status.audio == "initializing" || status.video == "initializing"}
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                onClick={joinAsCohost}
                ref={cohostButtonRef}
            >
                Join as Co-Host
            </Button>
        </Tooltip>
    );
};

export default CoHostButton;
