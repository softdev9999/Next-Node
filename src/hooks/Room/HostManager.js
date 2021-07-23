import EventEmitter from "events";

class HostManager extends EventEmitter {
    constructor() {
        super();
        this.host = null;
        this._chat = null;
        this.participants = {};
        this._hostCheckTimer = null;
        this.room = null;
    }

    setRoom(r) {
        this.room = r;
        console.log(this.room);
        if (r) {
            if (r.member.role != "audience") {
                this.checkParticipants();
            }
        }
    }

    async checkParticipants() {
        if (this._chat && this._chat.chatClient && this._chat.chatChannel && this.participants && this.room) {
            if (this.room.type == "public") {
                if (this.room.member.role != "audience") {
                    await this._chat.chatClient.addOrUpdateLocalUserAttributes({ roomId: this.room.id + "" });
                }
                return Promise.all(
                    this.room.participants.map((p) => {
                        return this._chat.chatClient
                            .getUserAttributes(p.userId + "")
                            .then((res) => {
                                console.log("get attributes", p.userId, res);
                                if (res && res.roomId) {
                                    return {
                                        userId: p.userId,
                                        roomId: res.roomId
                                    };
                                } else {
                                    return null;
                                }
                            })
                            .catch(() => {
                                return null;
                            });
                    })
                ).then((parts) => {
                    console.log(parts);
                    if (parts) {
                        parts = parts.filter((p) => !!p);
                        if (parts.length > 0) {
                            parts.forEach((p) => {
                                if (p && this.participants[p.userId] !== null) {
                                    if (p.userId !== this.room.member.userId) {
                                        this.participants[p.userId] = p.roomId == this.room.id;
                                    }
                                }
                            });
                            if (parts.length > 0) {
                                this.participants[this.room.member.userId] = true;
                            }
                        }
                    }
                    return true;
                });
            } else {
                return this._chat.chatChannel.getMembers().then((mems) => {
                    mems.forEach((p) => {
                        if (p) {
                            this.participants[p] = true;
                        }
                    });
                    return true;
                });
            }
        } else {
            return Promise.reject();
        }
    }

    checkHost() {
        console.log("check host", this.participants);

        clearTimeout(this._hostCheckTimer);
        this._hostCheckTimer = null;
        if (this._chat && this._chat.chatClient && this._chat.chatChannel && this.participants) {
            this._chat.chatClient
                .getChannelAttributesByKeys(this.room.id + "", ["hostId"])
                .then((attrs) => {
                    console.log(attrs);
                    let currentHost = null;
                    let lastHost = null;
                    if (attrs && attrs.hostId) {
                        currentHost = attrs.hostId.value + "";
                        lastHost = attrs.hostId.lastUpdateUserId + "";
                    }
                    if (currentHost == this.host && currentHost && this.host && this.participants[this.host]) {
                        return;
                    }
                    console.log(currentHost, Object.assign({}, this.participants));
                    if (this.room.member.role == "owner" || this.room.member.role == "host") {
                        this.checkParticipants().then(() => {
                            if (currentHost && this.participants[currentHost]) {
                                this.setHost(currentHost + "");
                                this.sendHost(currentHost + "");
                                console.log("currentHost is here", currentHost);
                                return;
                            } else if (lastHost && this.participants[lastHost]) {
                                this.setHost(lastHost + "");
                                this.sendHost(lastHost);

                                console.log("lastHOst is here", lastHost);

                                return;
                            } else {
                                if (
                                    (this.room.ownerId && this.participants[this.room.ownerId]) ||
                                    (Object.keys(this.participants).length == 0 && this.room.member.role == "audience")
                                ) {
                                    console.log("owner found", this.room.member.userId, this.room.ownerId, this.participants, this.room.member.role);
                                    this.setHost(this.room.ownerId);
                                    this.sendHost(this.room.ownerId);
                                    return;
                                }
                                console.log(this.participants);

                                let match = Object.keys(this.participants)
                                    .sort((a, b) => a - b)
                                    .find((id) => !!this.participants[id]);
                                if (match) {
                                    console.log("first participant found", match);

                                    this.setHost(match + "");
                                    this.sendHost(match);
                                    return;
                                }
                            }
                        });
                    } else {
                        //audience

                        if (currentHost && this.participants[currentHost]) {
                            this.setHost(currentHost + "");
                            return;
                        }

                        if (
                            (this.room.ownerId && this.participants[this.room.ownerId]) ||
                            (Object.keys(this.participants).length == 0 && this.room.member.role == "audience")
                        ) {
                            console.log("owner found", this.room.member.userId, this.room.ownerId, this.participants, this.room.member.role);

                            this.setHost(this.room.ownerId + "");
                            return;
                        }
                    }
                })
                .catch((e) => {
                    console.warn(e);
                    this._hostCheckTimer = setTimeout(() => {
                        this.checkHost();
                    }, 1000);
                });
        } else {
            if (!this._hostCheckTimer) {
                this._hostCheckTimer = setTimeout(() => {
                    this.checkHost();
                }, 1000);
            }
        }
    }

    sendHost(uid) {
        if ((this.room.member.userId == uid || this.room.member.role == "owner") && this._chat.clientRef) {
            this._chat.clientRef.addOrUpdateChannelAttributes(this.room.id + "", { hostId: uid + "" }, { enableNotificationToChannelMembers: true });
        }
    }

    setHost(uid) {
        let hid = this.host;
        this.host = uid;

        if (uid != hid) {
            this.emit("hostChanged", uid);
        }
    }

    onParticipantConnected(uid) {
        this.participants[uid] = true;
    }

    onParticipantDisconnected(uid) {
        this.participants[uid] = null;
        if (uid == this.host) {
            this.checkHost();
        }
    }
}

export default HostManager;
