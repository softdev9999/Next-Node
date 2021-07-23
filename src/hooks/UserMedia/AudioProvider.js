import React, { useContext, useState, useEffect} from "react";
const Audio = React.createContext(null);
const AudioContext = typeof window != "undefined" ? window.AudioContext || window.webkitAudioContext : () => {};
const AudioProvider = ({ children }) => {
    const [ctx, setCtx] = useState(null);
    useEffect(() => {
        setCtx(new AudioContext());
    }, []);

    const resumeContext = () => {
        if (ctx) {
            ctx.state != "running" && ctx.resume();
        } else {
            setCtx(new AudioContext());
        }
    };

    useEffect(() => {
        document.body.addEventListener("click", resumeContext);

        return () => {
            document.body.removeEventListener("click", resumeContext);
        };
    }, [ctx]);

    return <Audio.Provider value={ctx}>{children}</Audio.Provider>;
};

const useAudio = () => {
    return useContext(Audio);
};
export { useAudio, AudioProvider, Audio };
