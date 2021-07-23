import { useEffect, useState } from "react";
import { useSettings } from "../Settings/Settings";
//import SpeakerIcon from "@material-ui/icons/Speaker";

export default function useDevices() {
    const settings = useSettings();
    const [availableDevices, setAvailableDevices] = useState(null);
    const [audioDevice, setAudioDevice] = useState(null);
    const [videoDevice, setVideoDevice] = useState(null);
    const [outputDevice, setOutputDevice] = useState(null);
    useEffect(() => {
        loadAvailableDevices();
        navigator.mediaDevices && navigator.mediaDevices.addEventListener("devicechange", loadAvailableDevices);
        return () => {
            navigator.mediaDevices && navigator.mediaDevices.removeEventListener("devicechange", loadAvailableDevices);
        };
    }, []);

    useEffect(() => {
        if (availableDevices) {
            let v = settings.getItem("media.device.video");
            let a = settings.getItem("media.device.audio");

            let o = settings.getItem("media.device.output");
            console.log(availableDevices, { v, a, o });

            if (availableDevices.video && availableDevices.video.length) {
                if (v && v.deviceId && availableDevices.video.find((d) => d.deviceId == v.deviceId)) {
                    console.log("found saved device in list", v);
                    setVideoDevice(availableDevices.video.find((d) => d.deviceId == v.deviceId));
                } else if (availableDevices.video.find((d) => d.deviceId == "default")) {
                    console.log("found default device in list", v);

                    setVideoDevice(availableDevices.video.find((d) => d.deviceId == "default"));
                } else {
                    console.log("found first device in list", v);

                    setVideoDevice(availableDevices.video[0]);
                }
            } else {
                setVideoDevice(null);
            }

            if (availableDevices.audio && availableDevices.audio.length) {
                if (a && a.deviceId && availableDevices.audio.find((d) => d.deviceId == a.deviceId)) {
                    setAudioDevice(availableDevices.audio.find((d) => d.deviceId == a.deviceId));
                } else if (availableDevices.audio.find((d) => d.deviceId == "default")) {
                    setAudioDevice(availableDevices.audio.find((d) => d.deviceId == "default"));
                } else {
                    setAudioDevice(availableDevices.audio[0]);
                }
            } else {
                setAudioDevice(null);
            }

            if (availableDevices.output && availableDevices.output.length) {
                if (o && o.deviceId && availableDevices.output.find((d) => d.deviceId == o.deviceId)) {
                    setOutputDevice(availableDevices.output.find((d) => d.deviceId == o.deviceId));
                } else if (availableDevices.output.find((d) => d.deviceId == "default")) {
                    setOutputDevice(availableDevices.output.find((d) => d.deviceId == "default"));
                } else {
                    setOutputDevice(null);
                }
            } else {
                setOutputDevice(null);
            }
        } else {
            loadAvailableDevices();
        }
    }, [availableDevices]);

    const selectAudioDevice = (id) => {
        let a = availableDevices.audio.find((d) => d.deviceId == id || d.label == id);
        if (a) {
            setAudioDevice(a);
        } else {
            setAudioDevice(null);
        }
    };

    const selectVideoDevice = (id) => {
        let v = availableDevices.video.find((d) => d.deviceId == id || d.label == id);

        if (v) {
            setVideoDevice(v);
        } else {
            setVideoDevice(null);
        }
    };

    const selectOutputDevice = (id) => {
        let o = availableDevices.output.find((d) => d.deviceId == id || d.label == id);
        if (o) {
            setOutputDevice(o);
        } else {
            setOutputDevice(null);
        }
    };

    useEffect(() => {
        if (audioDevice) {
            settings.setItem("media.device.audio", audioDevice);
        }
    }, [audioDevice]);

    useEffect(() => {
        if (outputDevice) {
            settings.setItem("media.device.output", outputDevice);
        }
    }, [outputDevice]);

    useEffect(() => {
        if (videoDevice) {
            console.log(videoDevice);
            settings.setItem("media.device.video", videoDevice);
        }
    }, [videoDevice]);

    const loadAvailableDevices = async (e) => {
        console.log(e);
        console.log("MediaSource::loadAvailableDevices");

        await settings.readAll();

        let foundDevices = {
            video: [],
            audio: [],
            output: []
        };
        let devs = navigator.mediaDevices ? await navigator.mediaDevices.enumerateDevices() : [];

        devs.forEach((device) => {
            if (device.kind == "videoinput") {
                foundDevices.video.push(device);
            } else if (device.kind == "audioinput") {
                foundDevices.audio.push(device);
            } else if (device.kind == "audiooutput") {
                foundDevices.output.push(device);
            }
        });
        setAvailableDevices(foundDevices);
    };

    return {
        audioDevice,
        videoDevice,
        outputDevice,
        selectAudioDevice,
        selectVideoDevice,
        selectOutputDevice,
        availableDevices,
        loadAvailableDevices
    };
}
