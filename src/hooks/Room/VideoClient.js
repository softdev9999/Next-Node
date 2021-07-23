import Participant from "./Participant";
import config from "../../config";

import EventEmitter from "events";

class VideoClient extends EventEmitter {
    constructor(mode, userId) {
        super();
        this.service = "agora";
        this.userId = userId;
        this.participants = {};
        this.participantDisconnectTimers = {};
        this.participantSubscriptionRetries = {};
        this.trackCheckTimer = null;
        this.published = false;
        this.publishing = false;
        this.mode = mode || "live";
        this.tracks = {
            audio: false,
            video: false
        };
        this.localStream = null;
        this.room = null;
        this.token = null;
        window.onbeforeunload = () => {
            if (this.client && this.localStream) {
                this.client.unpublish(this.localStream, console.error);
            }
        };
    }

    init() {
        return import("agora-rtc-sdk").then((AgoraRTC) => {
            this.AgoraRTC = AgoraRTC;
            if (process.env.NEXT_PUBLIC_STAGE != "prod") {
                AgoraRTC.Logger.enableLogUpload();
            }
            return new Promise((resolve, reject) => {
                this.client = this.AgoraRTC.createClient({ mode: this.mode, codec: "vp8" });
                this.onReady();
                this.client.init(
                    config.VIDEO_APP_ID,
                    () => {
                        console.log("init success", this.client);

                        resolve(this.client);
                    },
                    (err) => {
                        console.error(err);
                        reject(err);
                    }
                );
            });
        });
    }

    async connectToRoom(room, token) {
        if (!this.client) {
            console.log("AgoraVideoClient::connectToRoom::need to init client");
            await this.init();
        }
        if (!token) {
            console.warn("NO TOKEN");
            return Promise.reject("NO TOKEN");
        }

        if (this.client.getConnectionState() == "DISCONNECTED") {
            console.log("connecting", this.client, this.client.getConnectionState(), room.id, token);
            return new Promise((resolve, reject) => {
                if (!token) {
                    resolve(false);
                    return;
                }
                this.client.join(
                    token,
                    room.id + "",
                    room.member.userId,
                    (id) => {
                        console.log("joined uid", id);
                        this.room = room;
                        this.token = token;
                        this.uid = id;
                        resolve(room.id);
                        this.onConnected(room.id);
                    },
                    (e) => {
                        console.error("error joining", e);
                        this.onError(e);
                        reject(e);
                    }
                );
            });
        } else if (this.client.getConnectionState() == "CONNECTED" && this.token && this.token != token) {
            this.client.renewToken(token);
            this.token = token;
        }
    }

    onRoleChange(newRole) {
        if (newRole == "audience") {
            if (this.localStream) {
                this.client.unpublish(this.localStream, console.error);
            }
        }
    }

    disconnect() {
        if (!this.disconnectionPromise) {
            this.disconnectionPromise = new Promise((resolve, reject) => {
                console.log("disconnect agora", this.client, this.client?.getConnectionState(), this.localStream);

                if (this.client && this.client.getConnectionState().toLowerCase() == "connected") {
                    this.leaving = true;

                    if (this.localStream) {
                        this.client.unpublish(this.localStream, console.error);
                    }

                    this.client.leave(() => {
                        console.log("left channel");
                        this.localStream = null;
                        this.participants = {};
                        this.onDisconnected();
                        this.leaving = false;
                        resolve(true);
                    }, reject);
                } else {
                    resolve(true);
                }
            }).then((r) => {
                this.disconnectionPromise = null;
                return r;
            });
        }
        return this.disconnectionPromise;
    }

    onMediaStateUpdate(newState) {
        console.log("onMediaStateUpdate", newState);
        if (!this.updatePromise) {
            this.updatePromise = new Promise(async (resolve, reject) => {
                let changes = {};
                if (newState.videoTrack != this.tracks.video) {
                    changes.videoTrack = true;
                }
                if (newState.audioTrack != this.tracks.audio) {
                    changes.audioTrack = true;
                }
                if (newState.videoEnabled !== this.videoEnabled) {
                    changes.videoEnabled = true;
                }
                if (newState.audioEnabled !== this.audioEnabled) {
                    changes.audioEnabled = true;
                }
                console.log({ changes });
                if (changes.videoTrack || changes.audioTrack) {
                    try {
                        await this.setTracks({ video: newState.videoTrack, audio: newState.audioTrack });
                    } catch (e) {
                        reject(e);
                        return;
                    }
                }
                if (changes.videoEnabled) {
                    this.setVideoEnabled(newState.videoEnabled);
                }
                if (changes.audioEnabled) {
                    this.setAudioEnabled(newState.audioEnabled);
                }

                return resolve(true);
            })
                .then((d) => {
                    console.log("update finished");
                    this.updatePromise = null;
                    return d;
                })
                .catch((e) => {
                    console.log("update finished");

                    this.updatePromise = null;
                    throw e;
                });
        }
        return this.updatePromise;
    }

    setVideoEnabled(enabled) {
        this.videoEnabled = enabled;
        if (this.localStream) {
            console.log("enable video", enabled, this.localStream.getVideoTrack());
            if (!enabled) {
                this.localStream.muteVideo();
            } else {
                this.localStream.unmuteVideo();
            }
        }
    }

    setAudioEnabled(enabled) {
        this.audioEnabled = enabled;
        if (this.localStream) {
            console.log("enable audio", enabled, this.localStream.getAudioTrack());
            if (!enabled) {
                this.localStream.muteAudio();
            } else {
                this.localStream.unmuteAudio();
            }
        }
    }

    setTracks(tracks) {
        this.tracks = Object.assign(this.tracks, tracks);
        console.log("setting a/v tracks", this.client, this.tracks, tracks);

        if (this.room.id && this.client) {
            if ((this.tracks.audio || this.tracks.video) && !this.localStream) {
                let streamConfig = {
                    audio: !!this.tracks.audio,
                    video: !!this.tracks.video
                };

                streamConfig.audioSource = this.tracks.audio;

                streamConfig.videoSource = this.tracks.video;
                let _localStream = this.AgoraRTC.createStream(streamConfig);
                _localStream.setAudioProfile("speech_standard");
                return new Promise((resolve, reject) => {
                    _localStream.init(
                        () => {
                            console.log("local stream init success", _localStream, this.localStream);

                            this.localStream = _localStream;

                            resolve(this.localStream);
                        },
                        (err) => {
                            console.error("init local stream failed ", err);
                            reject(err);
                        }
                    );
                });
            } else if (this.localStream && (this.tracks.audio || this.tracks.video)) {
                let streamConfig = {
                    audio: !!this.tracks.audio,
                    video: !!this.tracks.video
                };

                streamConfig.audioSource = this.tracks.audio;

                streamConfig.videoSource = this.tracks.video;
                console.log(streamConfig, this.localStream, "stream exists check to see if we need to remove or replace");
                let _localStream = this.AgoraRTC.createStream(streamConfig);
                _localStream.setAudioProfile("speech_standard");
                return new Promise((resolve, reject) => {
                    _localStream.init(
                        () => {
                            console.log("local stream init success", _localStream, this.localStream);
                            if (_localStream.getVideoTrack()) {
                                if (this.localStream.getVideoTrack() && this.localStream.getVideoTrack().id != _localStream.getVideoTrack().id) {
                                    this.localStream.replaceTrack(_localStream.getVideoTrack());
                                } else if (!this.localStream.getVideoTrack()) {
                                    this.localStream.addTrack(_localStream.getVideoTrack());
                                }
                            } else if (this.localStream.getVideoTrack()) {
                                this.localStream.removeTrack(this.localStream.getVideoTrack());
                            }
                            if (_localStream.getAudioTrack()) {
                                if (this.localStream.getAudioTrack() && this.localStream.getAudioTrack().id != _localStream.getAudioTrack().id) {
                                    this.localStream.replaceTrack(_localStream.getAudioTrack());
                                } else if (!this.localStream.getAudioTrack()) {
                                    this.localStream.addTrack(_localStream.getAudioTrack());
                                }
                            } else if (this.localStream.getAudioTrack()) {
                                this.localStream.removeTrack(this.localStream.getAudioTrack());
                            }

                            resolve(this.localStream);
                        },
                        (err) => {
                            console.error("init local stream failed ", err);
                            reject(err);
                        }
                    );
                });
            }
        } else {
            return Promise.resolve(false);
        }
    }

    publish() {
        console.log("VideoClient::publish", this.client, this.localStream, this.published);
        if (this.localStream && this.client && !this.published && !this.publishing) {
            this.publishing = true;
            this.client.publish(this.localStream, (e) => {
                if (e) {
                    console.error("error publishing stream", e);
                }
                this.publishing = false;
            });
        }
    }

    unpublish() {
        console.log("VideoClient::unpublish", this.client, this.localStream, this.published);

        if (this.localStream && this.client && this.published && !this.publishing) {
            this.publishing = true;

            this.client.unpublish(this.localStream, (e) => {
                if (e) {
                    console.error("error unpublishing stream", e);
                }
                this.publishing = false;
            });
        }
    }

    onReady() {
        if (this.client) {
            this.client.on("peer-leave", this.onParticipantDisconnected.bind(this));
            this.client.on("peer-online", this.onPeerOnline.bind(this));
            this.client.on("stream-published", this.onPublished.bind(this));
            this.client.on("stream-unpublished", this.onUnpublished.bind(this));

            this.client.on("stream-added", this.onStreamAdded.bind(this));
            this.client.on("stream-subscribed", this.onParticipantConnected.bind(this));
            this.client.on("stream-removed", this.onStreamRemoved.bind(this));
            this.client.on("stream-updated", this.onStreamUpdated.bind(this));
            this.client.on("mute-video", this.onMutedVideo.bind(this));
            this.client.on("unmute-video", this.onUnmutedVideo.bind(this));
            this.client.on("mute-audio", this.onMutedAudio.bind(this));
            this.client.on("unmute-audio", this.onUnmutedAudio.bind(this));
            this.client.on("network-type-changed", function (evt) {
                console.log("Network Type Changed to", evt.networkType);
            });
            this.client.on("network-quality", function (stats) {
                if (stats.downlinkNetworkQuality < 1) {
                    console.log("downlinkNetworkQuality", stats.downlinkNetworkQuality);
                }
                if (stats.uplinkNetworkQuality < 1) {
                    console.log("uplinkNetworkQuality", stats.uplinkNetworkQuality);
                }
            });
            this.client.on("exception", function (evt) {
                console.log(evt.code, evt.msg, evt.uid);
            });
            this.client.on("stream-reconnect-start", function (evt) {
                console.log(evt.uid);
            });
            this.client.on("stream-reconnect-end", function (evt) {
                console.log(evt.uid, evt.success, evt.reason);
            });
            this.emit("ready", this.client);
            // this.startTimer();
        }
    }
    onStreamAdded({ stream }) {
        let id = stream.getId();
        console.log("stream added", id, this.userId);
        if (id !== this.userId) {
            this.client.subscribe(stream, (err) => {
                console.log("stream subscribe failed", err);
                if (!this.participantSubscriptionRetries[id]) {
                    this.participantSubscriptionRetries[id] = 0;
                }
                if (this.participantSubscriptionRetries[id] < 3) {
                    setTimeout(() => {
                        this.participantSubscriptionRetries[id] += 1;
                        this.onStreamAdded({ stream });
                    }, 500 * this.participantSubscriptionRetries[id]);
                }
            });
        }
        console.log("stream-added remote-uid: ", id);
    }

    onConnected(roomId) {
        console.log("agora client connected", this.tracks);
        this.setTracks(this.tracks);
        this.emit("connected", roomId);
    }
    onDisconnected() {
        console.log("agora client disconnected");
        this.room.type = null;
        this.room.id = null;
        //  this.stopTimer();
        this.emit("disconnected", this);
    }

    onPublished() {
        console.log("on stream published");
        this.published = true;
        this.publishing = false;

        this.emit("published", this);
    }

    onUnpublished() {
        console.log("on stream unpublished");
        this.publishing = false;

        this.localStream = null;
        this.tracks = { video: false, audio: false };
        this.audioEnabled = null;
        this.videoEnabled = null;
        this.published = false;
        this.emit("unpublished", this);
    }

    onStreamRemoved({ stream, uid, ...others }) {
        let id = uid || stream.getId();
        console.log("stream-removed remote-uid: ", id, others);
        this.client.unsubscribe(stream);
        this.participants[id] && this.participants[id].onDisconnected();
        this.emit("streamRemoved", id);
    }
    onPeerOnline(data) {
        if (this.room.type != "public" || this.room.participants.find((p) => p.userId == data.uid)) {
            console.log("peer-online", data);
            this.onParticipantConnected(data);
        }
    }

    onParticipantConnected({ stream, uid, ...others }) {
        let id = uid || stream.getId();
        console.log("onParticipantConnected", this.participants[id], stream, id, uid, others);
        clearTimeout(this.participantDisconnectTimers[id]);
        this.participantSubscriptionRetries[id] = 0;
        if (!this.participants[id]) {
            this.participants[id] = new Participant(id, stream);
        } else {
            this.participants[id].init(stream);
        }
        this.emit("participantConnected", this.participants[id]);
    }

    onParticipantDisconnected({ stream, uid, ...others }) {
        if (others && others.reason == "ServerTimeOut") {
            console.log("timeouted");
        } else {
            let id = uid || stream.getId();
            console.log("disconnected remote-uid: ", this.participants[id], id, others);
            stream && this.client.unsubscribe(stream);

            this.participants[id] && this.participants[id].onDisconnected();
            clearTimeout(this.participantDisconnectTimers[id]);
            this.participantDisconnectTimers[id] = setTimeout(() => {
                this.removeParticipant(id);
            }, 20000);
        }
    }

    removeParticipant = (id) => {
        this.participants[id] = null;
        this.emit("participantDisconnected", id);
    };

    onStreamUpdated({ stream, uid, ...others }) {
        let id = uid || stream.getId();
        console.log("on stream updated", stream, id, others);
        if (!this.participants[id]) {
            console.log("participant doesn't exist, create participant");
            this.participants[id] = new Participant(id, stream);
        } else {
            console.log("participant  exists, update participant");

            this.participants[id].init(stream);
        }
    }

    onMutedAudio({ uid }) {
        console.log("on stream muted audio", uid);

        if (this.participants[uid]) {
            this.participants[uid].onAudioEnabled(false);
        }
    }

    onMutedVideo({ uid }) {
        console.log("on stream muted video", uid);

        if (this.participants[uid]) {
            this.participants[uid].onVideoEnabled(false);
        }
    }

    onUnmutedAudio({ uid }) {
        console.log("on stream unmuted audio", uid);

        if (this.participants[uid]) {
            this.participants[uid].onAudioEnabled(true);
        }
    }

    onUnmutedVideo({ uid }) {
        console.log("on stream unmuted video", uid);

        if (this.participants[uid]) {
            this.participants[uid].onVideoEnabled(true);
        }
    }
    startTimer() {
        this.stopTimer();
        this.trackCheckTimer = setInterval(() => {
            this.setAudioEnabled(this.audioEnabled);
            this.setVideoEnabled(this.videoEnabled);
            this.setTracks(this.tracks);
        }, 5000);
    }

    stopTimer() {
        clearInterval(this.trackCheckTimer);
        this.trackCheckTimer = null;
    }

    onError(e) {
        this.emit("error", e);
    }

    onParticipantStateChanged(participant, state) {
        this.emit("participantStateChanged", participant, state);
    }

    getActiveParticipants() {
        return Object.values(this.participants).filter((p) => !!p && (p.videoEnabled || p.audioEnabled));
    }
    getParticipants() {
        return Object.values(this.participants).filter((p) => !!p);
    }

    getConnectionState() {
        if (this.client) {
            return this.client.getConnectionState();
        } else {
            return "DISCONNECTED";
        }
    }
}

export default VideoClient;
