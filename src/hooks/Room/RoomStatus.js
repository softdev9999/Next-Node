import { useState, useEffect } from "react";

import config from "../../config";
import { useApp } from "../Global/GlobalAppState";
import { useCurrentRoom } from "./Room";
import { useExtension } from "../Extension/Extension";
import { useContentState } from "../ContentState/ContentState";

const useRoomStatus = () => {
    const {
        auth: { userId }
    } = useApp();
    const { player, currentService, currentServiceFormatted, isContentWindowOpen } = useContentState();
    const [status, setStatus] = useState({
        message: "Loading...",
        class: "warning",
        icon: null,
        relaunchButton: false
    });
    const {
        room: { id: roomId, type: roomType },
        syncing
    } = useCurrentRoom();
    const { hostState, host, isSyncing } = syncing;
    const { isExtensionInstalled, versionSupported } = useExtension();

    useEffect(() => {
        setStatus(calculateStatus());
    }, [player, currentService, host, isSyncing, hostState, roomId]);

    const calculateStatus = () => {
        //  console.log(player, currentService, host, isSyncing, hostState);

        let newStatus = {
            message: "Loading...",
            class: "active",
            icon: null,
            title: null,
            relaunchButton: false,
            hostUrl: null
        };

        let serv = currentService || (player && player.service);
        let serviceName = currentServiceFormatted || (serv && (serv.length <= 4 ? serv.toUpperCase() : serv.charAt(0).toUpperCase() + serv.slice(1)));

        newStatus.hostServiceName = serviceName;
        let isHost = host && userId && host == userId;

        if (hostState) {
            newStatus.title = (hostState.title ? "" + hostState.title : "") + (hostState.subtitle ? " " + hostState.subtitle : "");
        } else if (player && (player.title || player.subtitle)) {
            newStatus.title = (player.title ? "" + player.title : "") + (player.subtitle ? " " + player.subtitle : "");
        }

        if (hostState && hostState.currentTime) {
            newStatus.timer = hostState.currentTime ? new Date(hostState.currentTime).toISOString().substr(11, 8) : null;
            newStatus.progress = (hostState.currentTime && hostState.duration && (hostState.duration > 0)) ? Math.round((hostState.currentTime / hostState.duration) * 100) : null;
        }

        if (hostState && hostState.url) {
          // we only use this for statuses, not routing
          newStatus.hostUrl = hostState.url || (isHost && player.url);
        }

        if (serv == "scener") {
            if (player.url) {
                if (player.url.pathname.indexOf("/camera") != -1) {
                    newStatus.message = "Finish setup";
                    newStatus.class = "active";
                    newStatus.setup = true;

                    return newStatus;
                } else if (!isHost && player.url.pathname.indexOf("/permissions") != -1) {
                    newStatus.message = "Finish setup";
                    newStatus.class = "active";
                    newStatus.setup = true;

                    return newStatus;
                } else if (!isHost && player.url.pathname.indexOf("/service") != -1) {
                    newStatus.message = "Finish setup";
                    newStatus.class = "active";
                    newStatus.setup = true;

                    return newStatus;
                }
            }
        }

        if (!serv) {
            //console.log("NO SERVICE");
            if (hostState && (hostState.service || hostState.url)) {
                let hostService = null;
             //   let serviceUrl = null;

                hostService = hostState.service.toUpperCase();
                newStatus.hostService = hostState.service;

              ///  const { service, url, duration } = hostState;

                if (!isExtensionInstalled) {
                    // probably a user watching live - just show the timer
                    if (hostState.title) {
                        newStatus.message = newStatus.title;
                        newStatus.icon = hostState.playing ? "play" : "pause";
                        newStatus.class = "default";
                    } else {
                        newStatus.message = hostService ? "Waiting for host to choose a streaming service" : "Waiting for host to start watching";
                        newStatus.class = "active";
                    }
                }
            } else if (isHost) {
                newStatus.message = "Select Service";
                newStatus.relaunchButton = true;
                newStatus.class = "warning";
            } else {
                newStatus.message = "Loading...";
                newStatus.class = "active";
            }
            return newStatus;
        }

        if (player.error && isContentWindowOpen) {
            if (player.error.indexOf("{{TITLE}}") !== -1) {
                // this error is contigent ONLY IF the host is currently playing an actual title
                if (hostState && hostState.title) {
                    player.error = player.error.replace("{{TITLE}}", hostState.title);
                } else {
                    // this error isn't applicable anymore as the host has stopped playing
                    player.error = null;
                }
            }
        }

        if (player.error && isContentWindowOpen) {
            newStatus.message = player.error;
            newStatus.hostService = serv;
            newStatus.class = "warning";
            newStatus.extra = {
                always: true,
                message: player.error,
                icon: player.pay ? "ticket" : "error"
            };

            return newStatus;
        }

        if (isHost) {
            newStatus.hostService = serv;

            let watchExtra = {
                id: 1,
                title: "You have the remote",
                message: `Pick a show or movie in ${serviceName} and press play to watch together`,
                icon: "remote"
            };

            if (serv == "scener") {
                watchExtra = {
                    id: 20,
                    title: "You have the remote",
                    message: "Select a streaming service and choose something to watch",
                    icon: "remote"
                };
            }

            if (player.duration !== null) {
                newStatus.message = newStatus.title;

                if (isSyncing) {
                    newStatus.icon = "Syncing... ";
                    newStatus.class = "active";
                } else if (player.playing) {
                    newStatus.icon = "play";

                    newStatus.class = "default";
                } else {
                    newStatus.icon = "pause";
                    newStatus.class = "default";
                }
            } else if (!player.title) {
                newStatus.message = "Choose something to watch";
                newStatus.class = "warning";
                newStatus.extra = watchExtra;
            } else if (player.duration === null || typeof player.duration === "undefined") {

                if (serv && config.SERVICE_LIST[serv].pressPlayRequired) {
                  watchExtra = {
                      id: 2,
                      title: "Press PLAY in " + serviceName,
                      icon: "playarrow",
                      message: `Press PLAY in ${serviceName} to start syncing`
                  };

                  newStatus.message = "Press PLAY in " + serviceName + " to start syncing";
                  newStatus.extra = watchExtra;
                } else {
                  newStatus.message = "Loading...";
                }
                newStatus.class = "warning";

            } else {
                newStatus.message = "Loading...";
                newStatus.class = "active";
            }
        } else {
            let watchExtra = {
                id: 2,
                title: "Press PLAY in " + serviceName,
                icon: "playarrow",
                message: `Press PLAY in ${serviceName} to sync your video with the host`
            };

            let watchSync = {
                id: 4,
                showMain: true,
                title: "You are in sync",
                message: "Enjoy the show ✨",
                icon: "thumbsup",
                timeout: 6
            };

            if (!hostState || !hostState.userId) {
                newStatus.message = isHost ? "Loading..." : "Waiting for host...";
                newStatus.class = "active";
                return newStatus;
            }
            newStatus.hostService = hostState.service;

            if (serv && hostState.service && serv != hostState.service) {
                if (roomType && (roomType == "public" || config.SERVICE_LIST[hostState.service].hideBrowsing) && serv == "scener") {
                    newStatus.message = "Waiting for host to start watching...";
                } else {
                    newStatus.message = "Loading " + hostState.service.toUpperCase() + "...";
                }
                newStatus.class = "warning";
                return newStatus;
            }
            if (typeof hostState.currentTime === "undefined" || hostState.currentTime === null) {
                if (isHost) {
                    newStatus.message = !serv || serv == "scener" ? "Select a Service →" : "Waiting...";
                } else {
                    newStatus.message =
                        !serv || serv == "scener" ? "Waiting for host to choose a streaming service" : "Waiting for host to start watching...";
                }
                newStatus.class = "default";
            } else if (!player.duration && player.videoId && (serv && config.SERVICE_LIST[serv].pressPlayRequired)) {
                newStatus.message = "Press PLAY in " + serviceName + " to start syncing";
                newStatus.class = "warning";
                newStatus.extra = watchExtra;
            } else if (isSyncing) {
                newStatus.message = newStatus.title;

                if (serv && config.SERVICE_LIST[serv].pressPlayRequired) {
                    newStatus.message = "Syncing. Press PLAY in " + newStatus.message;
                    newStatus.class = "warning";
                    newStatus.extra = watchExtra;
                } else {
                    newStatus.message = "Syncing to " + newStatus.message;
                    newStatus.class = "active";
                }
            } else {
                newStatus.icon = null;
                newStatus.class = "default";
                newStatus.message = newStatus.title;

                if (hostState && hostState.currentTime) {
                    newStatus.icon = player.playing ? "play" : "pause";

                    if (player && player.currentTime) {
                        //console.log("*** PLAYER SYNC STATE ***", Math.abs(hostState.currentTime - player.currentTime), player);

                        if (Math.abs(hostState.currentTime - player.currentTime) < 5000) {
                            newStatus.extra = watchSync;
                        }
                    }
                } else {
                    if (!newStatus.message) {
                        newStatus.message = "Loading...";
                    }
                }
            }
        }

        if (hostState && (hostState.videoType || player.videoType)) {
            let promoMessage =
                hostState.videoType === "PROMO" && !isHost ? "Waiting for host to finish watching preview" : "Waiting for preview to finish";
            let AdMessage = hostState.videoType === "AD" && !isHost ? "Waiting for host to finish watching ads" : "Waiting for ads to finish";

            if (hostState.videoType === "PROMO" || player.videoType === "PROMO") {
                newStatus.message = promoMessage;
                newStatus.class = "default";
                newStatus.extra = {
                    id: 3,
                    title: promoMessage,
                    icon: "loading"
                };
            } else if (hostState.videoType === "AD" || player.videoType === "AD") {
                newStatus.message = AdMessage;
                newStatus.class = "default";
                newStatus.extra = {
                    id: 3,
                    title: AdMessage,
                    icon: "loading"
                };
            } else if (hostState.videoType === "INTRO" || player.videoType === "INTRO") {
                newStatus.message = "Waiting for Intro to finish";
                newStatus.class = "default";
                newStatus.extra = {
                    id: 3,
                    title: "Waiting for Intro to finish",
                    icon: "loading"
                };
            }
        }

        if (serv && config.SERVICE_LIST[serv].minVersion && !versionSupported(config.SERVICE_LIST[serv].minVersion)) {
            newStatus.message = "Please restart Chrome to update Scener";
            newStatus.class = "warning";
            newStatus.extra = {
                id: 420,
                title: "To sync with " + config.SERVICE_LIST[serv].name + ", Please update Scener to the latest version by restarting Chrome",
                icon: "error"
            };
        }

        if (isExtensionInstalled && !isContentWindowOpen) {
            // Content window has been closed. Inform the user to relaunch it
            newStatus.relaunchButton = true;
            newStatus.extra = null;

            if (isHost) {
                newStatus.message = "Select a Service →";
                newStatus.extra = {
                    title: "Select a Service →"
                };
                newStatus.hostService = null;
                newStatus.hostServiceName = null;
                newStatus.class = "default";
            } else {
                newStatus.class = "warning";
                newStatus.relaunchButton = true;

                if (serv == "scener") {
                  newStatus.message = "Click Relaunch to start watching →";
                  newStatus.extra = {
                      id: 100,
                      message: "To start watching, click the Relaunch button above",
                      icon: "error"
                  };
                } else {
                  newStatus.message = "Click Relaunch to start " + serviceName + " →";
                  newStatus.extra = {
                      id: 100,
                      message: "To restart " + serviceName + ", click the Relaunch button above",
                      icon: "error"
                  };
                }

            }
        }

        return newStatus;
    };

    return { status };
};

export default useRoomStatus;
