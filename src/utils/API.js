import Cookies from "./Cookies";

export const request = (endpoint, options) => {
    if (!options) {
        options = {};
    }
    if (!options.headers) {
        options.headers = {};
    }
    if (!options.headers["Content-Type"]) {
        options.headers["Content-Type"] = "application/json";
    }
    if (options.body && typeof options.body !== "string" && options.headers["Content-Type"] == "application/json") {
        options.body = JSON.stringify(options.body);
    }
    options.credentials = "same-origin";
    /*   if (Cookies.get("Auth-Token")) {
        options.headers["Authorization"] = "Bearer " + Cookies.get("Auth-Token");
    }*/

    return fetch("/api" + endpoint, options)
        .then((res) => res.json())
        .then(({ data, error }) => {
            if (data) {
                return data;
            } else if (error) {
                throw error;
            }
        })
        .catch((e) => {
            throw normalizeError(e);
        });
};

const normalizeError = (error) => {
    if (typeof error === "string") {
        error = { message: error, details: null };
    } else if (!error) {
        error = { message: "Something went wrong.", details: null };
    }
    return error;
};

export const auth = () => {
    return request("/users").then((data) => {
        console.log("**** auth return ****", data);

        return data;
    });
};

export const login = ({ username, email, password }) => {
    let body = {
        username,
        email,
        password //: Base64.stringify(CryptoJS.SHA256(password))
    };
    let q = [];
    for (let k in body) {
        if (body[k]) {
            q.push(k + "=" + encodeURIComponent(body[k]));
        }
    }
    return request("/users?" + q.join("&"), {
        method: "GET"
    }).then((data) => {
        console.log("**** auth return ****", data);

        return data;
    });
};

export const requestEmailLink = (email) => {
    let tracking = {};

    let tags = Cookies.get("scener_tags");
    if (tags) {
        tracking = tags;
    }

    return request(`/users`, {
        method: "POST",
        body: {
            email,
            sendLink: true,
            tracking
        },
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const resetPassword = ({ email }) => {
    return request(`/users/forgot`, {
        method: "POST",
        body: {
            email
        },
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        console.log("**** resetPassword return ****", data);
        return data;
    });
};

export const checkResetLink = ({ reset }) => {
    console.log("*** reset ***", reset);

    return request(`/users/forgot?reset=` + reset, {
        method: "GET",

        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        console.log("**** checkResetLink return ****", data);
        return data;
    });
};

export const createUser = (fields) => {
    let body = fields;
    const requestOptions = {
        method: "PUT",
        body
    };
    return request("/users", requestOptions).then((data) => {
        console.log("**** createUser return ****", data);

        return data;
    });
};

export const updateUser = (userId, fields) => {
    let body = fields;

    const requestOptions = {
        method: "PUT",
        body
    };
    return request("/users/" + userId, requestOptions).then((data) => {
        console.log("**** updateUser return ****", data);

        return data;
    });
};

export const uploadImage = (userId, { image, key }) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image
    };
    return request("/users/" + userId + "/" + key, requestOptions).then((data) => {
        console.log("**** imageUpload return ****", data);

        return data;
    });
};

export const createAnonymousUser = () => {
    let oldUserId = Cookies.get("userId");
    const requestOptions = {
        method: "POST"
    };
    requestOptions.headers = {};
    if (oldUserId) {
        requestOptions.headers.userId = oldUserId;
    }
    return request("/users", requestOptions).then((data) => {
        console.log("**** createAnonymousUser return ****", data);

        return data;
    });
};

export const deleteUser = () => {
    const requestOptions = {
        method: "DELETE"
    };
    return request("/users", requestOptions);
};

export const getChatToken = () => {
    const requestOptions = {
        method: "GET"
    };
    return request("/chat", requestOptions).then((data) => {
        console.log("**** getChatToken return ****", data);
        return data;
    });
};

export const createRoom = (roomType, unlisted, password) => {
    const requestOptions = {
        method: "POST",
        body: {
            roomType,
            unlisted,
            password,
            roomMode: "video"
        }
    };
    return request("/rooms", requestOptions).then((data) => {
        console.log("**** createRoom return ****", data);
        return data;
    });
};

export const getRoom = (roomId) => {
    if (!roomId) {
        return Promise.resolve(false);
    }
    const requestOptions = {
        method: "GET"
        //headers: { 'Content-Type': 'application/json' },
    };
    return request("/rooms/" + roomId, requestOptions).then((data) => {
        console.log("**** getRoom return ****", data);
        return data;
    });
};

export const joinRoom = (roomCode, roomPassword) => {
    if (!roomCode) {
        return Promise.resolve(false);
    }
    const requestOptions = {
        method: "GET"
        //headers: { 'Content-Type': 'application/json' },
    };
    let password = roomPassword ? "?p=" + roomPassword : "";

    return request("/rooms/" + roomCode + "/join" + password, requestOptions).then((data) => {
        console.log("**** joinRoom return ****", data);
        return data;
    });
};

export const checkRole = (roomId, userId) => {
    return request(`/rooms/${roomId}/participants/${userId}`).then((data) => {
        return data;
    });
};

export const updateRoom = (roomId, props) => {
    return request(`/rooms/${roomId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: props
    }).then((data) => {
        return data;
    });
};

export const updateRoomStats = (roomId, props) => {
    return request(`/rooms/${roomId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: props
    }).then((data) => {
        return data;
    });
};

export const updateRole = (roomId, userId, role) => {
    return request(`/rooms/${roomId}/participants/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            userId,
            role
        }
    }).then((data) => {
        return data;
    });
};

export const updateModeratorStatus = (roomId, userId, moderator) => {
    return request(`/rooms/${roomId}/participants/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            userId,
            moderator: !!moderator
        }
    }).then((data) => {
        return data;
    });
};

export const addGuest = (roomId, userId) => {
    return request(`/rooms/${roomId}/participants/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            userId,
            role: "host"
        }
    }).then((data) => {
        return data;
    });
};

export const getRelationships = (userId) => {
    return request(`/users/${userId}/relationships`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const getFeaturedUsers = (userId) => {
    return request(`/users/${userId}/featured`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const getLiveNow = () => {
    return request(`/users/live`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const blockUser = (userId) => {
    return request(`/users/${userId}/relationships`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            userId,
            status: "blocked"
        }
    }).then((data) => {
        return data;
    });
};

export const followUser = (userId) => {
    return request(`/users/${userId}/relationships`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            userId,
            status: "following"
        }
    }).then((data) => {
        return data;
    });
};

export const unfollowUser = (userId) => {
    return request(`/users/${userId}/relationships`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            userId,
            status: "none"
        }
    }).then((data) => {
        return data;
    });
};

export const reportUser = (userId, fields) => {
    const requestOptions = {
        method: "POST",
        body: fields
    };
    return request("/users/" + userId + "/reports", requestOptions).then((data) => {
        console.log("**** report user return ****", data);

        return data;
    });
};

export const createReminder = (fields) => {
    const requestOptions = {
        method: "POST",
        body: fields
    };
    return request("/events/reminders", requestOptions).then((data) => {
        console.log("**** set reminder return ****", data);

        return data;
    });
};

export const createEvent = (fields) => {
    const requestOptions = {
        method: "POST",
        body: fields
    };
    return request("/events", requestOptions).then((data) => {
        console.log("**** create event return ****", data);

        return data;
    });
};

export const getEvents = () => {
    return request(`/events`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const getContentById = (id) => {
    return request(`/content/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const deleteEventByID = (id) => {
    return request(`/events/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const startRecording = (roomId) => {
    return Promise.reject("NOT DONE " + roomId);
};

export const updateParticipant = (roomId, userId, data) => {
    return request(`/rooms/${roomId}/participants/${userId}`, {
        method: "PUT",
        body: data
    });
};

export const checkTextForModeration = (text, roomId, viewerCount) => {
    return request("/chat/" + roomId, {
        method: "POST",
        body: { text, viewerCount }
    });
};

export const getPromoMessage = (roomId) => {
    return request(`/rooms/${roomId}/promos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const sendActivity = (data) => {
    return request("/activity", {
        method: "POST",
        body: data
    });
};

export const unsubscribe = (code) => {
    return request("/users/unsubscribe", {
        method: "POST",
        body: { code }
    });
};

export const resubscribe = (code) => {
    return request("/users/unsubscribe", {
        method: "POST",
        body: { code, resubscribe: true }
    });
};

export const sendFeedback = (data) => {
    return request("/users/feedback", {
        method: "POST",
        body: data
    });
};

export const sendPhoneVerify = (phone) => {
    return request("/users/phone?phone=" + encodeURIComponent(phone), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const getPhoneVerify = (phone, code, cryptToken) => {
    return request("/users/phone?phone=" + encodeURIComponent(phone) + "&code=" + code + "&crypt=" + (cryptToken ? 1 : 0), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((data) => {
        return data;
    });
};

export const getCountryByIP = () => {
    //ipgeolocation.com doesn't work anymore
    /// return fetch("https://ipgeolocation.com/?json", { headers: { Accept: "*/*" } })
    /*    .then((res) => res.json())
        .then(({ country }) => {
            return country;
        })
        .catch(() => {*/
    // default to US if we dont find a match
    return Promise.resolve("United States");
    //  });
};
