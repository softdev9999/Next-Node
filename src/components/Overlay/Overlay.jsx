import React, { useRef, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useState } from "react";
import { useContext } from "react";
const OverlayContext = React.createContext({});
const Overlay = ({ timeout = 4000, children, style, disabled }) => {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const overlayTimeout = useRef(null);
    useEffect(() => {
        showOverlay();
        () => {
            clearTimeout(overlayTimeout.current);
        };
    }, []);

    const showOverlay = () => {
        if (!disabled) {
            if (overlayTimeout.current) {
                clearTimeout(overlayTimeout.current);
                overlayTimeout.current = null;
            }
            setOverlayVisible(true);
            overlayTimeout.current = setTimeout(() => {
                hideOverlay();
            }, timeout);
        }
    };

    const hideOverlay = () => {
        if (!disabled) {
            if (overlayTimeout.current) {
                clearTimeout(overlayTimeout.current);
                overlayTimeout.current = null;
            }
            setOverlayVisible(false);
        }
    };

    return (
        <div onMouseOver={showOverlay} onMouseOut={hideOverlay} onMouseMove={showOverlay} style={style}>
            <OverlayContext.Provider value={overlayVisible}>{children}</OverlayContext.Provider>
        </div>
    );
};

const useOverlay = () => {
    return useContext(OverlayContext);
};

const ShowOnHover = ({ children, style, ...others }) => {
    const visible = useOverlay();
    const theme = useTheme();
    return (
        <div {...others} style={{ ...style, opacity: visible ? 1 : 0, transition: theme.transitions.create("opacity") }}>
            {children}
        </div>
    );
};

export { Overlay, useOverlay, OverlayContext, ShowOnHover };
