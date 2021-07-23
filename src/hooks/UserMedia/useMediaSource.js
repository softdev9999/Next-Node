import { useState, useRef, useEffect, useMemo } from "react";
import { SETTINGS, ERROR, MEDIA_STATUS, DEVICE_COOKIE } from "./constants";
import { Settings } from "../Settings/Settings";
import useDevices from "./useDevices";
import useAudioProcessor from "./useAudioProcessor";
const useMediaSource = () => {
    const permissionsSettings = Settings("permissions");
    const [media, setMedia] = useState({});
    const mediaState = useRef({}).current;
    const [lastUpdated, setLastUpdated] = useState(0);
    const [videoStatus, setVideoStatus] = useState(MEDIA_STATUS.NONE);
    const [audioStatus, setAudioStatus] = useState(MEDIA_STATUS.NONE);
    const [videoAllowed_, setVideoAllowed] = useState(null);
    const [audioAllowed_, setAudioAllowed] = useState(null);
    const [audioError, setAudioError] = useState(null);
    const [videoError, setVideoError] = useState(null);
    const [permissions, setPermissions] = useState({ audio: null, video: null });
    const lastPermissions = useRef(permissions).current;
    const devices = useDevices();
    const { audioDevice, videoDevice, selectAudioDevice, selectVideoDevice } = devices;
    const activeDevices = useRef({ video: null, audio: null, output: null }).current;
    // const audioCtx = useAudio();
    const { audioLevel, error, resetError } = useAudioProcessor({
        stream: useMemo(() => mediaState.audioStream, [lastUpdated]),
        enabled: useMemo(() => mediaState.audioEnabled, [lastUpdated]),
        output: false,
        pan: 0,
        volume: 1,
        muted: false
    });
    useEffect(() => {
        console.log(error);
        if (typeof error !== "undefined") {
            setAudioError(error);
        }
    }, [error]);
    useEffect(() => {
        console.log(mediaState);
        setMedia(mediaState);
    }, [lastUpdated]);

    const resetErrors = () => {
        setAudioError(null);
        setVideoError(null);
    };

    const checkPermissions = async () => {
        console.log("MediaSource::checkPermissions");

        let d = await permissionsSettings.readAll();
        let camera = null;
        let mic = null;
        if (d) {
            if (typeof d.audioAllowed !== "undefined" && d.audioAllowed !== null) {
                mic = d.audioAllowed;
            }
            if (typeof d.videoAllowed !== "undefined" && d.videoAllowed !== null) {
                camera = d.videoAllowed;
            }
        }
        if (typeof navigator.permissions !== "undefined") {
            camera = await navigator.permissions
                .query({ name: "camera" })
                .then(function (result) {
                    console.log("camera result", result);
                    if (result.state == "granted") {
                        return true;
                    } else if (result.state == "prompt") {
                        permissionsSettings.setItem("videoAllowed", null);

                        return null;
                    } else {
                        return false;
                    }
                    // Don't do anything if the permission was denied.
                })
                .catch(() => {
                    return camera;
                });
            mic = await navigator.permissions
                .query({ name: "microphone" })
                .then(function (result) {
                    console.log("mic result", result);
                    if (result.state == "granted") {
                        return true;
                    } else if (result.state == "prompt") {
                        permissionsSettings.setItem("audioAllowed", null);
                        return null;
                    } else {
                        return false;
                    }
                    // Don't do anything if the permission was denied.
                })
                .catch(() => {
                    return mic;
                });
        }
        setPermissions({ audio: mic, video: camera });
        return { audio: mic, video: camera };
    };

    useEffect(() => {
        checkPermissions();
    }, []);

    useEffect(() => {
        if (activeDevices.audio && audioDevice && audioDevice.deviceId != activeDevices.audio.deviceId) {
            console.log("MediaSource::audioDeviceChanged", audioDevice);

            setAudioError(null);
            resetError();
            if (mediaState.audioTrack && mediaState.audioTrack.readyState == "live") {
                stopAudio();
                if (audioDevice.deviceId) {
                    startAudio(audioDevice);
                }
            }
        }
        activeDevices.audio = audioDevice;
    }, [audioDevice]);

    useEffect(() => {
        if (activeDevices.video && videoDevice && videoDevice.deviceId != activeDevices.video.deviceId) {
            console.log("MediaSource::videoDeviceChanged", videoDevice);

            setVideoError(null);
            if (mediaState.videoTrack && mediaState.videoTrack.readyState == "live") {
                stopVideo();
                if (videoDevice.deviceId) {
                    startVideo(videoDevice);
                }
            }
        }
        activeDevices.video = videoDevice;
    }, [videoDevice]);

    useEffect(() => {
        let load = false;
        if (typeof permissions.video !== "undefined" && permissions.video !== null) {
            permissionsSettings.setItem("videoAllowed", permissions.video);
            if (permissions.video != lastPermissions.video) {
                load = true;
            }
        }
        if (typeof permissions.audio !== "undefined" && permissions.audio !== null) {
            permissionsSettings.setItem("audioAllowed", permissions.audio);
            if (permissions.audio != lastPermissions.audio) {
                load = true;
            }
        }
        lastPermissions.video = permissions.video;
        lastPermissions.audio = permissions.audio;

        if (load) {
            devices.loadAvailableDevices();
        }
    }, [permissions]);

    const setAudioEnabled = (enabled) => {
        console.log("set audio enabled", enabled, mediaState.restarting);

        mediaState.audioEnabled = enabled;
        setAudioError(null);
        if (!mediaState.restarting) {
            setLastUpdated(Date.now());
        }
    };

    const setVideoEnabled = (enabled) => {
        console.log("set video enabled", enabled, mediaState.restarting);

        mediaState.videoEnabled = enabled;
        setVideoError(null);
        if (!mediaState.restarting) {
            setLastUpdated(Date.now());
        }
    };

    const requestPermissions = () => {
        if (devices.availableDevices) {
            let constraints = { audio: false, video: false };
            if (devices.availableDevices.video && devices.availableDevices.video.length > 0) {
                constraints.video = true;
            }
            if (devices.availableDevices.audio && devices.availableDevices.audio.length > 0) {
                constraints.audio = true;
            }
            return navigator.mediaDevices
                .getUserMedia(constraints)
                .then(() => {
                    if (constraints.audio) {
                        setAudioAllowed(true);
                    }
                    if (constraints.video) {
                        setVideoAllowed(true);
                    }
                    return true;
                })
                .catch((err) => {
                    if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                        if (constraints.audio) {
                            setAudioAllowed(false);
                        }
                        if (constraints.video) {
                            setVideoAllowed(false);
                        }
                        return false;
                    }
                    return null;
                });
        } else {
            devices
                .loadAvailableDevices()
                .then(() => {
                    return requestPermissions();
                })
                .catch(() => {
                    return false;
                });
        }
    };

    const start = (d) => {
        console.log("MediaSource::start()", d);
        if (!d) {
            d = {};
        }
        if (!d.video) {
            d.video = activeDevices.video;
        }
        if (!d.audio) {
            d.audio = activeDevices.audio;
        }
        setVideoStatus(MEDIA_STATUS.INITIALIZING);
        setVideoError(null);
        setAudioStatus(MEDIA_STATUS.INITIALIZING);
        setAudioError(null);
        let constraints = { video: calculateConstraints(d.video), audio: calculateConstraints(d.audio) };

        if (mediaState.videoTrack) {
            mediaState.restarting = true;
            stopVideo();
        }
        if (mediaState.audioTrack) {
            mediaState.restarting = true;
            stopAudio();
        }
        console.log(constraints);
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then(onStream)
            .then((data) => {
                activeDevices.video = d.video;
                activeDevices.audio = d.audio;
                return data;
            })
            .catch((err) => {
                console.error(err.name);
                activeDevices.video = null;
                activeDevices.audio = null;

                if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                    setVideoStatus(MEDIA_STATUS.ERROR);
                    setAudioStatus(MEDIA_STATUS.ERROR);

                    setVideoError("You have denied camera permissions");
                    setPermissions({ audio: false, video: false });
                    return null;
                }
                if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
                    setVideoStatus(MEDIA_STATUS.ERROR);
                    setVideoError("Could not find device.");
                    setAudioStatus(MEDIA_STATUS.ERROR);
                    throw err;
                }

                if (constraints !== true && constraints !== "true") {
                    console.warn("Something went wrong, trying to start camera with default devices");
                    setVideoStatus(MEDIA_STATUS.NONE);
                    setAudioStatus(MEDIA_STATUS.NONE);
                    selectVideoDevice({ deviceId: true });
                    selectAudioDevice({ deviceId: true });

                    start({ video: { deviceId: true }, audio: { deviceId: true } });
                    return null;
                }
                setVideoStatus(MEDIA_STATUS.ERROR);
                setAudioStatus(MEDIA_STATUS.ERROR);

                setVideoError("Could not connect to device.");

                mediaState.videoError = ERROR.General.VIDEO;
            });
    };

    const startVideo = (d) => {
        console.log("MediaSource::startVideo", d, videoDevice, activeDevices.video);

        if (!d) {
            d = activeDevices.video;
        }
        setVideoStatus(MEDIA_STATUS.INITIALIZING);
        setVideoError(null);
        let constraints = { video: calculateConstraints(d) };

        if (mediaState.videoTrack) {
            mediaState.restarting = true;
            stopVideo();
        }
        console.log(constraints);
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then(onStream)
            .then((data) => {
                activeDevices.video = d;
                return data;
            })
            .catch((err) => {
                console.error(err.name);
                activeDevices.video = null;

                if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                    setVideoStatus(MEDIA_STATUS.ERROR);
                    setVideoError("You have denied camera permissions");
                    setVideoAllowed(false);

                    return null;
                }
                if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
                    setVideoStatus(MEDIA_STATUS.ERROR);
                    setVideoError("Could not find camera.");
                    throw err;
                }

                if (constraints !== true && constraints !== "true") {
                    console.warn("Something went wrong, trying to start camera with default devices");
                    setVideoStatus(MEDIA_STATUS.NONE);

                    selectVideoDevice({ deviceId: true });
                    startVideo({ deviceId: true });
                    return null;
                }
                setVideoStatus(MEDIA_STATUS.ERROR);
                setVideoError("Could not connect to camera.");

                mediaState.videoError = ERROR.General.VIDEO;
            });
    };

    const startAudio = (d) => {
        console.log("MediaSource::startAudio");
        if (!d) {
            d = activeDevices.audio;
        }
        setAudioStatus(MEDIA_STATUS.INITIALIZING);
        setAudioError(null);
        let constraints = { audio: calculateConstraints(d) };

        if (mediaState.audioTrack) {
            mediaState.restarting = true;
            stopAudio();
        }
        /*    if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
        }

        audioContext.current = new AudioContext();*/
        console.log(constraints);
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then(onStream)
            .then((data) => {
                activeDevices.audio = d;
                return data;
            })
            .catch((err) => {
                activeDevices.audio = null;

                console.error(err.name);
                if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                    setAudioStatus(MEDIA_STATUS.ERROR);
                    setAudioError("You have denied microphone permissions");
                    setAudioAllowed(false);

                    return null;
                }
                if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
                    setAudioStatus(MEDIA_STATUS.ERROR);
                    setAudioError("Could not find microphone.");
                    throw err;
                }

                if (constraints !== true && constraints !== "true") {
                    console.warn("Something went wrong, trying to start camera with default devices", err);
                    setAudioStatus(MEDIA_STATUS.NONE);

                    selectAudioDevice({ deviceId: true });
                    startAudio({ deviceId: true });

                    return null;
                }
                setAudioStatus(MEDIA_STATUS.ERROR);
                setAudioError("Could not connect to microphone.");

                mediaState.audioError = ERROR.General.AUDIO;
            });
    };
    const onStream = (stream) => {
        console.log("MediaSource::onStream", stream);
        let aTracks = stream.getAudioTracks();
        let allowed = {};
        if (aTracks && aTracks.length > 0) {
            // connect the AudioBufferSourceNode to the destination
            let availConstraints = aTracks[0].getCapabilities();

            console.log(aTracks[0]);
            let audioContraints = {};
            if (availConstraints.noiseSuppression && availConstraints.noiseSuppression[0]) {
                audioContraints.noiseSuppression = true;
            }
            if (availConstraints.echoCancellation && availConstraints.echoCancellation[0]) {
                audioContraints.echoCancellation = true;
            }
            if (availConstraints.autoGainControl && availConstraints.autoGainControl[0]) {
                audioContraints.autoGainControl = true;
            }
            aTracks[0].applyConstraints(audioContraints);

            for (let t of aTracks) {
                t.onended = (e) => {
                    onTrackEnded(e, t);
                };
                t.onmute = (e) => {
                    onTrackError(e, t);
                };
                t.onunmute = (e) => {
                    console.log("unmute", e, t);
                };
            }

            mediaState.audioError = null;
            mediaState.audioTrack = aTracks[0];
            mediaState.audioStream = stream;
            mediaState.audioEnabled = true;
            setAudioError(null);
            setAudioStatus(MEDIA_STATUS.ACTIVE);
            allowed.audio = true;
        }

        let vTracks = stream.getVideoTracks();

        if (vTracks && vTracks.length > 0) {
            let vConstraints = {
                frameRate: SETTINGS.VIDEO.FRAME_RATE,
                width: 375,
                height: (375 * 9) / 16,
                aspectRatio: SETTINGS.VIDEO.ASPECT_RATIO
            };

            vTracks[0].applyConstraints(vConstraints);

            for (let t of vTracks) {
                t.onmute = (e) => {
                    onTrackError(e, t);
                };
                t.onended = (e) => {
                    onTrackEnded(e, t);
                };
            }

            mediaState.videoTrack = vTracks[0];
            mediaState.videoEnabled = true;
            mediaState.videoStream = stream;
            mediaState.videoError = null;
            setVideoError(null);
            setVideoStatus(MEDIA_STATUS.ACTIVE);
            allowed.video = true;
        }
        /*  setPermissions((p) => {
            let newP = Object.assign({}, p);
            if (allowed.a) {
                newP.audio = true;
            }
            if(allowed.v) {
                newP.video = true;
            }

            return newP;
        });*/
        if ((lastPermissions.video != allowed.video && allowed.video) || (lastPermissions.audio != allowed.audio && allowed.audio)) {
            setPermissions((p) => Object.assign({}, p, allowed));
        }
        mediaState.restarting = false;
        setLastUpdated(Date.now());
    };

    const stopVideo = (system) => {
        console.log("stopVideo", mediaState.videoTrack, mediaState.videoStream);
        // mediaState.videoTrack ? mediaState.videoTrack.stop() : null;

        if (mediaState.videoTrack) {
            mediaState.videoTrack.onended = null;
            mediaState.videoTrack.onmute = null;
            mediaState.videoTrack.onunmute = null;
            mediaState.videoTrack.stop();
        }
        mediaState.videoTrack = null;
        mediaState.videoStream = null;
        if (!system) {
            mediaState.videoEnabled = false;
            activeDevices.video = null;
        }

        if (!mediaState.restarting) {
            setLastUpdated(Date.now());
            setVideoStatus(MEDIA_STATUS.NONE);

            if (!mediaState.audioTrack && !mediaState.audioError) {
                setAudioStatus(MEDIA_STATUS.NONE);
            }
        }
    };

    const stopAudio = (system) => {
        console.log("stopAudio", mediaState.audioTrack, mediaState.audioStream);
        //  mediaState.audioTrack ? mediaState.audioTrack.stop() : null;
        if (mediaState.audioTrack) {
            mediaState.audioTrack.onended = null;
            mediaState.audioTrack.onmute = null;
            mediaState.audioTrack.onunmute = null;
            mediaState.audioTrack.stop();
        }
        mediaState.audioTrack = null;
        mediaState.audioStream = null;
        if (!system) {
            mediaState.audioEnabled = false;

            activeDevices.audio = null;
        }
        if (!mediaState.restarting) {
            setAudioStatus(MEDIA_STATUS.NONE);
            setLastUpdated(Date.now());
            if (!mediaState.videoTrack && !mediaState.videoError) {
                setVideoStatus(MEDIA_STATUS.NONE);
            }
        }
        /*if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
        }*/
    };

    const stop = (system) => {
        stopAudio(system);
        stopVideo(system);
    };

    const onTrackEnded = (err, track) => {
        console.error("track ended", err, track);
        if (track.readyState != "live") {
            if (track.kind == "audio") {
                mediaState.audioError = ERROR.TrackEnded.AUDIO;
                setAudioError("Looking for your mic...");
                setAudioStatus(MEDIA_STATUS.ERROR);
                mediaState.audioEnabled = false;
            } else {
                mediaState.videoEnabled = false;

                mediaState.videoError = ERROR.TrackEnded.VIDEO;
                setVideoStatus(MEDIA_STATUS.ERROR);
                setVideoEnabled(false);
                setVideoError("Looking for your camera...");
            }
        }

        //  stop();
        //  start();
    };

    const onTrackError = (err, track) => {
        console.error("track error", err, track);
        if (track.readyState != "live") {
            if (track.kind == "audio") {
                mediaState.audioError = ERROR.TrackEnded.AUDIO;
                mediaState.audioEnabled = false;
                setAudioError("We lost your microphone.");
                setAudioStatus(MEDIA_STATUS.ERROR);
            } else {
                mediaState.videoEnabled = false;

                mediaState.videoError = ERROR.TrackEnded.VIDEO;
                setVideoError("We lost your camera.");
                setAudioStatus(MEDIA_STATUS.ERROR);
            }
        }
        // stop();
        //  start();
    };

    const calculateConstraints = (dev) => {
        if (!dev) {
            return true;
        }
        if (dev.deviceId === true) {
            return true;
        } else if (!dev.deviceId) {
            return false;
        } else {
            return { mandatory: { sourceId: dev.deviceId } };
        }
    };

    return {
        start,
        startVideo,
        startAudio,
        stop,
        stopAudio,
        stopVideo,
        setAudioEnabled,
        setVideoEnabled,
        setVideoStatus,
        setAudioStatus,
        status: {
            video: videoStatus,
            audio: audioStatus
        },
        lastUpdated,
        media,
        mediaState,
        devices,
        permissions,
        audioLevel,
        audioError,
        videoError,
        resetErrors,
        requestPermissions,
        checkPermissions
    };
};

export { useMediaSource, MEDIA_STATUS, DEVICE_COOKIE, ERROR };
