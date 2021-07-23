import { useState, useEffect, useCallback } from "react";
import Cookies from "utils/Cookies";
import { auth, login, createAnonymousUser, createUser, updateUser, uploadImage, request } from "utils/API";
import JwtDecode from "jwt-decode";
import { gtag } from "utils/Tracking";
import useSWR from "swr";
import { useSettings } from "../Settings/Settings";
import { mutate } from "swr";
import { ACCOUNT_TYPE } from "./AuthConstants";
function getCachedUser() {
    try {
        return JSON.parse(sessionStorage.getItem("scener.user"));
    } catch (e) {
        return {};
    }
}

function useAuthState() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const [loggedIn, setLoggedIn] = useState(null);
    const [accountType, setAccountType] = useState(null);
    const settings = useSettings();
    const { data: user, error, mutate: mutateUser } = useSWR(
        ["/users/auth", token],
        (url, tok_) => request(url, { headers: { "cache-control": "no-cache", web: 1 } }),
        {
            initialData: getCachedUser(),
            revalidateOnMount: true,
            onSuccess: (data) => {
                if (data) {
                    mutate("/users/" + data.username, data, false);
                    mutate("/users/" + data.id, data, false);
                } else {
                    setAccountType(null);
                    setToken(null);
                    setUserId(null);
                }
            }
        }
    );

    const { data: relationships, error: relError_ } = useSWR(() => "/users/" + user.id + "/relationships");

    const checkCookie = () => {
        // console.log(token, Cookies.get("Auth-Token"));
        if (Cookies.get("Auth-Token")) {
            if (token != Cookies.get("Auth-Token")) {
                try {
                    let decoded = JwtDecode(Cookies.get("Auth-Token"));
                    if (decoded.id != userId) {
                        setAccountType(decoded.type);
                        setToken(Cookies.get("Auth-Token"));
                        setUserId(decoded.id);
                    }
                } catch (e) {
                    setAccountType(null);
                    setToken(null);
                    setUserId(null);
                }
            }
        } else {
            setAccountType(null);
            setToken(null);
            setUserId(null);
        }
    };
    /* useEffect(() => {
        checkCookie();
    }, []);*/
    useEffect(() => {
        checkCookie();
        let t = setInterval(() => {
            checkCookie();
        }, 10000);
        return () => {
            clearInterval(t);
        };
    }, [token]);

    useEffect(() => {
        if (token && accountType > ACCOUNT_TYPE.ANONYMOUS && userId) {
            setLoggedIn(true);
        } else if (!token && !accountType && !userId) {
            setLoggedIn(false);
        }
    }, [token, accountType, userId]);

    useEffect(() => {
        if (user && !error) {
            //   console.log("loggedIn", { user, token });
            sessionStorage.setItem("scener.user", JSON.stringify(user));
        } else if (!token && !user) {
            setLoggedIn(false);
        }
    }, [token, user, error]);

    useEffect(() => {
        if (token && user && accountType) {
            gtag("config", "GA_MEASUREMENT_ID", {
                user_id: user.id
            });
        }
    }, [accountType, user, token]);

    const onAuth = (data) => {
        if (data && data.id && Cookies.get("Auth-Token")) {
            try {
                checkCookie();
                mutateUser(data);
                mutate("/users/" + data.username, data);
                mutate("/users/" + data.id, data);

                return data;
            } catch (e) {
                console.log(e);
            }
        }
        return data;
    };

    const loginUser = (creds) => {
        return login(creds).then(onAuth);
    };

    const createNewUser = (props) => {
        let wait = null;
        if (props) {
            if (!props.tracking) {
                let tags = Cookies.get("scener_tags");

                props.tracking = tags;
            }
            wait = createUser(props);
        } else {
            wait = createAnonymousUser();
        }
        return wait.then(onAuth);
    };

    const update = (props) => {
        console.log("update user", props);
        return updateUser(user.id, props).then(onAuth);
    };

    const uploadUserImage = (props) => {
        return uploadImage(user.id, props).then((res) => {
            if (!res.error) {
                mutateUser({ ...user, ...res });
                mutate("/users/" + user.username, { ...user, ...res });
                mutate("/users/" + user.id, { ...user, ...res });
            }
            return res;
        });
    };

    const logout = () => {
        Cookies.set("Auth-Token", null);
        settings.clear();
        sessionStorage.removeItem("scener.user");
        setToken(null);
        setAccountType(ACCOUNT_TYPE.NONE);
    };

    const getRelationship = useCallback(
        (uid) => {
            if (user && relationships) {
                return relationships[uid];
            } else {
                return "loading";
            }
        },
        [user, relationships]
    );

    const isFollowingUser = useCallback(
        (uid) => {
            if (user && relationships) {
                return relationships[uid] && relationships[uid].to == "following";
            }
            return false;
        },
        [user, relationships]
    );

    const isFollowedByUser = useCallback(
        (uid) => {
            if (user && relationships) {
                return relationships[uid] && relationships[uid].from == "following";
            }
            return false;
        },
        [user, relationships]
    );

    const isBlocked = useCallback(
        (uid) => {
            if (user && relationships) {
                return relationships[uid] && relationships[uid].to == "blocked";
            }
            return false;
        },
        [user, relationships]
    );

    const isBanned = useCallback(
        (uid) => {
            if (user && relationships) {
                return relationships[uid] && relationships[uid].to == "banned";
            }
            return false;
        },
        [user, relationships]
    );

    return {
        userId: token && user ? user.id : null,
        token,
        user: (token && user) || {},

        relationships,
        getRelationship,
        isFollowedByUser,
        isFollowingUser,
        isBlocked,
        isBanned,
        error,
        mutate: mutateUser,
        auth,
        loggedIn,
        loginUser,
        createNewUser,
        update,
        uploadUserImage,
        logout,
        accountType,
        isVerified: accountType >= ACCOUNT_TYPE.VERIFIED,
        isAuthed: accountType >= ACCOUNT_TYPE.AUTHED,
        isAnonymous: accountType >= ACCOUNT_TYPE.ANONYMOUS
    };
}

export { useAuthState, ACCOUNT_TYPE };
