import { useContentState } from "hooks/ContentState/ContentState";
import { useEffect, useState, useRef, useContext } from "react";
import { useExtension } from "../Extension/Extension";
const SidebarWindowState = () => {
    const fullscreenCheckTimer = useRef(null);
    const [isSidebarFullscreen, setIsSidebarFullscreen] = useState(false);
    const { sendMessage, isExtensionInstalled } = useExtension();
    const { fullscreen: isContentFullscreen } = useContentState();
    useEffect(() => {
        window.addEventListener("resize", onResize);

        document.addEventListener("fullscreenchange", onFullscreenChange);
        onResize();
        fullscreenCheckTimer.current = setInterval(() => {
            if (isMaximized()) {
                setIsSidebarFullscreen(true);
            } else {
                setIsSidebarFullscreen(false);
            }
        }, 1000);

        return () => {
            window.removeEventListener("resize", onResize);

            document.removeEventListener("fullscreenchange", onFullscreenChange);
            window.onunhandledrejection = null;
            clearInterval(fullscreenCheckTimer.current);
            fullscreenCheckTimer.current = null;
        };
    }, []);

    useEffect(() => {
        console.log("iscOntentFullscreen", isContentFullscreen);
        console.log("issdibarfullscreen", isSidebarFullscreen);
        if (isExtensionInstalled) {
            if (!isContentFullscreen && isSidebarFullscreen) {
                //  window.moveTo(screen.width - 375, screen.availTop);
                //    window.resizeTo(375, screen.availHeight);
                sendMessage("resetContent", "background", {});

                sendMessage("resetSidebar", "background", {});
            } else {
                onResize();
            }
        }
    }, [isContentFullscreen, isSidebarFullscreen, isExtensionInstalled]);

    const isMaximized = useRef(() => {
        if (typeof window == "undefined" || typeof document == "undefined") {
            return false;
        }
        if (window.navigator.platform == "Win32") {
            return window.outerWidth && window.outerWidth >= screen.availWidth - 1;
        } else {
            return document.fullscreenElement || (!window.screenTop && !window.screenY);
        }
    }).current;

    const onFullscreenChange = (e) => {
        //     console.log(e, "fullscreenchange", document.fullscreenElement);
        setIsSidebarFullscreen(!!document.fullscreenElement);
    };

    const onResize = (e) => {
        // console.log(e, "resize", window.outerWidth, screen.width, screen.availWidth);
        //  let fs = false;
        if (isMaximized()) {
            setIsSidebarFullscreen(true);
            //fs = true;
        } else {
            setIsSidebarFullscreen(false);
        }

        // console.log("is sidebar fullscreen", fs);
    };
    return {
        isFullscreen: isSidebarFullscreen && isContentFullscreen,
        isContentFullscreen,
        isSidebarFullscreen
    };
};
const SidebarWindowStateContext = React.createContext({});

const SidebarWindowStateProvider = ({ children }) => {
    const sidebarState = SidebarWindowState();
    return <SidebarWindowStateContext.Provider value={sidebarState}>{children}</SidebarWindowStateContext.Provider>;
};

const useSidebarWindowState = () => {
    return useContext(SidebarWindowStateContext);
};

export { useSidebarWindowState, SidebarWindowStateProvider };
