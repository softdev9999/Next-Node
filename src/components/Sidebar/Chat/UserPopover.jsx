import React, { useRef } from "react";
import { withStyles, Popover, Button, Typography, IconButton } from "@material-ui/core";
import { useCurrentRoom } from "hooks/Room/Room";
import ReportPopup from "components/Report/ReportPopup";
import UserAvatar from "../../UserAvatar/UserAvatar";

import { useState } from "react";

import SyncIcon from "@material-ui/icons/SyncRounded";
import CloseIcon from "@material-ui/icons/CloseRounded";

import GroupAddIcon from "@material-ui/icons/GroupAdd";
import FollowIcon from "@material-ui/icons/PersonAdd";
import ReportIcon from "@material-ui/icons/ReportProblem";
import BanIcon from "@material-ui/icons/CancelRounded";
import ProfileIcon from "@material-ui/icons/AccountCircle";

import ModeratorIcon from "@material-ui/icons/AssignmentInd";
import { updateModeratorStatus, updateRole } from "utils/API";
import { useUser } from "hooks/User/User";
import { useApp } from "hooks/Global/GlobalAppState";
import { followUser } from "utils/API";

import { mutate } from "swr";
import { addTracking } from "utils/Tracking";

const UserPopover = ({ classes, anchor, user: selectedUser, onDismiss }) => {
    const { user } = useUser(selectedUser && selectedUser.id);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isModerator, setIsModerator] = useState(selectedUser && selectedUser.moderator);
    const [isCoHost, setIsCohost] = useState(selectedUser && selectedUser.role == "host");

    const {
        auth: { userId, isFollowingUser }
    } = useApp();

    const [statusMessage, setStatusMessage] = useState(null);
    const {
        room: {
            id: roomId,
            type: roomType,
            member: { role, moderator }
        },
        chat
    } = useCurrentRoom();

    const statusTimer = useRef(null);

    const followUserClicked = () => {
        followUser(selectedUser.id).then((ok_) => {
            mutate("/users/" + selectedUser.id + "/relationships");
            mutate("/users/" + userId + "/relationships");
        });
    };

    const viewProfile = () => {
        window.open("/" + selectedUser.username, "_blank");
    };

    const reportUser = () => {
        setShowReportPopup(true);
    };

    const startBanUser = () => {
        setShowConfirmation(true);
    };
    const confirmBan = () => {
        setStatusMessage(null);
        setLoading(true);
        updateRole(roomId, user.id, "banned")
            .then((data) => {
                setLoading(false);
                if (data) {
                    setStatusMessage("Banned " + user.username);
                    setShowConfirmation(false);
                    chat.sendData({ eventName: "bannedUser", userId: user.id });
                    closeAfterDelay();
                } else {
                    setStatusMessage("Could not ban user.");
                    setLoading(false);
                }
            })
            .catch((e) => {
                e && setStatusMessage(e.message);
                setLoading(false);
            });
    };

    const updateGuest = (adding) => {
        console.log("adding?", adding, user.role);
        setStatusMessage(null);
        setLoading(true);

        updateRole(roomId, user.id, adding ? "host" : "audience")
            .then((data) => {
                if (data) {
                    setLoading(false);
                    chat.sendData({ eventName: "updatedRole", userId: user.id });

                    setStatusMessage(adding ? "Invited " + user.username + " to be a co-host." : "Removed " + user.username + " as a co-host.");
                    setIsCohost(adding);
                    closeAfterDelay();
                } else {
                    setStatusMessage("Error. Try again later");
                    setLoading(false);
                }
            })
            .catch((e) => {
                setStatusMessage(e.message);
                setLoading(false);
            });
    };

    const updateModerator = (enabled) => {
        setStatusMessage(null);
        setLoading(true);

        updateModeratorStatus(roomId, user.id, enabled)
            .then((data) => {
                console.log(data);
                if (data) {
                    setLoading(false);
                    chat.sendData({ eventName: "updatedRole", userId: user.id });

                    setStatusMessage(enabled ? "Made " + user.username + " a moderator" : "Removed " + user.username + " as a moderator");
                    setIsModerator(enabled);
                    closeAfterDelay();
                } else {
                    setStatusMessage("Error. Try again later");
                    setLoading(false);
                }
            })
            .catch((e) => {
                setStatusMessage(e.message);
                setLoading(false);
            });
    };

    const closeAfterDelay = (delay = 1000) => {
        clearTimeout(statusTimer.current);
        statusTimer.current = setTimeout(() => {
            setStatusMessage(null);
            onDismiss();
        }, delay);
    };

    return (
        <>
            <Popover
                anchorEl={anchor}
                hideBackdrop={false}
                open={!!anchor && !!user}
                classes={{ paper: classes.popoverPaper }}
                onClose={() => onDismiss()}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <div className={classes.closeButton}>
                    <IconButton onClick={() => onDismiss()}>
                        <CloseIcon />
                    </IconButton>
                </div>
                {showConfirmation && (
                    <Typography paragraph variant="h5">
                        Are you sure?
                    </Typography>
                )}
                <UserAvatar className={classes.largeAvatar} user={user} />
                <Typography variant="h4">{user && user.displayName}</Typography>
                <Typography variant="h6">{user && "@" + user.username}</Typography>
                {statusMessage && (
                    <Typography paragraph variant="body2" color="error">
                        {statusMessage}
                    </Typography>
                )}
                {loading ? (
                    <div>
                        <div style={{ transform: "scaleX(-1)" }}>
                            <SyncIcon style={{ color: "white", animation: "spin 3s infinite linear reverse" }} />
                        </div>
                    </div>
                ) : !showConfirmation ? (
                    <div className={classes.buttonRow}>
                        {roomType == "public" && user && role == "owner" && (
                            <Button
                                style={{ margin: ".5rem" }}
                                size="small"
                                variant={isCoHost ? "outlined" : "contained"}
                                color="primary"
                                fullWidth
                                onClick={() => updateGuest(selectedUser.role != "host")}
                                startIcon={<GroupAddIcon />}
                            >
                                {isCoHost ? "remove " : "invite to "}co-host
                            </Button>
                        )}
                        {roomType == "public" && user && role == "owner" && (
                            <Button
                                style={{ margin: ".5rem" }}
                                size="small"
                                variant={isModerator ? "outlined" : "contained"}
                                color="primary"
                                fullWidth
                                onClick={() => updateModerator(!selectedUser.moderator)}
                                startIcon={<ModeratorIcon />}
                            >
                                {isModerator ? "remove " : "make "}moderator
                            </Button>
                        )}
                        {user && selectedUser.role != "owner" && moderator ? (
                            <Button
                                style={{ margin: ".5rem" }}
                                size="small"
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={startBanUser}
                                startIcon={<BanIcon />}
                            >
                                ban from watch party
                            </Button>
                        ) : null}
                        <Button
                            style={{ margin: ".5rem" }}
                            size="small"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={viewProfile}
                            startIcon={<ProfileIcon />}
                        >
                            View Profile
                        </Button>
                        {userId && (
                            <Button
                                style={{ margin: ".5rem" }}
                                size="small"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isFollowingUser(selectedUser.id)}
                                onClick={followUserClicked}
                                startIcon={<FollowIcon />}
                            >
                                {isFollowingUser(selectedUser.id) ? "Following" : "Follow"}
                            </Button>
                        )}
                        <Button
                            style={{ margin: ".5rem" }}
                            size="small"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={reportUser}
                            startIcon={<ReportIcon />}
                        >
                            Report
                        </Button>
                    </div>
                ) : (
                    <div className={classes.buttonRow}>
                        <Button
                            style={{ margin: ".5rem" }}
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={() => setShowConfirmation(false)}
                            disabled={loading}
                        >
                            cancel
                        </Button>
                        <Button
                            style={{ margin: ".5rem" }}
                            size="small"
                            variant="contained"
                            fullWidth
                            color="primary"
                            onClick={confirmBan}
                            disabled={loading}
                        >
                            confirm
                        </Button>
                    </div>
                )}
            </Popover>
            <ReportPopup user={selectedUser} visible={showReportPopup} target={anchor} onDismiss={() => setShowReportPopup(false)} />
        </>
    );
};

const styles = (theme) => ({
    popoverPaper: {
        minWidth: "80vw",
        backgroundColor: theme.palette.primary.dark,
        backgroundImage: "linear-gradient(0deg, #1A064E, #390354)",
        borderRadius: "1rem",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(2, 1),
        zIndex: 0,
        marginTop: ".5rem",
        boxShadow: "0px 0px 0.5rem 0.5rem rgba(0,0,0,0.3)"
    },
    closeButton: {
        position: "absolute",
        right: 2,
        top: 2
    },
    largeAvatar: {
        width: "5rem",
        height: "5rem"
    },
    buttonRow: {
        width: "100%",
        flex: "1 1 100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "space-around"
    }
});

export default withStyles(styles)(UserPopover);
