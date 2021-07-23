import React, { useContext, useEffect } from "react";
import { useAuthState } from "../AuthState/AuthState";
import { useWindowDimensions } from "utils/Browser";
import useSidebarState from "../SidebarState/SidebarState";
import usePopups from "../Popups/usePopups";
const IGNORED_ERRORS = ["request was interrupted by a new load request", "Access forbidden for identity"];
function GlobalAppState() {
    const auth = useAuthState();
    const dimensions = useWindowDimensions();
    const sidebar = useSidebarState();
    const popups = usePopups();
    useEffect(() => {
        if (process.browser) {
            window.addEventListener("error", onError);

            window.onunhandledrejection = onError;
            return () => {
                window.removeEventListener("error", onError);
                window.onunhandledrejection = null;
            };
        }
    }, []);

    const onError = (err) => {
        if (err.error) {
            err = err.error;
        }
        console.trace("unhandled", err);
        let msg = err.reason ? err.reason.message : err.message;

        let shouldIgnore = false;
        for (let ignore of IGNORED_ERRORS) {
            if (msg && msg.indexOf(ignore) != -1) {
                shouldIgnore = true;
            }
        }
        if (!shouldIgnore) {
            if (process.browser) {
                // only dispatch the errors we may need to surface for a reload
                //    window.dispatchEvent(new Event('scenererror'));
            }
        }
    };

    return {
        auth: auth || {},
        sidebar,
        dimensions,
        popups
    };
}

const GlobalAppContext = React.createContext({});

function GlobalAppStateProvider({ children }) {
    const state = GlobalAppState();

    return <GlobalAppContext.Provider value={state}>{children}</GlobalAppContext.Provider>;
}

function useApp() {
    return useContext(GlobalAppContext);
}

export { GlobalAppStateProvider, useApp };
