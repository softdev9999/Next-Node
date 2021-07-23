import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useApp } from "../Global/GlobalAppState";
import { useContentState } from "../ContentState/ContentState";
import { useExtension } from "../Extension/Extension";
import config from "../../config";
import { getServiceNameFromUrl, addTrackingParams } from "utils/Browser";

import { isMobile } from "utils/Browser";

const SYNC_WINDOW_PLUS_MINUS = 2000;
const HOST_STATE_TIMEOUT = 8000;

const useSyncing = ({ hostManager, roomId, chat, roomType, live }) => {
    const {
        auth: { userId }
    } = useApp();
    const { servicePermissions, checkServicePermissions, serviceSettingRequired, loginSettingRequired } = useExtension();
    const { player, play, pause, setCurrentTime, currentService, navigate, shouldNavigateBetween, isContentWindowEmpty } = useContentState();
    const {
        url,
        currentTime,
        playing,
        navReady,
        title,
        videoId,
        metadata,
        isLive,
        pay,
        subtitle,
        duration,
        parentLink,
        lastUpdated,
        videoType,
        inCredits
    } = player;

    const joined = useRef(moment().unix());
    const [host, setHost] = useState(null);
    const [error, setError] = useState(null);
    const [hostState, setHostState] = useState({});
    const stateTimer = useRef(null);
    const participantStates = useRef({}).current;
    const syncing = useRef(false);
    const servPerm = useRef(null);
    const passingRemoteTo = useRef(false);
    const passingRemotePromise = useRef(null);

    const onMessage = (data) => {
        if (data) {
            let { userId: uid, state } = data;
            //  if (state && user) {

            if (state) {
                if (state.url) {
                    state.url = new URL(state.url);
                }
                participantStates[uid + ""] = state;
            }

            if (state) {
                if (uid == hostManager.host) {
                    setHostState(participantStates[uid + ""]);
                    syncToHost(hostManager.host);
                }
            }
        }
        //  }
    };

    useEffect(() => {
        servPerm.current = servicePermissions;
    }, [servicePermissions]);

    useEffect(() => {
        if ((host == userId && parentLink && duration && currentTime && videoType != "PROMO" && duration - currentTime < 20000) || inCredits) {
            let newUrl = new URL(url.href);
            newUrl.pathname = parentLink;
            navigate(newUrl);
        }
    }, [userId, host, currentTime, duration, parentLink, url, videoType, inCredits]);

    useEffect(() => {
        sendState();
        startTimer();
        return () => {
            stopTimer();
        };
    }, [host, url, currentTime, playing, userId, currentService, title, subtitle, live]);

    const startTimer = () => {
        stopTimer();
        stateTimer.current = setInterval(() => {
            sendState();
        }, 1000);
    };
    const stopTimer = () => {
        clearInterval(stateTimer.current);
        stateTimer.current = null;
    };

    const isFreshState = () => {
        let curT = Math.round(Date.now() / 1000);
        return lastUpdated && curT - lastUpdated < HOST_STATE_TIMEOUT / 1000;
    };

    const sendState = () => {
        if (userId) {
            let newState = {
                userId,
                state: {
                    userId,
                    duration: isFreshState() ? duration : null,
                    currentTime: isFreshState() ? currentTime : null,
                    url: isFreshState() ? url : null,
                    playing,
                    videoType,
                    isLive,
                    videoId,
                    metadata,
                    hostId: hostManager.host,
                    lastUpdated,
                    navReady,
                    joined: joined.current,
                    syncing: syncing.current,
                    service: isFreshState() ? currentService : null,
                    title,
                    pay,
                    subtitle
                },
                host: { userId: hostManager.host }
            };

            participantStates[userId] = newState.state;
            if (hostManager.host == userId) {
                chat.sendData(newState);
                setHostState(newState.state);
            }
        }
    };

    useEffect(() => {
        hostManager.on("hostChanged", onHostChanged);
        return () => {
            hostManager.off("hostChanged", onHostChanged);
        };

        //  sendState();
    }, [hostManager]);

    const onHostChanged = () => {
        console.log("host changed", hostManager.host);
        setHost(hostManager.host);
    };

    const passRemoteToUser = (uid) => {
        if (!passingRemoteTo.current) {
            passingRemotePromise.current = new Promise((resolve, reject) => {
                if (!uid || host != userId || passingRemoteTo.current) {
                    reject({ message: "not valid", uid, host, userId, passingTo: passingRemoteTo.current });
                    return;
                }

                passingRemoteTo.current = uid;
                return chat.chatClient
                    .addOrUpdateChannelAttributes(roomId, { hostId: uid + "" }, { enableNotificationToChannelMembers: true })
                    .then(() => {
                        hostManager.setHost(uid + "");
                        resolve(true);
                    });
            })
                .then((res) => {
                    ////console.log("finished", res);
                    passingRemotePromise.current = null;
                    passingRemoteTo.current = null;

                    return res;
                })
                .catch((e) => {
                    passingRemoteTo.current = null;
                    ////console.log("passing timedout", e);
                    hostManager.setHost(userId + "");

                    passingRemotePromise.current = null;
                    throw e;
                });
        }
        return passingRemotePromise.current;
    };

    /*  const checkRoomStatus = async (newHost) => {
          if (!isRoomInSync() && newHost == userId) {
            let isPlaying = playing;
            if (isPlaying) {
                pause();
            }
            await waitForFullSync();
            if (isPlaying) {
                play();
            }
        }
    };

    const isRoomInSync = () => {
        for (let k in participantStates) {
            if (k != host && participantStates[k].syncing) {
                return false;
            }
        }
        return true;
    };

    const fullSyncPromise = useRef(null);
    const waitForFullSync = (timeout = 10000) => {
        if (!fullSyncPromise.current) {
            fullSyncPromise.current = new Promise((resolve, reject) => {
                let i = 0;
                if (isRoomInSync()) {
                    resolve(true);
                    return;
                }
                let t = setInterval(() => {
                    if (isRoomInSync()) {
                        resolve(true);
                        return;
                    }
                    i++;
                    if (i > timeout / 200) {
                        reject("timeout");
                        clearInterval(t);
                        return;
                    }
                }, 200);
            })
                .then(() => {
                    fullSyncPromise.current = null;
                    return true;
                })
                .catch((e) => {
                    fullSyncPromise.current = null;

                    throw e;
                });
        }
        return fullSyncPromise.current;
    };
*/
    const syncWindow = useRef(SYNC_WINDOW_PLUS_MINUS);
    const syncBuffer = useRef(SYNC_WINDOW_PLUS_MINUS / 2);

    const onSyncTimeout = () => {
        syncWindow.current *= 1.1;

        syncBuffer.current *= 1.25;
        if (syncBuffer.current > 15000 || syncWindow.current > 10000) {
            setError("syncing");
        }
    };

    const syncToHost = async (newHost) => {
        // TODO CLEANUP

        try {
            if (!syncing.current && newHost != userId && !error && !isMobile() && live) {
                if (newHost) {
                    let newHostState = participantStates[newHost];
                    let localState = participantStates[userId];

                    //console.log("host", newHostState, "local", localState);
                    /*if (newHostState && newHostState.service == "scener") {
                        syncing.current = false;
                        return;
                    }*/

                    if (newHostState) {
                        if (localState) {
                            // WORKAROUND for strange issue where URL() casting removes URL params
                            let newhurl = {
                                host: newHostState.url.host,
                                hostname: newHostState.url.hostname,
                                pathname: newHostState.url.pathname,
                                search: newHostState.url.search,
                                hash: newHostState.url.hash,
                                href: newHostState.url.href
                            };

                            let serv = newHostState.service ? newHostState.service : getServiceNameFromUrl(newhurl);
                            let hasPermissions = servPerm.current && serv && servPerm.current.has(serv);

                            if (shouldNavigateBetween(newHostState, localState)) {
                                if (!hasPermissions) {
                                    hasPermissions = await checkServicePermissions(serv);
                                    if (!hasPermissions) {
                                        //     console.log("*** NO SERV PERMISSIONS ***", serv);
                                        syncing.current = true;
                                        await navigate(new URL(config.getStartUrl() + "permissions/" + serv));
                                        syncing.current = false;

                                        return;
                                    }
                                }


                                if (serviceSettingRequired(serv)) {
                                    //console.log("** NEED SETTING FOR **", serv);
                                    syncing.current = true;
                                    await navigate(new URL(config.getStartUrl() + "service?setting=" + serv));
                                    syncing.current = false;
                                    return;
                                } else if (loginSettingRequired(serv)) {
                                    //   console.log("*** Need to ask for login prompt ***", serv);
                                    syncing.current = true;
                                    await navigate(new URL(config.getStartUrl() + "service?login=" + serv));
                                    syncing.current = false;
                                    return;
                                }

                                if (
                                    isContentWindowEmpty(newHostState.url) ||
                                    (!newHostState.duration && (roomType == "public" || config.SERVICE_LIST[serv].hideBrowsing)) ||
                                    newHostState.service == "scener"
                                ) {
                                    //     console.log("*** ROUTING to Waiting page ***");

                                    syncing.current = true;
                                    await navigate(new URL(config.getStartUrl() + roomId + "/waiting"));
                                    syncing.current = false;
                                    return;
                                } else {
                                    // console.log("Navigating to... ", newHostState.url);

                                    let navResult = null;

                                    syncing.current = true;

                                    // add tracking
                                    newhurl = config.addTrackingParams(newhurl, serv, {id: roomId, type: roomType});

                                    navResult = await navigate(newhurl);
                                    syncing.current = false;

                                    if (!navResult) {
                                        return;
                                    }
                                }
                            } else {
                                // console.log("*** NO NAV ***");
                                syncing.current = false;
                            }

                            if (localState.currentTime == null) {
                                // not yet ready for synching
                                return;
                            }

                            if (localState.pay) {
                                // guest is on a paywall. dont try to sync yet
                                return;
                            }

                            if (newHostState.videoType == "PROMO") {
                                if (localState.videoType != "PROMO") {
                                    pause();
                                    await setCurrentTime(0);
                                    return;
                                }
                            } else {
                                if (localState.videoType == "PROMO") {
                                    await setCurrentTime(localState.duration - 1000);
                                    play();
                                    return;
                                }
                            }
                            if (newHostState.videoType == "AD") {
                                if (localState.videoType != "AD") {
                                    pause();
                                    return;
                                }
                            } else {
                                if (localState.videoType == "AD") {
                                    return;
                                }
                            }

                            let syncWindowOffset = syncWindow.current;
                            let canSeek = true;

                            if (newHostState.isLive) {
                                /* for live playback, allow a bigger sync window to prevent constant re-seeks.
                              (perhaps make this configurable, as it currently is only an issue with YouTube

                              for live YouTube, instead of using absolute currentTime values, we'll have to use
                              a % offset for each localState, as it appears each persons currentTime is based on the
                              time they started watching the stream. Yikes. Tricky. We allow a huge window here
                              to ameliorate this, until a fix is made. For now, it's best for the host to have most of the
                              audience present BEFORE switching to the live stream.  Really late-comers might notice issues.*/

                                syncWindowOffset = syncWindow.current * 100;

                                if (newHostState.service && config.SERVICE_LIST[newHostState.service].syncLive) {
                                    canSeek = config.SERVICE_LIST[newHostState.service].syncLive;
                                }
                            }

                            if (
                                canSeek &&
                                Math.abs(newHostState.currentTime - localState.currentTime) > syncWindowOffset / (newHostState.playing ? 1 : 2)
                            ) {
                                syncing.current = true;
                                //console.log("sync to time", newHostState.currentTime, localState.currentTime);
                                if (localState.playing) {
                                    pause();
                                }

                                //console.log("LIVE STUFF: ", Math.round(newHostState.duration - newHostState.currentTime) / 1000, Math.round(localState.duration - localState.currentTime) / 1000, Math.round(newHostState.currentTime - localState.currentTime) / 1000);

                                // only try to sync if we are not near the end
                                let timeRemaining = newHostState.duration - newHostState.currentTime;

                                // dont send seek requests that are too old, as this can cause jitter
                                let hostMessageTimeSince = 0; //Math.round(Date.now() / 1000) - newHostState.lastUpdated;

                                if (timeRemaining > 1000 && hostMessageTimeSince < 4) {
                                    await setCurrentTime(
                                        newHostState.currentTime + (newHostState.playing ? syncBuffer.current : 0),
                                        syncWindowOffset,
                                        syncBuffer.current
                                    );
                                }
                                syncing.current = false;
                            }
                            //console.log("play or pause", newHostState.playing);
                            if (newHostState.playing) {
                                play();
                            } else {
                                pause();
                            }
                            syncing.current = false;
                        }
                    } else {
                        //hostManager.checkHost();
                        console.log("No local state found (yet)");
                    }
                } else {
                    //console.log("no host set");
                    console.log("No host state found (yet)");
                }
                syncing.current = false;
            } else {
                if (newHost == userId && newHost) {
                    let newHostState = participantStates[newHost];

                    if (newHostState && isContentWindowEmpty(newHostState.url) && !syncing.current) {
                      
                        let roomParams = "roomId=" + roomId + "&roomType=" + roomType;

                        // either host closed the window, or somehow returned to the starting state
                        // this can also happen if the content window is "out of bounds" on some other site somehow
                        console.log("host has empty window!", newHostState);

                        syncing.current = true;
                        await navigate(new URL(config.getStartUrl() + "service" + "?" + roomParams));
                        syncing.current = false;

                        return;
                    }
                }
            }
        } catch (e) {
            console.warn(e);
            syncing.current = false;
            if (e == "seek timeout") {
                onSyncTimeout();
            }
        }
    };

    const onDisconnected = (/*...args*/) => {
        //      participantPing(roomId, true).then(console.warn);

        //console.log("onDisconnected syncing", ...args);
        setHostState({});
        for (let k in participantStates) {
            delete participantStates[k];
        }
        passingRemoteTo.current = null;
    };

    return {
        roomId,
        host,
        hostState,
        setHost,
        syncToHost,
        isSyncing: syncing.current,
        passRemote: passRemoteToUser,
        passingRemote: passingRemoteTo.current,
        participantStates,
        onDisconnected,

        onMessage
    };
};

export { useSyncing };
