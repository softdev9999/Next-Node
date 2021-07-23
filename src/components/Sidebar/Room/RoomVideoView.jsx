import React, { useState, useEffect, useRef } from "react";
import RemoteViewfinder from "../../Viewfinder/RemoteViewfinder";

import { withStyles } from "@material-ui/core";
import LocalViewfinder from "../../Viewfinder/LocalViewfinder";

import moment from "moment";
import RoomStatusBar from "./RoomStatusBar";
import { useCurrentRoom } from "hooks/Room/Room";
import SelectServicePopup from "../../SelectServicePopup/SelectServicePopup";
import { useApp } from "hooks/Global/GlobalAppState";
import useRoomStatus from "hooks/Room/RoomStatus";
import { useExtension } from "hooks/Extension/Extension";
import { useCallback } from "react";
import config from "../../../config";
import SidebarOverlay from "../SidebarOverlay";
import { useMedia } from "hooks/UserMedia/MediaProvider";

const RoomVideoView = ({ classes, onLeaveClicked, chatHidden }) => {
    const {
        dimensions: { innerHeight, innerWidth }
    } = useApp();

    // const [videoParticipants, setVideoParticipants] = useState([]);
    //const [nonVideoParticipants, setNonVideoParticipants] = useState([]);
    const { status } = useRoomStatus();
    const {
        participants,
        activeParticipants,
        syncing,
        room: {
            member: { userId, role },
            ownerId,
            id: roomId,
            type: roomType
        }
    } = useCurrentRoom();
    const {
        media: { videoEnabled, audioEnabled }
    } = useMedia();
    const { host } = syncing;
    const [showServiceSelect, setShowServiceSelect] = useState(false);
    const { openContentTab, isExtensionInstalled, country, sendMessage } = useExtension();
    const [canShowSelectService, setCanShowSelectService] = useState(false);
    const hasShownServiceSelect = useRef(false);
    const hasOpenedContentTab = useRef(false);
    const viewfinderBox = useRef(null);
    const selectServiceButtonRef = useRef(null);
    const getRemoteViewfinderWidth = useCallback(() => {
        //return "100%";
        //let videoParticipants = participants.filter((p) => !!isVideoEnabled(p));
        //let nonVideoParticipants = participants.filter((p) => !isVideoEnabled(p));
        let isLandscape = innerWidth > innerHeight;
        let totalScreens = participants ? participants.length : 0; //isExtensionInstalled ? 1 : 0;
        totalScreens = totalScreens + (role != "audience" ? 1 : 0);
        let availWidth = isLandscape ? innerWidth * 0.5 : innerWidth;
        let availHeight = chatHidden || isLandscape ? innerHeight * 0.9 : innerHeight * 0.5;
        //let totalNonScreens = (nonVideoParticipants ? nonVideoParticipants.length : 0) + (localVideoEnabled ? 0 : 1);

        if (totalScreens > 0) {
            let videoHeight = (availWidth * 9) / 16;
            let vfheight = videoHeight * totalScreens;

            if (vfheight < availHeight) {
                return 100;
            } else if (vfheight / 2 < availHeight || totalScreens < 3) {
                return 50;
            } else {
                return 33;
            }
        } else {
            return 100;
        }
    }, [participants, chatHidden, innerHeight, innerWidth]);

    useEffect(() => {
        //console.log('*** VF HEIGHT ***', viewfinderBox.current.clientHeight, participants);
    }, [viewfinderBox && viewfinderBox.current && viewfinderBox.current.clientHeight]);

    useEffect(() => {
        let t = setTimeout(() => {
            setCanShowSelectService(true);
        }, 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (syncing.host == userId && status.relaunchButton) {
            if (!hasShownServiceSelect.current && canShowSelectService) {
                hasShownServiceSelect.current = true;
                //  setShowServiceSelect(true);
            }
        }
    }, [status.relaunchButton, syncing.host, userId, canShowSelectService]);

    const openService = (service) => {
        console.trace("open service", service);

        if (service && typeof service === "string") {
            if (service && service.indexOf("://") != -1) {
                console.log("** CUSTOM URL ***", service);
                openContentTab(service);
                setShowServiceSelect(false);
                return;
            }

            service = service.toLowerCase();

            if (config.getServiceStart(service, country)) {
                openContentTab(config.getServiceStart(service, country, null, { id: roomId, type: roomType }));
                setShowServiceSelect(false);
                return;
            }
        }
        console.warn("unexpected service");
        setShowServiceSelect(!showServiceSelect);
        return;
    };

    const reload_ = () => {
        document.location.search = "?" + moment().unix();
    };

    useEffect(() => {
        console.log({ role });
    }, [role]);

    return (
        <>
            <SelectServicePopup visible={showServiceSelect} onDismiss={openService} disableBackdropClose={false} anchorEl={selectServiceButtonRef} />
            <div className={classes.videoContainer}>
                <RoomStatusBar
                    onLeaveClicked={onLeaveClicked}
                    status={status}
                    onOpenService={openService}
                    selectServiceButtonRef={selectServiceButtonRef}
                />
                <div className={classes.remoteViewfinderContainer} ref={viewfinderBox}>
                    {role != "audience" && (
                        <div
                            className={classes.viewfinderSizer}
                            style={{
                                minHeight: 0,
                                flex: "0 0 " + (videoEnabled || audioEnabled ? getRemoteViewfinderWidth() : getRemoteViewfinderWidth()) + "%",
                                order: userId == ownerId ? -10001 : parseInt((userId + "").substring(0, 5), 10)
                            }}
                        >
                            <LocalViewfinder />
                        </div>
                    )}

                    {activeParticipants && activeParticipants.length > 0
                        ? activeParticipants.map((p, index) => (
                              <div
                                  className={classes.viewfinderSizer}
                                  style={{
                                      flex:
                                          "0 0 " + (p.videoEnabled || p.audioEnabled ? getRemoteViewfinderWidth() : getRemoteViewfinderWidth()) + "%",
                                      order: p.userId == ownerId ? -10001 : parseInt((p.userId + "").substring(0, 5), 10)
                                  }}
                                  key={p.userId}
                              >
                                  <RemoteViewfinder participant={p} host={host} index={index} />
                              </div>
                          ))
                        : role == "audience" && (
                              <div
                                  style={{
                                      flex: "0 0 " + getRemoteViewfinderWidth() + "%"
                                  }}
                              ></div>
                          )}
                </div>
            </div>
        </>
    );
};

const styles = (theme) => ({
    videoContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.darkest})`,
        justifyContent: "flex-start",
        paddngLeft: 0,
        paddingRight: 0,
    },
    localViewfinderContainer: {
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    localViewfinderContainerFullscreen: {
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    viewfinderSizer: {
        transition: theme.transitions.create()
    },
    localViewfinder: {
        width: "100%",
        flex: "0 1 100%",
        position: "relative"
    },
    localViewfinderFullscreen: {
        width: "100%",

        flex: "0 1 100%"
    },
    menuButtonRelaunch: {
        borderRadius: theme.spacing(0.5),
        padding: 0,
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing(),
        marginRight: 20
    },
    menuButtonCancel: {
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.functions.rgba(theme.palette.primary.dark, 0.8),
        padding: 0,
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing(),
        marginLeft: 20
    },
    menuButton: {
        color: "red",
        fontSize: 30
    },
    videoStatusBarWarning: {
        width: "calc(100% - 5px)",
        display: "flex",
        height: 40,
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "space-between",
        padding: 5,
        paddingLeft: 10,
        backgroundColor: theme.palette.secondary.main,
        color: "#000"
    },
    videoStatusBar: {
        width: "calc(100% - 5px)",
        display: "flex",
        height: 40,
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "space-between",
        padding: 5,
        paddingLeft: 10,
        backgroundColor: theme.palette.primary.dark,
        color: "#fff"
    },
    remoteViewfinderContainer: {
        width: "100%",
        height: "100%",
        //  backgroundColor: "red",
        display: "flex",
        flexFlow: "row wrap",
        alignContent: "flex-start",
        justifyContent: "flex-start"
    },
    remoteViewfinderContainerSolo: {
        width: "100%",

        //  backgroundColor: "red",
        display: "flex",
        flexFlow: "row wrap",
        alignContent: "flex-start",
        justifyContent: "center"
    }
});

export default withStyles(styles)(RoomVideoView);
