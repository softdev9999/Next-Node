import classname from "classnames";
import { useEffect, useRef, useState } from "react";
import { Typography, withStyles, Button, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";
import RoomVideoView from "./RoomVideoView";
import ChatView from "../Chat/ChatView";
import moment from "moment";
import { useApp } from "hooks/Global/GlobalAppState";
import { useCurrentRoom } from "hooks/Room/Room";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import { useExtension } from "hooks/Extension/Extension";
import useRoomStatus from "hooks/Room/RoomStatus";
import { ga } from "utils/Tracking";
import ErrorView from "../../ErrorView/ErrorView";
import useBroadcastChannel from "hooks/useBroadcastChannel/useBroadcastChannel";
import { useContentState } from "hooks/ContentState/ContentState";
import HelpPopup from "../../Help/HelpPopup";
import { MEDIA_STATUS } from "hooks/UserMedia/constants";
import NavPopup from "../../NavPopup/NavPopup";
import FeedbackPopup from "../../Report/FeedbackPopup";
import { useRouter } from "next/router";
import SidebarOverlay from "../SidebarOverlay";

const RoomView = ({ classes }) => {
    const {
        dimensions: { isLandscape },
        popups: { sidebarHelp, account, feedback }
    } = useApp();
    const { clearState, player } = useContentState();
    const router = useRouter();

    const {
        room: { id: roomId, owner },
        disconnect,
        clientError,
        isHostLive
    } = useCurrentRoom();

    const mediaSource = useMedia();
    const {
        sendMessage,
        openContentTab,

        error,
        servicePermissions,

        setExtensionError,
        checkVersion,
        closeSidebar,
        setServiceSetting,
        isExtensionInstalled
    } = useExtension();

    const { status } = useRoomStatus();

    let currentServiceFormatted = status && status.hostServiceName;

    const [chatHidden, setChatHidden] = useState(false);

    const onMessage = useRef((msg) => {
        console.log("theater setup message", msg);
        switch (msg.name) {
            case "LoadingTimeout": {
                //window.dispatchEvent(new Event('scenererror'));
                window.location.reload();
                break;
            }
            case "ServiceSetting": {
                console.log("*** Setting service setting", msg);
                if (msg.service && msg.setting) {
                    setServiceSetting(msg.service, msg.setting);
                } else if (msg.service && msg.login) {
                    setServiceSetting(msg.service, null, true);
                }
                break;
            }
            case "AVSetupFinished": {
                //checkServicePermissions();
                if (msg.mediaState) {
                    sendMessage("closeAvSetupPopup", "background", {});

                    mediaSource.devices.loadAvailableDevices().then(() => {
                        if (msg.mediaState.audioEnabled && !msg.mediaState.videoEnabled) {
                            mediaSource.setVideoStatus(MEDIA_STATUS.INITIALIZING);
                            mediaSource.setAudioStatus(MEDIA_STATUS.INITIALIZING);
                            setTimeout(() => {
                                mediaSource.setVideoStatus(MEDIA_STATUS.NONE);

                                mediaSource.startAudio();
                            }, 1500);
                        } else if (!msg.mediaState.audioEnabled && msg.mediaState.videoEnabled) {
                            mediaSource.setVideoStatus(MEDIA_STATUS.INITIALIZING);
                            mediaSource.setAudioStatus(MEDIA_STATUS.INITIALIZING);
                            setTimeout(() => {
                                mediaSource.setAudioStatus(MEDIA_STATUS.NONE);

                                mediaSource.startVideo();
                            }, 1500);
                        } else if (msg.mediaState.audioEnabled && msg.mediaState.videoEnabled) {
                            mediaSource.setVideoStatus(MEDIA_STATUS.INITIALIZING);
                            mediaSource.setAudioStatus(MEDIA_STATUS.INITIALIZING);
                            setTimeout(() => {
                                mediaSource.setVideoStatus(MEDIA_STATUS.NONE);
                                mediaSource.setAudioStatus(MEDIA_STATUS.NONE);
                                mediaSource.start();
                            }, 1500);
                        }
                    });
                }
                break;
            }
        }
    }).current;

    useBroadcastChannel({ name: "TheaterSetup", onMessage });

    const leaveRoom = () => {
        disconnect()
            .then(() => {
                isExtensionInstalled ? closeSidebar() : router.push("/[username]", "/" + owner.username);
            })
            .catch(() => {
                isExtensionInstalled ? closeSidebar() : router.push("/[username]", "/" + owner.username);
            });
    };

    const toggleChat = (val) => {
        setChatHidden(val);
    };

    useEffect(() => {
        checkVersion();
        //checkServicePermissions();

        return () => {
            clearState();
            disconnect();
        };
    }, []);

    useEffect(() => {
        if (roomId) {
            ga("Joined Room");
        }
    }, [roomId]);
    /*useEffect(() => {
        if (chat.chatClient && roomType) {
       //     chat.setRoomType(roomType);
        }
    }, [roomType, chat.chatClient]);*/

    const reloadContent = () => {
        openContentTab(player.url.protocol + "//" + player.url.host + player.url.pathname + "?" + moment().unix());
    };

    const handleError = (canceled) => {
        if (canceled) {
            setExtensionError(null);
        } else {
            if (error == "detached") {
                sendMessage("restartContent", "background", {}).then((res_) => {
                    setExtensionError(null);
                });
            } else {
                reloadContent();
            }
        }
    };

    const getErrorMessage = () => {
        switch (error) {
            case "detached": {
                return "It looks like your " + currentServiceFormatted + " window is hiding somewhere. Let's fix that.";
            }
            default: {
                return "The content is having trouble loading.";
            }
        }
    };

    const getErrorHeader = () => {
        switch (error) {
            case "detached": {
                return "Reload " + currentServiceFormatted + "?";
            }
            default: {
                return "Sorry, something's gone wrong";
            }
        }
    };

    const getErrorButton = () => {
        switch (error) {
            case "detached": {
                return "SOUNDS GOOD";
            }
            default: {
                return "RELOAD " + currentServiceFormatted;
            }
        }
    };

    return (
        <>
            <div className={classes.main}>
                {isHostLive && (
                    <div
                        className={classname({
                            [classes.mainBodyLandscape]: isLandscape,
                            [classes.mainBody]: !isLandscape
                        })}
                    >
                        <div
                            className={classname({
                                [classes.videoContainerLandscape]: isLandscape,
                                [classes.videoContainer]: !isLandscape
                            })}
                            // className={
                            //     isLandscape
                            //         ? chatHidden
                            //             ? classes.videoContainerLandscapeMaximized
                            //             : classes.videoContainerLandscape
                            //         : chatHidden
                            //         ? classes.videoContainerMaximized
                            //         : classes.videoContainer
                            // }
                        >
                            <RoomVideoView chatHidden={chatHidden} permissionsGranted={servicePermissions} />
                            {clientError && (
                                <ErrorView
                                    message="Could not connect to theater."
                                    resolveButtonTitle="RELOAD"
                                    onResolve={() => (document.location = document.location.href)}
                                />
                            )}
                        </div>
                        <div
                            className={classname({
                                [classes.chatContainer]: !isLandscape,
                                [classes.chatContainerLandscape]: isLandscape
                            })}
                            // className={
                            //     isLandscape
                            //         ? chatHidden
                            //             ? classes.chatContainerLandscapeMinimized
                            //             : classes.chatContainerLandscape
                            //         : chatHidden
                            //         ? classes.chatContainerMinimized
                            //         : classes.chatContainer
                            // }
                        >
                            <ChatView
                                hidden={chatHidden}
                                onAuthRequired={() => account.show(true, { initalView: "signup", skipFinish: true, dialog: true })}
                                onToggle={toggleChat}
                            />
                        </div>
                    </div>
                )}
                <SidebarOverlay visible={!isHostLive} title={owner.username + " isn't live"} button={"Exit"} onButtonClick={leaveRoom} />
                <NavPopup dialog open={!!error} onDismiss={() => handleError(true)} disableDismissPassing>
                    <DialogTitle>{getErrorHeader()}</DialogTitle>
                    <DialogContent>
                        <Typography>{getErrorMessage()}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={() => handleError(true)}>
                            CANCEL
                        </Button>
                        {getErrorButton() && (
                            <Button variant="contained" color="primary" fullWidth onClick={() => handleError()}>
                                {getErrorButton()}
                            </Button>
                        )}
                    </DialogActions>
                </NavPopup>
                <HelpPopup dialog open={!!sidebarHelp.open} onDismiss={() => sidebarHelp.show(false)} disableDismissPassing />
                <FeedbackPopup visible={!!feedback.open} onDismiss={() => feedback.show(false)} disableDismissPassing />
            </div>
        </>
    );
};

const styles = (theme) => ({
    main: {
        flex: "1 1 100%",
        width: "100%",
        minWidth: "100vw",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "rgba(18,0,40,1)"
    },
    inviteLink: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: theme.functions.rems(20),
        paddingBottom: theme.functions.rems(20),
        paddingLeft: theme.functions.rems(50),
        paddingRight: theme.functions.rems(50)
    },
    liveInviteLink: {
        width: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing(1, 2)
    },
    mainBody: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        justifyContent: "flex-start",
        flex: "1 1 100%"
    },
    mainBodyLandscape: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "stretch",
        justifyContent: "flex-start",
        flex: "1 1 100%"
    },
    menuButtonInactive: {
        backgroundColor: "rgba(255,255,255,0.5)",
        padding: theme.spacing()
    },
    menuButtonActive: {
        backgroundColor: "#8f2af5",
        padding: theme.spacing()
    },
    menuButton: {
        color: "white",
        fontSize: "1.75rem"
    },
    statusIcon: {
        color: "rgba(0,0,0,0.5)",
        marginRight: theme.functions.rems(4),
        fontSize: "2rem"
    },
    text1: {
        padding: theme.spacing(1.5)
    },
    serviceName: {
        fontWeight: "bold"
    },
    title: {},
    subtitle: {
        paddingLeft: theme.functions.rems(4),
        opacity: 0.6
    },
    chatContainer: {
        flex: "5 0 50%",
        width: "100%",
        height: "50%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    chatContainerLandscape: {
        flex: "0 0 50%",
        width: "50%",
        height: "calc(100vh - 2.5rem)",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    chatContainerMinimized: {
        flex: "0 1 " + theme.functions.rems(100),
        width: "100%",
        height: "50%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    chatContainerLandscapeMinimized: {
        flex: "1 2 " + theme.functions.rems(60),
        width: theme.functions.rems(60),
        height: "calc(100vh - 2.5rem)",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    videoContainer: {
        flex: "0 20 50%",
        width: "100%",
        height: "50%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    videoContainerLandscape: {
        flex: "0 0 50%",
        width: "50%",
        height: "calc(100vh - 2.5rem)",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    videoContainerMaximized: {
        flex: "1 2 100%",
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    },
    videoContainerLandscapeMaximized: {
        flex: "1 2 100%",
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch"
    }
});

export default withStyles(styles)(RoomView);
