import config from "../../config";

const { useEffect, useState, useRef, useContext } = require("react");
const { getChatToken } = require("utils/API");

const _useChatClient = (userId) => {
    const [error, setError] = useState(null);
    const [client, setClient] = useState(null);
    const clientRef = useRef(null);
    const loginPromise = useRef(null);
    const logoutPromise = useRef(null);
    const [connectionState, setConnectionState] = useState("DISCONNECTED");
    const [creds, setCreds] = useState(null);
    const lastUserId = useRef(null);
    useEffect(() => {
        import("agora-rtm-sdk").then((AgoraRTM) => {
            let chatClient = AgoraRTM.createInstance(config.CHAT_APP_ID, {
                logFilter: { debug: false, error: false, info: false, track: false, warn: false }
            });
            clientRef.current = chatClient;

            setClient(chatClient);
        });
    }, []);

    useEffect(() => {
        if (userId && lastUserId.current != userId) {
            console.log("get creds");
            getChatToken().then((data) => {
                if (data && data.rtmToken) {
                    lastUserId.current = userId;
                    setCreds({ accessToken: data.rtmToken, userId });
                } else {
                    setCreds(null);
                    logout();
                }
            });
        } else {
            setCreds(null);
            logout();
        }
    }, [userId]);

    useEffect(() => {
        if (client && creds && creds.userId && creds.accessToken && !loginPromise.current) {
            console.log(creds);
            login();
        }
    }, [creds, client]);

    const login = () => {
        console.trace("login", loginPromise.current);
        if (!loginPromise.current) {
            if (client) {
                client.on("ConnectionStateChanged", onConnectionStateChange);
                client.on("TokenExpired", onTokenExpired);
                setError(null);
                loginPromise.current = client
                    .login({ uid: creds.userId + "", token: creds.accessToken })
                    .then(() => {
                        console.log("AgoraRTM client login success", client, creds.accessToken);
                        setError(null);
                        loginPromise.current = null;
                        return client;
                    })
                    .catch((err) => {
                        console.warn("AgoraRTM client login failure", err, creds.userId, creds.accessToken);
                        loginPromise.current = null;
                        setError(err);
                        return true;
                    });
            } else {
                loginPromise.current = null;
                console.log("NO CLIENT");
                return Promise.reject("Something went wrong, could not create chat client");
            }
        }
        return loginPromise.current;
    };

    const logout = () => {
        if (!logoutPromise.current) {
            setError(null);
            if (clientRef.current && clientRef.current.ConnectionState == "CONNECTED") {
                logoutPromise.current = clientRef.current
                    .logout()
                    .then(() => {
                        clientRef.current.off("TokenExpired", onTokenExpired);
                        clientRef.current.off("ConnectionStateChanged", onConnectionStateChange);
                        logoutPromise.current = null;
                        return true;
                    })
                    .catch(() => {
                        logoutPromise.current = null;
                        return true;
                    });
            } else {
                logoutPromise.current = null;
                return Promise.resolve(true);
            }
        }
        return logoutPromise.current;
    };

    const onConnectionStateChange = (newState, reason) => {
        console.log("on connection state changed to " + newState + " reason: " + reason);
        setConnectionState(newState);
    };

    const onTokenExpired = () => {
        getChatToken().then((data) => {
            if (data && data.rtmToken) {
                setCreds({ accessToken: data.rtmToken, userId });
            } else {
                setCreds(null);
            }
        });
    };

    const getOnlineStatus = (userIds) => {
        userIds = userIds.map((u) => u + "");
        if (clientRef.current) {
            return clientRef.current.queryPeersOnlineStatus(userIds);
        } else {
            return Promise.reject("Chat client not intialized");
        }
    };

    const getUserAttributes = (uid) => {
        uid = uid + "";
        if (clientRef.current) {
            return clientRef.current
                .getUserAttributes(uid)
                .then((attr) => {
                    attr.online = true;
                    return attr;
                })
                .catch((e) => {
                    console.warn(e);
                    return { online: false };
                });
        } else {
            return Promise.reject("Chat client not intialized");
        }
    };

    return { client, userId, creds, connectionState, error, ref: clientRef.current, getOnlineStatus, getUserAttributes, onTokenExpired };
};

const ChatContext = React.createContext({});

const ChatProvider = ({ children, userId }) => {
    const chatClient = _useChatClient(userId);
    return <ChatContext.Provider value={chatClient}>{children}</ChatContext.Provider>;
};

const useChatClient = () => {
    return useContext(ChatContext);
};

export { useChatClient, ChatProvider, ChatContext };
