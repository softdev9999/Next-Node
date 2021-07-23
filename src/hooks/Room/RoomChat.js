import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../Global/GlobalAppState";
import { useSettings } from "../Settings/Settings";
import { checkTextForModeration } from "utils/API";
import { useChatClient } from "../Chat/ChatClient";
import throttle from "lodash/throttle";

const MAX_MESSAGES_IN_CHANNEL = 100;

const useRoomChat = ({ roomId, bannedList, role, moderator, roomType, onDataMessage }) => {
    const {
        auth: { userId, user }
    } = useApp();
    const { client, connectionState, ref, onTokenExpired } = useChatClient();
    const settings = useSettings();
    const [chatChannel, setChatChannel] = useState(null);
    const [error, setError] = useState(null);
    const [memberCount, setMemberCount] = useState(-1);
    const _memberCount = useRef(-1);
    const [attributes, setAttributes] = useState({});
    const memberMap = useRef({}).current;
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const messagesInMemory = useRef([]).current;
    const chatChannelRef = useRef(null);
    const [connecting, setConnecting] = useState(true);
    const [ready, setReady] = useState(false);

    const updateMessages = useCallback(
        throttle(() => {
            setMessages(messagesInMemory.filter((m) => bannedList.indexOf(m.userId) == -1).slice(-MAX_MESSAGES_IN_CHANNEL));
        }, 100),
        [roomId, role, bannedList]
    );
    /* useEffect(() => {
        if (user && user.id) {
        }
    }, [user, moderator, role, roomId]);*/

    useEffect(() => {
        if (!ready && memberCount > 0) {
            setReady(true);
        }
    }, [ready, memberCount]);
    useEffect(() => {
        let newAttrs = {};
        if (user.username) {
            newAttrs.username = user.username;
        }
        if (settings.getItem("displayName")) {
            newAttrs.displayName = settings.getItem("displayName");
        }

        if (client) {
            client.addOrUpdateLocalUserAttributes(newAttrs);
        }
    }, [client, user.username, roomId, role]);
    useEffect(() => {
        if (chatChannel) {
            sendData({ eventName: "connected" });
        }
    }, [chatChannel]);
    useEffect(() => {
        console.log(roomId, client, connectionState);
        if (roomId && client && connectionState == "CONNECTED") {
            let channel = client.createChannel(roomId);
            setConnecting(true);
            channel
                .join()
                .then(() => {
                    chatChannelRef.current = channel;
                    setChatChannel(channel);
                    setConnecting(false);
                    client.getChannelAttributes(roomId).then(setAttributes);
                })
                .catch((e) => {
                    setConnecting(false);
                    setReady(false);

                    console.error(e);
                    setError(e);
                });
            return () => {
                chatChannelRef.current && chatChannelRef.current.leave();
                chatChannelRef.current = null;

                setChatChannel(null);
            };
        }
    }, [roomId, client, connectionState]);

    useEffect(() => {
        if (chatChannel) {
            console.log(chatChannel, "channel connected");
            getMembers();
            window.addEventListener("beforeunload", onBeforeUnload);
            chatChannel.on("MemberJoined", onMemberJoined);
            chatChannel.on("MemberLeft", onMemberLeft);
            chatChannel.on("AttributesUpdated", onAttributesUpdated);
            chatChannel.on("ChannelMessage", onChannelMessage);
            chatChannel.on("MemberCountUpdated", onMemberCountUpdated);
            return () => {
                window.removeEventListener("beforeunload", onBeforeUnload);

                chatChannel && chatChannel.off("MemberJoined", onMemberJoined);
                chatChannel && chatChannel.off("MemberLeft", onMemberLeft);
                chatChannel && chatChannel.off("AttributesUpdated", onAttributesUpdated);
                chatChannel && chatChannel.off("ChannelMessage", onChannelMessage);
                chatChannel && chatChannel.off("MemberCountUpdated", onMemberCountUpdated);
            };
        }
    }, [chatChannel, onDataMessage]);

    const onBeforeUnload = () => {
        console.log("onBeforeUnload");
        chatChannel && chatChannel.leave();
    };

    const onMemberCountUpdated = throttle((count) => {
        _memberCount.current = count;
        setMemberCount(count);
    }, 500);
    const onMemberJoined = (member) => {
        console.log("joined", member);
        if (!memberMap[member] && roomType == "private") {
            setMembers((ms) => ms.filter((m) => m != member).concat([member]));
            memberMap[member] = true;
        }
    };

    const onMemberLeft = (member) => {
        console.log("left", member);
        if (roomType == "private") {
            setMembers((ms) => ms.filter((m) => m != member));
            memberMap[member] = false;
        }
    };

    const setRoomType = (newType) => {
        if (client) {
            return client.getChannelAttributes(roomId).then((attrs) => {
                console.log("set room type", attrs, newType);
                if (!attrs || !attrs.roomType) {
                    attrs = { roomType: { value: "private" } };
                }
                let cmp = newType != attrs.roomType.value;

                if (cmp) {
                    return client.addOrUpdateChannelAttributes(roomId, { roomType: newType }, { enableNotificationToChannelMembers: true });
                } else {
                    return Promise.resolve(true);
                }
            });
        }
    };

    const onAttributesUpdated = (attrs) => {
        console.log("attributres updated", attrs);
        setAttributes(attrs);
    };

    const onChannelMessage = (msg, uid_) => {
        if (msg.messageType == "TEXT") {
            let decodedMsg = decodeMessage(msg.text);
            if (decodedMsg) {
                msg = decodedMsg;

                if (msg.body == null || msg.body == "") {
                    onDataMessage && onDataMessage(msg);
                } else {
                    console.log("message", msg);
                    if (bannedList.indexOf(msg.userId) == -1) {
                        messagesInMemory.push(msg);
                        updateMessages();
                    }
                }
            }
        }
    };

    const getMembers = () => {
        if (roomType != "public") {
            chatChannel.getMembers().then((ms) => {
                console.log("members", ms);
                setMembers(ms);
            });
        }
        client.getChannelMemberCount([roomId]).then((c) => {
            _memberCount.current = c[roomId];

            setMemberCount(c[roomId]);
        });
    };

    const removeMessagesFromUser = (uid) => {
        if (uid) {
            for (let i in messagesInMemory) {
                let m = messagesInMemory[i];
                if (m.userId != uid) {
                    messagesInMemory[i] = m;
                } else {
                    messagesInMemory[i] = {
                        ...m,
                        body: "[ message deleted ]"
                    };
                }
            }
            updateMessages();
        }
    };

    const encodeMessage = (body, data, system) => {
        //     console.log(user);
        let message = {
            id: userId + ":" + Date.now(),
            body,
            data,
            userId: system ? "system" : userId,
            sent: Date.now(),

            user: system ? {
              id: "system",
              roomId,
              role: "system"
            } : {
                id: userId,
                roomId,
                moderator,
                username: user.username,
                displayName: user.displayName,
                role
            }
        };

        return JSON.stringify(message);
    };
    const decodeMessage = (message) => {
        let decoded = {};
        try {
            decoded = JSON.parse(message);
            return decoded;
        } catch (e) {
            return null;
        }
    };

    const sendMessage = (body, data, system) => {
        // console.log("send message", encodeMessage(body, data, system));
        if ((chatChannelRef.current && body && body.trim().length > 0) || data) {
            onChannelMessage({ text: encodeMessage(body, data, system), messageType: "TEXT" }, userId);
            if (body && body.trim().length > 0 && !system) {
                if (roomType != "public" || role == "owner" || role == "host") {
                    return chatChannelRef.current.sendMessage({ text: encodeMessage(body, data, system) });
                } else {
                    return checkTextForModeration(body, roomId, memberCount).then((result) => {
                        if (result && result.success != false) {
                            return chatChannelRef.current.sendMessage({ text: encodeMessage(body, data, system) });
                        } else if (result && result.success == false && result.edited) {
                            return chatChannelRef.current.sendMessage({ text: encodeMessage(result.edited, data, system) });
                        }
                    });
                }
            }
        }
    };

    const sendData = (data) => {
        if (chatChannelRef.current) {
            //            console.log("sending data", data);
            onChannelMessage({ text: encodeMessage(null, data), messageType: "TEXT" }, userId);

            return chatChannelRef.current.sendMessage({ text: encodeMessage(null, data) });
        }
    };

    return {
        chatClient: client,
        clientRef: ref || {},
        chatChannel,
        error,
        connecting,
        members,
        messages,
        sendMessage,
        attributes,
        sendData,
        memberCount,
        setRoomType,
        onTokenExpired: onTokenExpired,
        removeMessagesFromUser,
        ready,
        _memberCount: _memberCount.current
    };
};

export { useRoomChat };
