import { BroadcastChannel, createLeaderElection } from "broadcast-channel";
import { useEffect, useState } from "react";

const useBroadcastChannel = ({ name, options, onMessage, useElector = false, electionOptions = {} }) => {
    const [channel, setChannel] = useState();
    const [isLeader, setIsLeader] = useState(false);

    const openChannel = () => {
        let opts = Object.assign({ webWorkerSupport: false }, options);
        let c = new BroadcastChannel(name, opts);
        return c;
    };

    useEffect(() => {
        return () => {
            setChannel(null);
        };
    }, []);

    useEffect(() => {
        if (name && process.browser && !channel) {
            let c = openChannel();
            if (useElector) {
                const elector = createLeaderElection(c);
                elector.awaitLeadership().then(onBecameLeader, electionOptions);
            }
            console.log("create channel");
            setChannel(c);
            /*return () => {
                setChannel(null);
            };*/
        }
    }, [name, options]);
    useEffect(() => {
        if (channel && onMessage) {
            channel.addEventListener("message", onMessage);
            console.log("add on message listener", channel);
            return () => {
                channel.removeEventListener("message", onMessage);
            };
        }
    }, [onMessage, channel]);

    const onBecameLeader = () => {
        setIsLeader(true);
    };

    const postMessage = (...args) => {
        try {
            let r = channel.postMessage(...args);
            return r;
        } catch (e) {
            console.log(e);
        }

        let c = openChannel();
        setChannel(c);
        return c.postMessage(...args);
    };

    return { channel, onMessage, name, isLeader, postMessage };
};

export default useBroadcastChannel;
