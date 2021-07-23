import { useExtension } from "hooks/Extension/Extension";
import { useApp } from "hooks/Global/GlobalAppState";
import { isChrome, isMobile } from "./Browser";
import { joinRoom, followUser, unfollowUser, blockUser, createRoom } from "./API";
import { useRouter } from "next/router";
import config from "../config";
import { mutate } from "swr";

const useAPI = () => {
    const router = useRouter();
    const { isExtensionInstalled, openSidebar, closeSidebar } = useExtension();
    const {
        auth: { loggedIn, userId, relationships, user },
        popups: { account, confirmation },
        sidebar
    } = useApp();

    const updateRelationship = (uid, status) => {
        let newRelationships = {};
        if (!relationships[uid]) {
            newRelationships[uid] = { id: uid, from: null };
        } else {
            newRelationships[uid] = relationships[uid];
        }
        newRelationships[uid].to = status;
        newRelationships[uid].updated = Math.round(Date.now() / 1000);
        mutate("/users/" + userId + "/relationships", Object.assign({}, relationships, newRelationships), false);
    };

    const goToRoom = (room, contentId = null) => {
        if (room) {
            account.show(false);

            console.log("goToRoom", room);
            if (isMobile()) {
                if (room.type == "public") {
                    router.push("/live/[roomId]", `/live/${room.id}`);
                } else {
                    router.push("/join/[roomId]/[step]", `/join/${room.id}/mobile`);
                }
            } else {
                if (isExtensionInstalled) {
                    if (room.member.role == "audience") {
                        openSidebar({
                            serviceUrl: config.getStartUrl() + "loading",

                            sidebarUrl: config.getSidebarUrl(room.id, contentId)
                        });
                    } else {
                        router.push(
                            { pathname: "/join/[roomId]/[step]", query: { contentId } },
                            { pathname: `/join/${room.id}/camera`, query: { contentId } }
                        );
                    }
                } else {
                    router.push(
                        { pathname: "/join/[roomId]/[step]", query: { contentId } },
                        { pathname: `/join/${room.id}/extension`, query: { contentId } }
                    );
                }
            }
        } else {
            router.push("/join", `/join`);
        }
    };

    const host = ({ contentId, roomType, unlisted, passcode }, options, isLoggedIn) => {
        if (isMobile()) {
            router.push("/mobile", "/mobile");
            return Promise.resolve(true);
        }
        if (!isChrome()) {
            router.push("/chrome", `/chrome`);
            return Promise.resolve(true);
        }
        if (loggedIn || isLoggedIn) {
            if (sidebar.state && sidebar.state.roomId) {
                return new Promise((resolve, reject) => {
                    confirmation.show(true, {
                        ...options,
                        message: "This will leave your current watch party.",
                        title: "Are you sure?",
                        onFinished: (result) => {
                            if (result === true) {
                                confirmation.show(false);

                                closeSidebar();
                                createRoom(roomType, unlisted, passcode)
                                    .then((d) => {
                                        if (d && d.id && d.member) {
                                            console.log(d);
                                            goToRoom(d, contentId);
                                            resolve(true);
                                        } else {
                                            reject();
                                        }
                                    })
                                    .catch((e) => {
                                        console.error(e);
                                        reject(e);
                                    });
                            } else {
                                resolve(true);
                            }
                        }
                    });
                });
            } else {
                return createRoom(roomType, unlisted, passcode)
                    .then((d) => {
                        if (d && d.id && d.member) {
                            console.log(d);
                            goToRoom(d, contentId);
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                        throw e;
                    });
            }
        } else {
            router.push(
                { pathname: "/host/[roomType]/[view]", query: { unlisted, contentId, passcode } },
                { pathname: `/host/${roomType}/signup`, query: { unlisted, contentId, passcode } }
            );
        }

        return Promise.resolve(true);
    };

    const schedule = (contentId, options, loggedInUser) => {
        if (loggedIn || loggedInUser) {
            console.log("sched", user && user.username ? user.username : loggedInUser.username);
            let username = user && user.username ? user.username : loggedInUser.username;
            router.push(
                {
                    pathname: "/[username]",
                    query: {
                        action: "schedule",
                        contentId: contentId || 0
                    }
                },
                {
                    pathname: "/" + username,
                    query: {
                        action: "schedule",
                        contentId: contentId || 0
                    }
                }
            );
        } else {
            router.push({ pathname: "/host/[roomType]/[view]", query: { contentId } }, { pathname: "/host/schedule/signup", query: { contentId } });
        }

        return Promise.resolve(true);
    };

    const join = (room, options, isLoggedIn) => {
        console.log("join", { room, loggedIn, isLoggedIn });

        if (isMobile() && room.type == "private") {
            router.push({ pathname: "/mobile", query: { code: room.code } });
            return Promise.resolve(true);
        }
        if (!isChrome() && !isMobile()) {
            account.show(false);

            router.push({ pathname: "/chrome", query: { code: room.code } });
            return Promise.resolve(true);
        }

        if (room.type != "private" || loggedIn || isLoggedIn) {
            if (isMobile()) {
                return joinRoom(room.code || room.id, room.password)
                    .then((res) => {
                        if (res && res.member) {
                            goToRoom(res);
                            return true;
                        } else {
                            throw "Could not join.";
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                        throw e;
                    });
            } else {
                return joinRoom(room.code || room.id, room.password)
                    .then((res) => {
                        if (res && res.member) {
                            if (sidebar.state && sidebar.state.roomId == res.id) {
                                openSidebar();
                                return true;
                            } else {
                                console.log(sidebar.state);
                                if (sidebar.state && sidebar.state.roomId && sidebar.state.roomId != res.id) {
                                    return new Promise((resolve) => {
                                        confirmation.show(true, {
                                            ...options,
                                            message: "This will leave your current watch party.",
                                            title: "Are you sure?",
                                            onFinished: (result) => {
                                                if (result === true) {
                                                    goToRoom(res);

                                                    resolve(true);
                                                } else {
                                                    resolve(false);
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    goToRoom(res);
                                    return true;
                                }
                            }
                        } else {
                            throw "could not join";
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                        throw e;
                    });
            }
        } else {
            return new Promise((resolve) => {
                account.show(true, {
                    initialView: "signup",
                    message: "Log in to continue",
                    onFinished: (u) => {
                        resolve(join(room, options, !!u));
                    },
                    onDismiss: () => {
                        console.log("ondismiss account");
                        resolve(false);
                    }
                });
            });
        }
    };

    const follow = (otherUser, options) => {
        if (!loggedIn) {
            account.show(true, {
                initialView: "signup",
                message: "Create an account to follow @" + otherUser.username,
                skipFinish: true,
                ...options
            });
            return Promise.resolve(true);
        } else {
            updateRelationship(otherUser.id, "following");
            return followUser(otherUser.id)
                .then((ok) => {
                    console.log(ok);

                    if (ok.success) {
                        return true;
                    } else {
                        throw "Could not follow";
                    }
                })
                .catch(() => {
                    return false;
                });
        }
    };

    const unfollow = (otherUser) => {
        if (!loggedIn) {
            return Promise.reject("Not signed in.");
        } else {
            updateRelationship(otherUser.id, "none");

            return unfollowUser(otherUser.id)
                .then((ok) => {
                    if (ok.success) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(() => {
                    return false;
                });
        }
    };

    const block = (otherUser) => {
        if (!loggedIn) {
            return Promise.reject("Not signed in.");
        } else {
            updateRelationship(otherUser.id, "blocked");

            return blockUser(otherUser.id)
                .then((ok) => {
                    if (ok.success) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(() => {
                    return false;
                });
        }
    };

    return { host, join, follow, unfollow, block, schedule };
};

export default useAPI;
