import EventEmitter from "events";

class Participant extends EventEmitter {
    constructor(id, stream, userData) {
        super();
        this.userId = id;
        this.mediaStream = null;
        this._audioTrack = null;
        this._videoTrack = null;
        this.audioEnabled = false;
        this.videoEnabled = false;
        this.state = "DISCONNECTED";
        this.user = {};
        this.init(stream);
        this.user = userData;
    }

    init(stream) {
        this.stream = stream;

        console.log("init participant", this.stream);
        if (this.stream) {
            let vTrack = this.stream.getVideoTrack();
            let aTrack = this.stream.getAudioTrack();
            if (aTrack) {
                this.audioEnabled = !this.stream.peerMuteAudio;
            }
            if (vTrack) {
                this.videoEnabled = !this.stream.peerMuteVideo;
            }
            this.setTracks({ video: vTrack, audio: aTrack });
            //  this.startCheckTimer();
        } else {
            this.setTracks({ video: null, audio: null });
        }
        this.onConnected();
    }
    setTracks(tracks = {}) {
        if (typeof tracks.audio !== "undefined" && (!tracks.audio || tracks.audio.readyState != "ended")) {
            this._audioTrack = tracks.audio;
        }
        if (typeof tracks.video != "undefined" && (!tracks.video || tracks.video.readyState != "ended")) {
            this._videoTrack = tracks.video;
        }
        this.updateMediaStream();
    }

    setAudioTrack(newAudioTrack) {
        this._audioTrack = newAudioTrack;
        this.updateMediaStream();
    }

    setVideoTrack(newVideoTrack) {
        this._videoTrack = newVideoTrack;
        this.updateMediaStream();
    }
    startCheckTimer() {
        clearInterval(this.checkTimer);
        this.checkTimer = setInterval(() => {
            if (this.stream) {
                let vTrack = this.stream.getVideoTrack();
                let aTrack = this.stream.getAudioTrack();
                if (aTrack) {
                    this.onAudioEnabled(aTrack.enabled);
                }
                if (vTrack) {
                    this.onVideoEnabled(vTrack.enabled);
                }
                //   this.setTracks({ video: vTrack, audio: aTrack });
            }
        }, 10000);
    }

    updateMediaStream() {
        console.log("updateMEdiaStream", this, this.mediaStream);
        if (!this.mediaStream) {
            this.mediaStream = new MediaStream();
        }
        let currentAudioTrack = this.mediaStream.getAudioTracks()[0];
        if (!this._audioTrack || (currentAudioTrack && this._audioTrack.id != currentAudioTrack.id)) {
            console.log("stop audio track", this._videoTrack);

            //      currentAudioTrack && currentAudioTrack.stop();
            currentAudioTrack && this.mediaStream.removeTrack(currentAudioTrack);
        }
        let currentVideoTrack = this.mediaStream.getVideoTracks()[0];

        if (!this._videoTrack || (currentVideoTrack && this._videoTrack.id != currentVideoTrack.id)) {
            console.log("stop video track", this._videoTrack);

            //   currentVideoTrack && currentVideoTrack.stop();
            currentVideoTrack && this.mediaStream.removeTrack(currentVideoTrack);
        }
        if (this.mediaStream.getTracks().length == 0) {
            this.mediaStream = new MediaStream();
        }

        console.log("before adding", this.mediaStream.getTracks());
        this._audioTrack && this._audioTrack.readyState !== "ended" && this.mediaStream.addTrack(this._audioTrack);
        this._videoTrack && this._videoTrack.readyState !== "ended" && this.mediaStream.addTrack(this._videoTrack);
        console.log("after adding", this.mediaStream.getTracks());

        this.emit("mediaStreamChange", this.mediaStream);
    }

    onConnected() {
        this.onConnectionStateChanged("CONNECTED");

        this.emit("connected", this);
    }

    onAudioEnabled(enabled) {
        this.audioEnabled = enabled;
        this.emit("audioEnabled", this);
    }

    onVideoEnabled(enabled) {
        this.videoEnabled = enabled;
        this.emit("videoEnabled", this);
    }

    onStreamUpdated() {
        this.emit("updated", this);
    }

    onAudioLevelChanged() {
        this.emit("audioLevelChange", this);
    }
    onConnectionStateChanged(newState) {
        this.state = newState;
        this.emit("connectionStateChanged", newState);
    }

    onDisconnected() {
        console.log("participant disconnected", this.stream);

        this.videoEnabled = false;
        this.audioEnabled = false;
        this._videoTrack = null;
        this._audioTrack = null;
        this.updateMediaStream();
        clearInterval(this.checkTimer);
        this.onConnectionStateChanged("DISCONNECTED");
        this.emit("disconnected", this);
    }
}

export default Participant;
