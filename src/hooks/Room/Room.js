import { useEffect, useMemo } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useApp } from "../Global/GlobalAppState";

import { useRoomChat } from "./RoomChat";
import { useSyncing } from "./Syncing";
import { useMedia } from "../UserMedia/MediaProvider";
import { useExtension } from "../Extension/Extension";
import { updateRoom, updateRoomStats, sendActivity, updateParticipant, getPromoMessage } from "utils/API";
import { Settings } from "../Settings/Settings";
import VideoClient from "./VideoClient";
import { isMobile } from "utils/Browser";
import CoHostAlert from "components/SidebarAlerts/CoHost";
import HostManager from "./HostManager";
import useSWR from "swr";
const useRoomState = ({ room, activity, refreshRoom, refreshActivity }) => {
    const {
        auth: { userId },
        sidebar,
        popups: { sidebarAlert }
    } = useApp();
    const { sendMessage, isExtensionInstalled } = useExtension();
    const RoomSettings = Settings("RoomSettings:" + room.id);
    const mediaSource = useMedia();
    const [clientStatus, setClientStatus] = useState(null);
    const [clientError, setClientError] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [activeParticipants, setActiveParticipants] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [promoSent, setPromoSent] = useState(false);
    const { data: bannedList, mutate: mutateBannedList } = useSWR(() => "/rooms/" + room.id + "/banned", {
        initialData: [],
        revalidateOnFocus: false,
        revalidateOnMount: true
    });
    const [isHostLive, setIsHostLive] = useState(
        !!(room.member.role == "host" || room.member.role == "owner" || (activity && activity.live && activity.roomId == room.id))
    );
    const isLiveRef = useRef(isHostLive);
    useEffect(() => {
        console.log(activity, room, isLiveRef.current);
        isLiveRef.current = !!(
            room.member.role == "host" ||
            room.member.role == "owner" ||
            (activity && activity.live && activity.roomId == room.id)
        );
        setIsHostLive(!!(room.member.role == "host" || room.member.role == "owner" || (activity && activity.live && activity.roomId == room.id)));
    }, [activity, room]);

    const users = useRef({}).current;
    const onDataMessage = useMemo(
        () => ({ userId: senderId, data }) => {
            if (data) {
                if (data.eventName == "ended" || data.eventName == "started") {
                    if (senderId == room.ownerId) {
                        if (data.eventName == "ended") {
                            refreshActivity({ ...activity, live: false }, false);
                        } else {
                            refreshActivity({ ...activity, live: true }, false);
                        }
                    }
                } else if (data.eventName == "updatedRole") {
                    console.log(data);
                    if (data.userId && data.userId == userId) {
                        refreshRoom();
                    }
                } else if (data.eventName == "bannedUser") {
                    if (data.userId && data.userId == userId) {
                        console.log("I JUST GOT BANNED!");
                        refreshRoom();
                    } else if (data.userId) {
                        console.log("someone got banned!", data.userId);
                        chat.removeMessagesFromUser(data.userId);
                        mutateBannedList((bl) => bl.concat(data.userId));
                    }
                } else if (data.eventName == "pinnedMessageChanged") {
                    refreshRoom({ ...room, pinnedMessage: data.pinnedMessage });
                } else if (data.eventName == "participantDisconnected") {
                    if (data.userId == senderId) {
                        client.removeParticipant(senderId);
                        refreshRoom();
                    }
                } else {
                    syncing.onMessage(data);
                }
            }
        },
        [isHostLive, syncing, activity]
    );

    const pinMessage = (msg) => {
        if (room.member.role == "owner") {
            return updateRoom(room.id, {
                pinnedMessage: msg
            })
                .then((data) => {
                    if (data.success) {
                        chat.sendData({ eventName: "pinnedMessageChanged", pinnedMessage: msg });
                        refreshRoom({ ...room, pinnedMessage: msg });
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch((e) => {
                    console.error(e);
                    return false;
                });
        }
    };

        const sendPromoMessage = () => {
          if (!promoSent) {
            setPromoSent(true);
            return getPromoMessage(room.id).then((promo) => {
              if (promo && promo.message) {
                return chat.sendMessage(promo.message, promo, true);
              }
            });
          }
        };

    const chat = useRoomChat({
        roomId: room.id + "",
        role: room.member.role,
        bannedList,
        onDataMessage,
        roomType: room.type,
        moderator: room.member.moderator
    });
    const hostManager = useRef(process.browser ? new HostManager() : null).current;

    const syncing = useSyncing({
        roomId: room.id + "",
        sendData: chat.sendData,
        participants,
        chat,
        ownerId: room.ownerId,
        roomType: room.type,
        role: room.member.role,
        hostManager,
        live: isHostLive
    });
    const client = useRef(process.browser ? new VideoClient("rtc", userId) : null).current;

    const lastRole = useRef(room.member.role);

    useEffect(() => {
        RoomSettings.readAll().then(() => {
            setLiveStatus(RoomSettings.getItem("live"));
            sendPromoMessage();
        });
        if (room.member.role != "owner" && room.type == "public") {
            client.onParticipantConnected({ stream: null, uid: room.ownerId });
        }
        return () => {
            RoomSettings.clear();
            sendMessage("sidebarState", "background", {});
        };
    }, []);

    useEffect(() => {
        if (room.member.role == "owner") {
            if (liveStatus !== null) {
                RoomSettings.setItem("live", liveStatus);
            }
            if (liveStatus === false) {
                if (chat) {
                    chat.sendData({ eventName: "ended" });
                }
                //closeSidebar();
            } else if (liveStatus === true) {
                chat && chat.sendData({ eventName: "started" });
            }
        }
    }, [liveStatus, room]);

    useEffect(() => {
        if (activity && activity.roomId == room.id && room.member.role == "host") {
            setLiveStatus(activity.live);
        }
        refreshActivity({ ...activity, roomId: room.id });
    }, [activity, room]);

    useEffect(() => {
        if (client) {
            client.room = room;
            hostManager.setRoom(room);
        }
    }, [room]);

    useEffect(() => {
        if (hostManager) {
            hostManager._chat = chat;
        }
    }, [chat]);

    useEffect(() => {
        if (process.browser) {
            if (sidebar) {
                sidebar.sendState({ state: { roomId: room.id, ownerId: room.ownerId, roomType: room.type, role: room.member.role } });
                window.addEventListener("beforeunload", () => sidebar.sendState({ state: null }));
                let t = setInterval(() => {
                    sidebar.sendState({ state: { roomId: room.id, ownerId: room.ownerId, roomType: room.type, role: room.member.role } });
                }, 5000);
                return () => {
                    window.removeEventListener("beforeunload", () => sidebar.sendState({ state: null }));
                    clearInterval(t);
                };
            }
        }
    }, [room.id, room.ownerId, room.type, room.code, room.member.role]);

    useEffect(() => {
        if (chat) {
            console.log(lastRole.current, room.member.role);
            if (room.member.role != lastRole.current) {
                if (room.member.role == "audience") {
                    chat.sendData({ eventName: "participantDisconnected", userId: userId });
                    RoomSettings.setItem("videoEnabled", null);
                    RoomSettings.setItem("audioEnabled", null);

                    mediaSource.stop();
                } else if (room.member.role == "host" && lastRole.current == "audience") {
                    sidebarAlert.show(true, {
                        Component: <CoHostAlert />
                    });
                }
                client.onRoleChange(room.member.role);
            }

            chat.sendData({ eventName: "roleChanged" });
        }
        lastRole.current = room.member.role;
    }, [room.member.role, room.member.moderator]);

    useEffect(() => {
        if (chat.memberCount > 0 && syncing.host == userId && room.id && userId) {
            updateRoomStats(room.id, {
                memberCount: chat.memberCount
            });
        }
    }, [chat.memberCount, userId, syncing.host, room.id]);
    useEffect(() => {
        if (userId) {
            client.userId = userId;
        }
    }, [userId]);

    useEffect(() => {
        console.log(clientStatus, client);
        if (client && clientStatus == "connected") {
            client.onMediaStateUpdate(mediaSource.mediaState).then(() => {
                if (room.type != "public") {
                    client.publish();
                } else if (room.type == "public") {
                    if (room.member.role == "owner") {
                        /*   if (liveStatus === false) {
                            client.unpublish();
                        } else {*/
                        client.publish();
                        //   }
                    } else if (room.member.role == "host") {
                        client.publish();
                    }
                }
            });
        }
    }, [mediaSource.lastUpdated, client, liveStatus, clientStatus]);

    useEffect(() => {
        if (userId && syncing.host && userId == syncing.host && client.getConnectionState() == "CONNECTED") {
            console.log("got remote", userId, syncing.host, client.getConnectionState());
            chat.sendMessage(`has the remote ✨`);
            updateRoom(room.id, { hostId: userId });
        }
    }, [userId, syncing.host]);
    useEffect(() => {
        sendMessage("sidebarState", "background", {
            roomId: room.id,
            roomType: room.type,
            video: mediaSource.mediaState.videoEnabled,
            audio: mediaSource.mediaState.audioEnabled,
            role: room.member.role
        });
    }, [room.id, room.type, mediaSource.lastUpdated, room.member.role]);

    useEffect(() => {
        if (client) {
            //add event listeners
            client.on("ready", onReady);
            client.on("connected", onConnected);
            client.on("disconnected", onDisconnected);
            client.on("published", onPublished);
            client.on("error", onError);
            client.on("participantConnected", onParticipantConnected);
            client.on("participantDisconnected", onParticipantDisconnected);
            client.on("participantStateChanged", onParticipantStateChanged);

            return () => {
                //remove event listeners
                client.off("ready", onReady);

                client.off("connected", onConnected);
                client.off("disconnected", onDisconnected);
                client.off("published", onPublished);
                client.off("error", onError);
                client.off("participantConnected", onParticipantConnected);
                client.off("participantDisconnected", onParticipantDisconnected);
                client.off("participantStateChanged", onParticipantStateChanged);
            };
        }
    }, []);

    useEffect(() => {
        if (chat.chatChannel) {
            chat.chatChannel.on("AttributesUpdated", hostManager.checkHost.bind(hostManager));
            return () => {
                chat.chatChannel.off("AttributesUpdated", hostManager.checkHost.bind(hostManager));
            };
        }
    }, [chat.chatChannel]);

    useEffect(() => {
        if (
            (client && room && room.member && room.member.rtcToken && (!client.room || client.room.id != room.id || clientStatus != "connected")) ||
            room.member.rtcToken != client.token
        ) {
            console.log(
                "room.id or token changed so we are going to try to connect",
                room.id,
                room.type,
                room.member.rtcToken,
                client.token,
                clientStatus
            );

            client.connectToRoom(room, room.member.rtcToken);
        }
    }, [room, clientStatus]);
    /*  useEffect(() => {
        if (chat.chatChannel) {
            syncing.onReady();
        }
    }, [chat.chatChannel]);*/

    const onReady = () => {
        console.log("ready");
        client && setParticipants(client.getParticipants());
        hostManager.checkHost();
    };
    const onConnected = () => {
        console.log("connected", client.getParticipants());
        setClientError(null);
        setClientStatus("connected");
        client && setParticipants(client.getParticipants());
    };
    const onDisconnected = () => {
        syncing.onDisconnected();
        setClientStatus("disconnected");

        if (client) {
            console.log("disconnected", client.getParticipants());
            //     setParticipants(client.getParticipants());
        }
    };

    const onPublished = () => {
        console.log("published");
        //call start record
        if (room.member.role != "audience" && room.type == "public") {
            // startRecording(room.id);
        }
    };

    const onError = (e) => {
        console.log("error", e);
        setClientError(e);
        setClientStatus("error");
    };

    const onParticipantDisconnected = (participant) => {
        console.log("participantDisConnected", participant, client);
        if (client) {
            console.log("particpant check", client.getParticipants());
            setParticipants(client.getParticipants());
            setActiveParticipants(client.getActiveParticipants());
            if (participant.userId == room.ownerId) {
                refreshRoom();
            }
        }
        if (hostManager) {
            hostManager.onParticipantDisconnected(participant);
        }
    };

    const onParticipantConnected = (participant) => {
        console.log("participantConnected", participant);
        if (client) {
            setParticipants(client.getParticipants());
            setActiveParticipants(client.getActiveParticipants());
        }
        if (hostManager) {
            hostManager.onParticipantConnected(participant.userId);
        }
    };

    const onParticipantStateChanged = (participant, state) => {
        console.log("particpiant state changed", participant, state);
    };

    const disconnect = () => {
        sidebar.sendState({ state: null });
        setLiveStatus(false);
        chat.sendData({ eventName: "ended", userId: userId });

        chat.sendData({ eventName: "participantDisconnected", userId: userId });

        return Promise.resolve(true);
    };

    /** ACTIVITY STUFF */
    const activityTimer = useRef(null);
    const lastState = useRef(null);
    useEffect(() => {
        let newActivity = {
            roomId: room.id,
            isExtensionInstalled,
            isMobile: isMobile(),
            live: liveStatus,
            role: room.member.role,
            video: mediaSource.mediaState.videoEnabled,
            audio: mediaSource.mediaState.audioEnabled,
            viewerCount: chat._memberCount
        };
        if (syncing.hostState) {
            newActivity = { ...syncing.hostState, ...newActivity };
        }
        if (!!lastState.current != !!syncing.hostState) {
            sendActivity(newActivity);
            lastState.current = newActivity;
        } else if (syncing.hostState && lastState.current) {
            if (lastState.current.title != syncing.hostState.title || lastState.current.subtitle != syncing.hostState.subtitle) {
                sendActivity(newActivity);
                lastState.current = newActivity;
            } else {
                lastState.current = newActivity;
            }
        } else {
            lastState.current = newActivity;
        }
    }, [isExtensionInstalled, syncing.hostState, room, liveStatus, mediaSource.lastUpdated]);
    useEffect(() => {
        let newActivity = {
            roomId: room.id,
            isExtensionInstalled,
            isMobile: isMobile(),
            live: liveStatus,
            role: room.member.role,
            video: mediaSource.mediaState.videoEnabled,
            audio: mediaSource.mediaState.audioEnabled,
            viewerCount: chat._memberCount
        };
        if (lastState.current) {
            newActivity = { ...newActivity, ...lastState.current };
        }
        console.log("update newActivity", newActivity);
        sendActivity(newActivity);

        activityTimer.current = setInterval(() => {
            let nActivity = {
                roomId: room.id,
                isExtensionInstalled,
                isMobile: isMobile(),
                live: liveStatus,
                role: room.member.role,
                video: mediaSource.mediaState.videoEnabled,
                audio: mediaSource.mediaState.audioEnabled,
                viewerCount: chat._memberCount
            };
            if (lastState.current) {
                nActivity = { ...nActivity, ...lastState.current };
            }
            console.log("update newActivity", nActivity);
            sendActivity(nActivity);
        }, 60000);

        return () => {
            clearInterval(activityTimer.current);
        };
    }, [isExtensionInstalled, room, liveStatus]);
    return {
        room,

        participants,
        liveStatus,
        chat,
        syncing,
        disconnect,
        client,
        pinMessage,
        clientError,
        activeParticipants,
        clientRef: client,
        users,
        roomSettings: RoomSettings,
        refreshRoom,
        setLiveStatus,
        isHostLive
    };
};

const RoomContext = React.createContext({ syncing: {}, chat: {}, participants: [] });

const RoomStateProvider = ({ children, ...props }) => {
    const room = useRoomState(props);
    return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};

const useCurrentRoom = () => {
    return useContext(RoomContext);
};

export { useRoomState, RoomStateProvider, RoomContext, useCurrentRoom };
