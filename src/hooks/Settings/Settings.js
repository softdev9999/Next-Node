import React from "react";
import localForage from "localforage";
import { useRef, useState, useEffect, useContext } from "react";
import throttle from "lodash/throttle";
const prefix = "scener"; //SCENER_ENV == "prod" ? "scener" : "scener-" + SCENER_ENV;
const Settings = (suffix = "settings") => {
    const settings = useRef({}).current;
    const syncPromise = useRef(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        readAll().then((d) => {
            if (d) {
                console.log(d);
                for (let k in d) {
                    settings[k] = d[k];
                }
            }
            setReady(true);
        });
    }, []);

    const clear = () => {
        for (let k in settings) {
            delete settings[k];
        }
        return localForage.removeItem(prefix + "@" + suffix);
    };

    const setItem = (key, value) => {
        if (ready) {
            try {
                settings[key] = JSON.parse(JSON.stringify(value));
                return writeAll();
            } catch (e) {
                return;
            }
        }
    };
    const getItem = (key) => {
        if (settings[key]) {
            return settings[key];
        }
        return null;
    };

    const readAll = () => {
        console.log("read all");
        if (!syncPromise.current) {
            syncPromise.current = localForage
                .getItem(prefix + "@" + suffix)

                .then((d) => {
                    if (d) {
                        console.log(d);
                        for (let k in d) {
                            settings[k] = d[k];
                        }
                    }
                    syncPromise.current = null;
                    return d;
                })
                .catch(() => {
                    syncPromise.current = null;
                    return {};
                });
        }
        return syncPromise.current;
    };

    const _writeAll = () => {
        if (!syncPromise.current) {
            syncPromise.current = localForage
                .setItem(prefix + "@" + suffix, settings)
                .then(() => {
                    syncPromise.current = null;
                })
                .catch(() => {
                    syncPromise.current = null;
                });
        }
        return syncPromise.current;
    };

    const writeAll = throttle(_writeAll, 300);

    return { ready, setItem, getItem, clear, readAll, writeAll };
};

const SettingsContext = React.createContext(null);

const useSettings = () => {
    return useContext(SettingsContext);
};

const SettingsProvider = ({ children, suffix }) => {
    const settings = Settings(suffix);
    return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export { useSettings, SettingsProvider, SettingsContext, Settings };
