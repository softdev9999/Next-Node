import useBroadcastChannel from "../useBroadcastChannel/useBroadcastChannel";
import { useState, useEffect, useRef } from "react";
const useSidebarState = () => {
    const [state, setState] = useState();
    const lastState = useRef(null);
    const onMessage = useRef(({ name, state: newState }) => {
        console.log(name, newState);
        switch (name) {
            case "sidebarState": {
                if (typeof newState !== "undefined" && !areStatesEqual(newState, lastState.current)) {
                    setState(newState);
                }
                return;
            }
            case "connected": {
                sendState({ state: lastState.current });
                return;
            }
        }
    }).current;

    const { postMessage } = useBroadcastChannel({ name: "sidebar-web", onMessage });

    useEffect(() => {
        lastState.current = state;
    }, [state]);

    const sendState = ({ state: newState }) => {
        if (!areStatesEqual(newState, lastState.current)) {
            setState(newState);
        }
        postMessage({ name: "sidebarState", state: newState });
    };

    const sendMessage = (name, msg) => {
        postMessage(name, msg);
    };

    const areStatesEqual = (a, b) => {
        if (a && b) {
            if (a.roomId == b.roomId) {
                if (a.role == b.role) {
                    return true;
                }
            }
        } else if (!a && !b) {
            return true;
        }
        return false;
    };

    return { state, sendState, sendMessage };
};

export default useSidebarState;
