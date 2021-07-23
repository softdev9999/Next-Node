import { useEffect, useState, useRef } from "react";
import { useAudio } from "./AudioProvider";
import throttle from "lodash/throttle";
const useAudioProcessor = ({ stream, enabled, output, pan, volume, muted }) => {
    const audioCtx = useAudio();
    const [audioLevel, setAudioLevel] = useState(0);
    const lastAudioLevel = useRef(0);
    const [error, setError] = useState(null);
    const hasError = useRef(false);
    const updateAudioLevel = throttle(setAudioLevel, 100);
    const lastFiveSecondsVolume = useRef([]).current;
    const lastFiveTimer = useRef();
    const nodes = useRef({}).current;
    const [ready, setReady] = useState(false);
    const outputStream = useRef(null);
    const streamRef = useRef(null);
    const enabledRef = useRef(enabled);
    const startSignalCheck_ = () => {
        stopSignalCheck();
        console.log("Audio::startSignalCheck");

        lastFiveTimer.current = setTimeout(() => {
            checkSignal();
        }, 1000);
    };
    const stopSignalCheck = () => {
        console.log("Audio::stopSignalCheck");
        clearTimeout(lastFiveTimer.current);
        lastFiveTimer.current = null;
    };

    const resetError = () => {
        setError(null);
        hasError.current = false;
        stopSignalCheck();
        while (lastFiveSecondsVolume.length) {
            lastFiveSecondsVolume.pop();
        }
    };

    const checkSignal = () => {
        console.log("Audio::checkSignal", muted, volume, lastAudioLevel.current);
        if (!hasError.current && streamRef.current && enabledRef.current) {
            if (muted || volume == 0) {
                while (lastFiveSecondsVolume.length) {
                    lastFiveSecondsVolume.pop();
                }
                setError(null);

                hasError.current = false;
                stopSignalCheck();
            } else {
                lastFiveSecondsVolume.push(lastAudioLevel.current);
                if (lastFiveSecondsVolume.length >= 5) {
                    while (lastFiveSecondsVolume.length > 5) {
                        lastFiveSecondsVolume.shift();
                    }
                    console.log(
                        lastFiveSecondsVolume,
                        lastFiveSecondsVolume.reduce((prev, v) => prev + v, 0)
                    );

                    let avg = lastFiveSecondsVolume.reduce((prev, v) => prev + v, 0) / lastFiveSecondsVolume.length;
                    if (avg == 0) {
                        hasError.current = true;
                        setError("We're not getting any audio. Try a different device.");
                        stopSignalCheck();
                        return;
                    } else {
                        hasError.current = false;
                        setError(null);
                        stopSignalCheck();
                        return;
                    }
                }
                lastFiveTimer.current = setTimeout(() => {
                    checkSignal();
                }, 1000);
            }
        }
    };

    useEffect(() => {
        return () => {
            stopSignalCheck();
            streamRef.current = null;
            console.log("disconnect audio graph");
            for (let i in nodes) {
                nodes[i] && nodes[i].disconnect();
                delete nodes[i];
            }
        };
    }, []);

    useEffect(() => {
        if (audioCtx && !ready) {
            initAudio();
        }
    }, [audioCtx, ready]);

    useEffect(() => {
        if (audioCtx && stream && ready) {
            connectSource();
            streamRef.current = stream;
        }
    }, [audioCtx, stream, ready]);

    useEffect(() => {
        console.log(enabled);
        if (hasError.current && !enabled) {
            resetError();
        }
        enabledRef.current = !!enabled;
        if (!enabled) {
            setAudioLevel(0);
        }
    }, [enabled]);

    useEffect(() => {
        if (audioCtx && ready) {
            if (nodes.panner) {
                if (output === true) {
                    //    nodes.panner.disconnect();
                    //    nodes.panner.connect(audioCtx.destination);
                } else if (output) {
                    //   nodes.panner.disconnect();
                    //    nodes.panner.connect(output);
                } else {
                    //  nodes.panner.disconnect();
                    // nodes.output = audioCtx.createMediaStreamDestination();
                    //  nodes.panner.connect(nodes.output);
                    //  outputStream.current = nodes.output.stream;
                }
            }
        }
    }, [audioCtx, output, ready]);

    useEffect(() => {
        if (audioCtx && ready && nodes.gain) {
            let multiplier = muted ? 0 : 1;
            nodes.gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)) * multiplier, audioCtx.currentTime);
        }
    }, [ready, volume, audioCtx, muted]);
    useEffect(() => {
        if (audioCtx && ready && nodes.panner && nodes.panner.pan) {
            nodes.panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), audioCtx.currentTime);
        }
    }, [ready, pan, audioCtx]);

    const connectSource = () => {
        console.log("connect stream", { stream, audioCtx });
        if (stream && audioCtx && stream.getAudioTracks().length > 0) {
            if (nodes.src) {
                nodes.src.disconnect();
                delete nodes.src;
            }

            nodes.src = audioCtx.createMediaStreamSource(stream);

            console.log("connecting media stream to audio context", nodes);

            /*      if (nodes.gain) {
                nodes.src.connect(nodes.gain);
            }*/
            if (nodes.analyser) {
                nodes.src.connect(nodes.analyser);
            }
        }
    };

    const initAudio = () => {
        console.log("init audio", { audioCtx });
        if (!nodes.analyser) {
            nodes.analyser = audioCtx.createAnalyser();

            nodes.analyser.smoothingTimeConstant = 0.5;
            nodes.analyser.fftSize = 1024;

            nodes.javascriptNode = audioCtx.createScriptProcessor(0, 1, 1);
            nodes.javascriptNode.onaudioprocess = () => {
                if (nodes.analyser && enabledRef.current) {
                    let array = new Uint8Array(nodes.analyser.frequencyBinCount);
                    nodes.analyser.getByteFrequencyData(array);
                    // let values = 0;

                    let length = array.length;
                    let max = 0;
                    for (let i = 0; i < length; i++) {
                        //    values += array[i];
                        if (array[i] > max) {
                            max = array[i];
                        }
                    }
                    let m = nodes.gain ? nodes.gain.gain.value : 1;
                    lastAudioLevel.current = max / 255;
                    updateAudioLevel((m * max) / 255);

                    /*  if (!lastFiveTimer.current && max == 0) {
                        startSignalCheck();
                    } else if (max > 0 && hasError.current) {
                        resetError();
                    }*/
                }
            };
            nodes.silencer = audioCtx.createGain();
            nodes.silencer.gain.setValueAtTime(0, audioCtx.currentTime);
            try {
                nodes.analyser &&
                    nodes.analyser.connect &&
                    nodes.javascriptNode &&
                    nodes.analyser.connect(nodes.javascriptNode).connect(nodes.silencer).connect(audioCtx.createMediaStreamDestination());
            } catch (e) {
                //probably an older mobile device or browser
            }
        }
        /*  if (!nodes.gain) {
            nodes.gain = audioCtx.createGain();
        }
        if (!nodes.panner) {
            if (audioCtx.createStereoPanner) {
                nodes.panner = audioCtx.createStereoPanner();
                nodes.panner.pan.setValueAtTime(0, audioCtx.currentTime);
            } else {
                nodes.panner = audioCtx.createGain();
                nodes.panner.gain.setValueAtTime(1, audioCtx.currentTime);
            }
        }

        nodes.gain && nodes.gain.gain.setValueAtTime(0, audioCtx.currentTime);
        nodes.panner && nodes.gain.connect(nodes.panner);
*/
        nodes.src && nodes.src.connect(nodes.analyser);
        //    nodes.src && nodes.src.connect(nodes.gain);

        console.log("nodes", nodes);
        setReady(true);
    };

    return { ready, audioLevel, outputStream: outputStream.current, error, resetError };
};
export default useAudioProcessor;
