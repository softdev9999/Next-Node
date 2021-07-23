import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@material-ui/core";
import config from "../config";

export const isChrome = () => {
    if (typeof window == "undefined" || typeof navigator == "undefined") {
        return true;
    }
    let userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

    return !isMobile() && userAgent.indexOf("chrome") != -1 && userAgent.indexOf("edge") == -1;
};
export const isMac = () => {
    if (typeof window == "undefined" || typeof navigator == "undefined") {
        return false;
    }
    let userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
    return userAgent.indexOf("mac") != -1;
};

export const isMobile = () => {
    if (typeof window == "undefined") {
        return false;
    }
    return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
};

export const useBreakpoint = (fn) => {
    const theme = useTheme();
    if (typeof fn == "string") {
        fn = theme.breakpoints[fn];
    }
    if (!fn) {
        fn = theme.breakpoints.only;
    }
    const isXs = useMediaQuery(fn("xs"));
    const isSm = useMediaQuery(fn("sm"));

    const isMd = useMediaQuery(fn("md"));

    const isLg = useMediaQuery(fn("lg"));

    const isXl = useMediaQuery(fn("xl"));
    const [currentBreakpoint, setCurrentBreakpoint] = useState("xs");
    useEffect(() => {
        if (isXl) {
            setCurrentBreakpoint("xl");
            return;
        }
        if (isLg) {
            setCurrentBreakpoint("lg");
            return;
        }
        if (isMd) {
            setCurrentBreakpoint("md");
            return;
        }
        if (isSm) {
            setCurrentBreakpoint("sm");
            return;
        }

        setCurrentBreakpoint("xs");
    }, [isXs, isSm, isMd, isLg, isXl]);
    return currentBreakpoint;
};

export const getServiceNameFromUrl = (url) => {
    let checkURL = url;

    if (checkURL && typeof checkURL == "string") {
        try {
            checkURL = new URL(checkURL);
        } catch (e) {
            // invalid URL
            checkURL = null;
        }
    }

    if (checkURL) {
        let host = checkURL.hostname;
        if (host) {
            for (let k in config.SERVICE_LIST) {
                let hostRegex = config.SERVICE_LIST[k].host;
                if (host.match(hostRegex)) {
                    return k;
                }
            }
        }
    }
    return null;
};

export const addTrackingParams = (url, serv, roomData) => {

  if (serv && config.SERVICE_LIST[serv].trackingParams) {
    let trackingString = config.SERVICE_LIST[serv].trackingParams;

    if (roomData && roomData.id) {
      trackingString.replace("{ROOMID}", roomData.id);
    }
    if (roomData && roomData.id) {
      trackingString.replace("{ROOMTYPE}", roomData.type);
    }

    url.href = url.href + (url.search ? "&" : "?") + trackingString;
  }

  return url;
};

export const convertPlayURL = (url, verifyService) => {
    // converts URLs (custom) into optimized playback locations

    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = "https://" + url;
    }

    if (url && url.indexOf("://youtu.be/") != -1) {
        // transform any YouTube share URL formats
        //https://youtu.be/tqIGGlxUkIo => /watch?v=x

        let ytURL = new URL(url);
        let ylistID = ytURL.searchParams.get("list");
        url = "https://youtube.com/watch?v=" + ytURL.pathname.replace("/", "") + (ylistID ? "&list=" + ylistID : "");
    }

    if (url && url.indexOf("youtube.com/watch") != -1) {
        let ytEmbedURL = new URL(url);
        let videoID = ytEmbedURL.searchParams.get("v");
        let listID = ytEmbedURL.searchParams.get("list");
        if (videoID) {
            // now, convert any YouTube URLs to their embedded counterparts
            url = "https://www.youtube.com/embed/" + videoID + "?autoplay=1" + (listID ? "&list=" + listID : "");
        }
    }

    if (url && url.indexOf("vimeo.com/") != -1) {
        let vimeourl = new URL(url);
        let vimeoID = null;

        let idRegex = /^\/(video\/)?([0-9]+)/;
        let matches = vimeourl.pathname.match(idRegex);
        //console.log('*** VIDEO ID MATCH ***', matches);
        if (matches) {
            vimeoID = matches[matches.length - 1];
        }

        if (vimeoID) {
            // now, convert any Vimeo URLs to their embedded counterparts
            url = "https://player.vimeo.com/video/" + vimeoID + "?autoplay=1&transparent=0";
        }
    }

    if (verifyService) {
        // check that URL matches service URL patterns first

        if (!getServiceNameFromUrl(url)) {
            return false;
        }
    }

    return url;
};

export const useWindowDimensions = () => {
    const [innerHeight, setInnerHeight] = useState(0);
    const [innerWidth, setInnerWidth] = useState(0);
    const [outerWidth, setOuterWidth] = useState(0);
    const [outerHeight, setOuterHeight] = useState(0);
    const [isLandscape, setIsLandscape] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            onResize();
            window.addEventListener("resize", onResize);
            return () => {
                window.removeEventListener("resize", onResize);
            };
        }
    }, []);

    const onResize = () => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        setOuterHeight(window.outerHeight);
        setOuterWidth(window.outerWidth);
        setIsLandscape(window.innerWidth > window.innerHeight);
    };

    return { innerHeight, innerWidth, outerHeight, outerWidth, isLandscape };
};

export const getDefaultSidebarWidth = () => {
    if (typeof screen != "undefined") {
        const sidebarMaxDefaultWidth = 375;
        const sidebarDefaultWidth = Math.round(screen.width / 5);
        const sidebarWidth = Math.min(sidebarMaxDefaultWidth, sidebarDefaultWidth);
        return sidebarWidth;
    } else {
        return 375;
    }
};
