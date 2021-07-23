const MEDIA_STATUS = {
    NONE: "none",
    INITIALIZING: "initializing",
    ACTIVE: "active",
    ERROR: "error"
};

const DEVICE_COOKIE = "scener.media.device";

const ERROR = {
    NotFound: {
        VIDEO: {
            title: "Error",
            message: "Could not find camera.",
            kind: "video"
        },
        AUDIO: {
            title: "Error",
            message: "Could not find microphone.",
            kind: "audio"
        }
    },
    NotAllowed: {
        VIDEO: {
            title: "Error",
            message: "You must allow scener.com access to your camera.",
            kind: "video",
            link: "https://scener.com/faq#camera"
        },
        AUDIO: {
            title: "Error",
            message: "You must allow scener.com access to your microphone.",
            kind: "audio",
            link: "https://scener.com/faq#mic"
        }
    },
    TrackEnded: {
        VIDEO: {
            title: "Error",
            message: 'We lost your camera. Make sure it is plugged in and click "Try Again". If the problem persists, try restarting Chrome.',
            kind: "video"
        },
        AUDIO: {
            title: "Error",
            message: 'We lost your microphone. Make sure it is plugged in and click "Try Again". If the problem persists, try restarting Chrome.',
            kind: "audio"
        }
    },
    General: {
        VIDEO: {
            title: "Error",
            message: "Sorry something's gone wrong. If the problem persists, try restarting Chrome.",
            kind: "video"
        },
        AUDIO: {
            title: "Error",
            message: "Sorry something's gone wrong. If the problem persists, try restarting Chrome.",
            kind: "audio"
        }
    }
};

const RECORDER_STATUS = {
    INITIALIZING: "initializing",
    READY: "ready",
    BROADCASTING: "broadcasting",
    ERROR: "error"
};
const SETTINGS = {
    MIME_TYPE: "video/webm;codecs=vp8,h264,opus",
    ALT_MIME_TYPES: [
        // try these in order to find support mime types (or 0 for default)
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm"
    ],
    VIDEO: {
        BITRATE: 600000,
        FRAME_RATE: 15,
        ASPECT_RATIO: 16 / 9
    },
    AUDIO: {
        BITRATE: 40000,
        SAMPLE_SIZE: 16,
        CHANNEL_COUNT: 1
    },
    MAX_RECORDING_CHUNK_LENGTH: 1000
};
export { MEDIA_STATUS, RECORDER_STATUS, SETTINGS, DEVICE_COOKIE, ERROR };
