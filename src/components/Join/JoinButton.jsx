import React, { useMemo } from "react";
import { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useExtension } from "hooks/Extension/Extension";
import { Button, Typography, Popover } from "@material-ui/core";
import { useApp } from "hooks/Global/GlobalAppState";
import { addTracking } from "utils/Tracking";
import { useRouter } from "next/router";
import useAPI from "utils/useAPI";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import NavPopup from "../NavPopup/NavPopup";
import ToggleTextField from "../ToggleTextField/ToggleTextField";
import { isMobile } from "utils/Browser";
import config from "../../config";

const useStyles = makeStyles((theme) => ({
    popoverPaper: {
        padding: "1rem",
        backgroundImage: theme.gradients.create(65, `${theme.palette.secondary.lightest} 0%`, `${theme.palette.primary.main} 100%`)
    }
}));

const JoinButton = ({ onJoin, roomId, roomCode, user, size, fullWidth, activeMembers, width, autoOpen = false, title = "Join", type = "public" }) => {
    const classes = useStyles();

    const [status, setStatus] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const [passwordRequired, setPasswordRequired] = useState(false);
    const [roomPassword, setRoomPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);

    const { isExtensionInstalled, openSidebar } = useExtension();

    const router = useRouter();
    const { join } = useAPI();

    const {
        sidebar,
        auth: { userId }
    } = useApp();

    const reset = () => {
        setStatus(null);
        setPasswordError(null);
        setPasswordRequired(false);
    };

    const joinRoom = (rid, username, ref, pass) => {
        console.log(rid, autoOpen);
        if (autoOpen && isExtensionInstalled && rid) {
            router.push("/join/[roomId]/[step]", "/join/" + rid + "/ready", { shallow: true });
            if (!sidebar || !sidebar.state || sidebar.state.roomId != rid) {
                openSidebar({
                    serviceUrl: config.getStartUrl() + "loading",
                    sidebarUrl: config.getSidebarUrl(rid)
                });
            } else {
                openSidebar();
            }
        } else if (isExtensionInstalled || (isMobile() && type == "public")) {
            setStatus("loading");

            return join(
                {
                    id: type == "public" ? rid : null,
                    code: type != "public" ? rid : null,
                    type: type,
                    password: pass || roomPassword
                },
                { anchorEl: ref }
            )
                .then((r) => {
                    setPasswordRequired(false);
                    setStatus(null);
                    if (r) {
                        //console.log("*** JOIN RES ***", r);
                        onJoin && onJoin();
                        if (type == "public" && username && user && user.id != userId && !isMobile()) {
                            router.push("/[username]", "/" + username);
                        }
                    }
                    // route to username page
                })
                .catch((e) => {
                    let err = e.message || e;

                    if (err == "password required" || err == "password incorrect") {
                        setStatus("waiting");
                        setPasswordRequired(true);

                        if (err == "password incorrect") {
                            setPasswordError("Incorrect passcode. Please try again");
                        }
                    } else {
                        setStatus("error");
                    }

                    return false;
                });
        } else if (!isMobile()) {
            router.push("/join/[roomId]/extension", "/join/" + rid + "/extension");
        } else {
            router.push("/join/[roomId]/mobile", "/join/" + rid + "/mobile");
        }
    };

    let canHost = useMemo(() => (user && user.id == userId) || activeMembers == 0, [user, userId, activeMembers]);

    const onJoinClicked = (ev) => {
        joinRoom(roomCode || roomId, user && user.username, ev.currentTarget);
    };

    return (
        <>
            <ButtonWithFeedback
                size={size ? size : "medium"}
                onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    setAnchorEl(ev.currentTarget);
                    onJoinClicked(ev);
                }}
                waitingMessage={"Code?"}
                color={canHost && type == "private" ? "primary" : "secondary"}
                variant={canHost && type == "private" ? "outlined" : "contained"}
                style={width ? { width: width } : null}
                fullWidth={fullWidth}
                status={status}
                loadingMessage={width ? "" : "Loading..."}
                onTimeout={setStatus}
                disabled={sidebar.state && sidebar.state.roomId == roomId}
            >
                {sidebar.state && sidebar.state.roomId == roomId ? "Joined" : canHost ? "Host" : title}
            </ButtonWithFeedback>
            <Popover
                id="popover-passcode"
                open={!!passwordRequired}
                anchorEl={anchorEl}
                onClose={reset}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                classes={{
                    paper: classes.popoverPaper
                }}
            >
                <Typography variant="h5" align="center">
                    This party requires a passcode
                </Typography>
                <ToggleTextField
                    placeholder={"enter " + (type == "private" ? "room" : "theater") + " passcode"}
                    label={"passcode"}
                    saveTitle={title}
                    error={passwordError}
                    showAction={true}
                    defaultActive={true}
                    focusToggle={true}
                    value={roomPassword}
                    onSave={(value) => {
                        return joinRoom(roomCode || roomId, user && user.username, anchorEl, value);
                    }}
                    onCancel={reset}
                    saveOnEnter
                />
            </Popover>
        </>
    );
};

export default JoinButton;
