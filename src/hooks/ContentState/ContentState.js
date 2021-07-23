import { useExtension } from "../Extension/Extension";

import { useState, useRef, useEffect, useContext } from "react";
import { useSettings } from "../Settings/Settings";
import config from "../../config";
import { getServiceNameFromUrl } from "utils/Browser";

const ContentState = () => {
    const settings = useSettings();

    const { sendMessage, isExtensionInstalled, openContentTab, country } = useExtension();

    const [playerState, setPlayerState] = useState({});

    const _playerState = useRef({});
    const [currentService, setCurrentService] = useState(null);
    const [currentServiceFormatted, setCurrentServiceFormatted] = useState(null);
    const [hasReceived, setHasReceived] = useState(false);
    const [isContentFullscreen, setIsContentFullscreen] = useState(null);
    const isNavigating = useRef(false);
    const [isContentWindowOpen, setIsContentWindowOpen] = useState(null);

    useEffect(() => {
        let fService = "";
        if (currentService) {
            fService = config.SERVICE_LIST[currentService]
                ? config.SERVICE_LIST[currentService].name
                : currentService.length <= 4
                ? currentService.toUpperCase()
                : currentService.charAt(0).toUpperCase() + currentService.slice(1);
        }
        setCurrentServiceFormatted(fService);
    }, [currentService]);

    useEffect(() => {
        isExtensionInstalled !== null && settings.setItem("isExtensionInstalled", isExtensionInstalled);
        console.log({ isExtensionInstalled });
        if (isExtensionInstalled) {
            let missedUpdates = 0;

            let t = setInterval(() => {
                checkContentWindow();
                sendMessage("getCurrentState", "content", { request: true }).then((msg) => {
                    //     console.log("** CURRENT MSG ***", msg);
                    if (msg && msg.state && msg.state.service) {
                        missedUpdates = 0;
                        if (msg.state.fullscreen) {
                            //      console.log("service is fullscreen");
                        } else {
                            ////console.log("not fullscreen");
                        }
                        msg.state.lastUpdated = Math.floor(Date.now() / 1000);

                        if (msg.state.parentLink) {
                            ////console.log("parentLink set", msg.state.parentLink);
                        }
                        if (msg.state.inCredits) {
                            ////console.log("inCredits set", msg.state.inCredits);
                        }
                        setHasReceived(true);
                        msg.state.url = new URL(msg.state.url);
                        //    console.log(msg.state);
                        setIsContentFullscreen(msg.state.fullscreen);

                        _playerState.current = msg.state;
                        setPlayerState(msg.state);

                        setCurrentService(msg.state.service);
                    } else {
                        missedUpdates += 1;
                        if (missedUpdates >= 3 || (msg && msg.error)) {
                            setPlayerState({});
                            setIsContentFullscreen(false);
                            setCurrentService(null);
                            _playerState.current = {};
                        }
                    }
                });
            }, 1000);

            return () => clearInterval(t);
        }
    }, [isExtensionInstalled]);

    const checkContentWindow = () => {
        chrome.runtime.sendMessage(config.EXTENSION_ID, { name: "isContentWindowOpen", target: "background" }, (isOpen) => {
            //    console.log("Content Window is open?", isOpen);
            setIsContentWindowOpen(isOpen);
        });
    };

    const play = () => {
        sendMessage("playVideo", "content");
        return waitForPlayOrPause(true);
    };
    const pause = () => {
        sendMessage("pauseVideo", "content");
        return waitForPlayOrPause(false);
    };

    const isContentWindowEmpty = (url) => {
        // checks whether the URL corresponds to a page that needs to be filled in
        if (url && url.pathname) {
            let s = getServiceNameFromUrl(url);

            if (s) {
                // loading URL is considered empty
                if (s == "scener") {
                    return !!url.pathname.match(/\/(?:finished|waiting|loading)/gi);
                } else {
                    return false;
                }
            }
        }

        return true;
    };

    const isInSetup = (url) => {
        /* checks whether this URL corresponds to a setup step */
        let s = getServiceNameFromUrl(url);

        if (s) {
            // loading URL is considered empty
            if (s == "scener") {
                return !!url.pathname.match(/\/(?:camera|permissions|service)/gi);
            } else {
                return false;
            }
        }
    };

    const shouldNavigate = (url, hostState, fromHost) => {
        //console.log("*** PLAYER STATE ***", url, playerState, _playerState);

        let shouldNavigateLocal = _playerState.current && typeof _playerState.current.navReady !== "undefined" ? _playerState.current.navReady : true;

        if (!shouldNavigateLocal) {
            // was there an error preventing navigation? If so, check if we need to suppress it
            let errorFound = (playerState && playerState.error) || (_playerState && _playerState.current && _playerState.current.error);

            // double check that this error hasnt been cleared
            if (errorFound) {
                console.log("** ERROR FOUND ***", errorFound, hostState);
                if (errorFound.indexOf("{{TITLE}}") !== -1 && (!hostState || !hostState.title)) {
                    /*
                this error is contigent ONLY IF the host is currently playing an actual title
                currently used in paywall situations where the error is no longer needed if the host navigates away from the show
                 TODO: find a better way to handle error suppression
                */
                    shouldNavigateLocal = true;
                } else return false; // dont navigate until error is resolved - likely a login problem
            }
        }

        if (url && isExtensionInstalled && shouldNavigateLocal) {
            return !isRestrictedUrl(url, fromHost);
        }
        return false;
    };

    const setCurrentTime = (time, threshold, timeout) => {
        sendMessage("setCurrentTime", "content", { value: time });
        return waitForSeek(time, threshold, timeout);
    };

    const isSimilarService = (url1, url2) => {
        // For future work where services have diff URLs, or services have similar catalogs that can work in parallel

        /* TODO: would love to have a concept where we catalog all the variations of the same show on different platforms
      and their corresponding play URLs into a single scener ID. In theory, we could then sync the show across multiple
      services, expanding each host's share and viewer numbers */

        if (url1.hostname == url2.hostname) {
            return true;
        } else {
            //console.log("** SIMILAR SERVICE? **", url1, url2, (getServiceNameFromUrl(url1) == getServiceNameFromUrl(url2)));
            return getServiceNameFromUrl(url1) == getServiceNameFromUrl(url2);
        }
    };

    const getServicePathFromUrl = (url1, serv) => {
        if (url1 && serv) {
            // remove any trailing slashes
            let path1 = url1.pathname.replace(/\/$/, "");

            if (config.SERVICE_LIST[serv].urlHash) {
                // this service (such as Alamo) relies on URL hashes, so we have to check them
                path1 = path1 + url1.hash;
            }

            if (config.SERVICE_LIST[serv].urlParams) {
                // this service (such as YouTube) relies on URL params, so we have to check them
                path1 = path1 + url1.search;
            }

            if (config.SERVICE_LIST[serv].pathCompareFilter) {
                // if the only difference in the paths is the pathCompareFilter, treat these as the same
                path1 = path1 && path1.replace(config.SERVICE_LIST[serv].pathCompareFilter, "");
            }

            if (config.SERVICE_LIST[serv].trackingParams) {
                // exclude tracking params from comparison, so make adjustments for dynamic variables
                let trackingMatch = new RegExp(config.SERVICE_LIST[serv].trackingParams.replaceAll(/{[a-zA-Z]+}/g, "[a-zA-Z0-9]+"));
                path1 = path1 && path1.replace(trackingMatch, "");

                //console.log("** PATH IS ***", path1, trackingMatch);
            }

            // remove any trailing special chars from orphan URL params
            path1 = path1.replace(/[&?]$/, "");

            return path1;
        }
    };


    const isSimilarUrl = (url1, url2) => {
        /* this helps prevent routing for URLs that are "technically" the same,
        but differ in unimportant ways, such as timestamps and hashes

        also prevents routing for URLs where the video CAN be synched, but are located in different
        hosts or paths (Disney vs Hotstar etc) */

        //console.log("URL compare: ", url1, url2);

        if (!isSimilarService(url1, url2)) {
            return false;
        }

        let serv = getServiceNameFromUrl(url1);

        let path1 = getServicePathFromUrl(url1, serv);
        let path2 = getServicePathFromUrl(url2, serv);

        return path1 == path2;
    };

    const hasExternalLogin = (url) => {
        /* this checks whether the url is an external SSO area, such as google auth, facebook, etc.
      We want to nav restrict these separately as they are special URLs that are outside the domain of the services. */

        let s = getServiceNameFromUrl(url);

        if (s && config.SERVICE_LIST[s].extLogin) {
            return true;
        }

        return false;
    };

    const isRestrictedUrl = (url, fromHost) => {
        // check if this URL is restricted

        let isRestricted = false;

        let s = getServiceNameFromUrl(url);

        if (s) {
            let comparePath = getServicePathFromUrl(url, s);

            let navRestrictRegex = config.SERVICE_LIST[s].navRestrict;
            let navRestrictRegexHost = fromHost && config.SERVICE_LIST[s].navRestrictHost;
            let navRestrictRegexGuest = !fromHost && config.SERVICE_LIST[s].navRestrictGuest;

            if (comparePath && comparePath != "/") {
                if (navRestrictRegex) {
                    //   console.log("** navRestrict check (general)", comparePath, navRestrictRegex, !comparePath.match(navRestrictRegex));
                    isRestricted = !comparePath.match(navRestrictRegex);
                }
                if (navRestrictRegexHost && !isRestricted) {
                    //    console.log("** navRestrictHost check");
                    isRestricted = !comparePath.match(navRestrictRegexHost);
                }
                if (navRestrictRegexGuest && !isRestricted) {
                    isRestricted = !comparePath.match(navRestrictRegexGuest);
                }
            }
        }

        return isRestricted;
    };

    const shouldNavigateBetween = (hostState, localState) => {
        let url1 = hostState.url;
        let url2 = localState.url;

        //   console.log("** NAV BETWEEN **", url1.pathname, url2.pathname);

        if (url1 && url2) {
            if (isInSetup(url2)) {
                return false;
            } else if (isSimilarUrl(url1, url2)) {
                return false;
            } else {
                return !isSimilarService(url1, url2) || (shouldNavigate(url1, hostState, true) && shouldNavigate(url2, hostState));
            }
        } else {
            if (url1 && localState && localState.url == null && localState.navReady == null) {
                /* We didn't get the URL of the guest. This is likely because they are on a page
              That isn't injectable, and thus we won't be able to know where it is.

              It could also be that the window is closed or in the process or loading initially, so
              we have to be careful about making routing decisions here.

              Normally, we automatically route the user in this case, but some services (YouTube, Vimeo)
              take the user to an external site to login, so we have to "assume" thats where the user is
              when we don't know.
              */
                //console.log("** local URL missing **", isContentWindowOpen, localState);
                if (hasExternalLogin(url1)) {
                    /* TODO: This still needs work */
                    //return false;
                }
            }
        }

        return shouldNavigate(url1, hostState);
    };

    const addTrackingParams = (url, serv, roomData) => {

      if (serv && config.SERVICE_LIST[serv].trackingParams) {
        let trackingString = config.SERVICE_LIST[serv].trackingParams;

        if (roomData && roomData.id) {
          trackingString.replace("{ROOMID}", roomData.id);
        }
        if (roomData && roomData.type) {
          trackingString.replace("{ROOMTYPE}", roomData.type);
        }

        // if any placeholder params are still there (we didnt get a roomID), skip the tracking params as they will just cause issues
        if (!trackingString.includes("{ROOMID}")) {
          url.href = url.href + (url.search ? "&" : "?") + trackingString;
        }

      }

      return url;
    };

    const getConvertedUrlForService = (url, serv) => {
        let converted = url;
        let newUrl = converted.href;

        if (serv && config.SERVICE_LIST[serv].startConverter) {
            let serviceSetting = settings.getItem("service." + serv);
            newUrl = newUrl.replace(config.SERVICE_LIST[serv].startConverter, config.getServiceStart(serv, country, serviceSetting));
            converted = new URL(newUrl);

            // console.log(" *** START CONVERTer ***", config.SERVICE_LIST[serv].startConverter, config.getServiceStart(serv, country, serviceSetting), newUrl);
        } else if (serv && config.SERVICE_LIST[serv].hostConverter) {
            let serviceSetting = settings.getItem("service." + serv);
            //serviceSetting = "showtimeanytime";

            console.log("*** CONV URL ***", url, newUrl);

            let startUrl = new URL(config.getServiceStart(serv, country, serviceSetting));
            newUrl = newUrl.replace(config.SERVICE_LIST[serv].hostConverter, startUrl.hostname);

            converted = new URL(newUrl);
        }

        /*if (serv && config.SERVICE_LIST[serv].trackingParams) {

        }*/

        return converted;
    };


    const navigate = (url) => {
        let serv = getServiceNameFromUrl(url);
        let finalURL = getConvertedUrlForService(url, serv);

        openContentTab(finalURL);
        isNavigating.current = true;

        let path = finalURL.pathname;

        if (serv) {
            path = getServicePathFromUrl(finalURL, serv);
        }

        return waitForNavigation(new RegExp(path));
    };

    const waitForNavigation = (regex, timeout = 5000) => {
        ////console.log(regex, timeout, playerState.url);
        return new Promise((resolve, reject) => {
            if (playerState.url?.href.match(regex)) {
                isNavigating.current = false;

                resolve(playerState.url);
                return;
            }
            let i = 0;
            let t = setInterval(() => {
                if (_playerState.current.url?.href.match(regex)) {
                    isNavigating.current = false;
                    ////console.log("navigated", _playerState.current.url, regex);

                    resolve(_playerState.current.url);
                    clearInterval(t);

                    return;
                }
                i++;
                if (i > timeout / 200) {
                    isNavigating.current = false;
                    //        console.error("failed to navigate", _playerState.current.url, regex);
                    reject("timeout on navigation");
                    clearInterval(t);
                    return;
                }
            }, 200);
        });
    };

    const waitForSeek = (targetTime, threshold = 3000, timeout = 3000) => {
        return new Promise((resolve, reject) => {
            if (Math.abs(_playerState.current.currentTime - targetTime) < threshold) {
                resolve(_playerState.current.currentTime);
                return;
            }
            let i = 0;
            let t = setInterval(() => {
                if (Math.abs(_playerState.current.currentTime - targetTime) < threshold) {
                    resolve(_playerState.current.currentTime);
                    return;
                }
                i++;
                if (i > timeout / 100) {
                    reject("seek timeout ", _playerState, targetTime);
                    clearInterval(t);
                    return;
                }
            }, 100);
        });
    };

    const waitForPlayOrPause = (shouldBePlaying, timeout = 2000) => {
        return new Promise((resolve, reject) => {
            /*if (_playerState.current.playing == shouldBePlaying) {
                resolve(_playerState.current.playing);
                return;
            }
            let i = 0;
            let t = setInterval(() => {
                if (_playerState.current.playing == shouldBePlaying) {
                    clearInterval(t);
                    resolve(_playerState.current.playing);
                    return;
                }
                i++;
                if (i > timeout / 100) {
                    reject("timeout on play or pause ", _playerState, shouldBePlaying);
                    clearInterval(t);
                    return;
                }
            }, 100);*/
            resolve(true);
        });
    };

    const clearState = () => {
        setPlayerState({});
        _playerState.current = {};
    };
    return {
        currentService,
        isContentWindowOpen,
        currentServiceFormatted,
        navigate,
        shouldNavigateBetween,
        isContentWindowEmpty,
        clearState,
        fullscreen: isContentFullscreen,
        play,
        pause,
        setCurrentTime,
        player: {
            hasReceived,
            currentTime: typeof playerState.currentTime == "number" ? playerState.currentTime : null,
            url: playerState.url || null,
            playing: playerState.playing,
            title: playerState.title || null,
            videoId: playerState.videoId || null,
            subtitle: playerState.subtitle || null,
            metadata: playerState.metadata || null,
            lastUpdated: playerState.lastUpdated,
            error: playerState.error || null,
            navReady: playerState.navReady || null,
            service: playerState.service || null,
            duration: typeof playerState.duration == "number" ? playerState.duration : null,
            parentLink: playerState.parentLink || null,
            loading: currentService == null || playerState.url == null,
            videoType: playerState.videoType || null,
            isLive: playerState.isLive || null,
            pay: playerState.pay || null,
            inCredits: playerState.inCredits || null,
            _state: _playerState.current
        }
    };
};

const ContentContext = React.createContext({});

const ContentStateProvider = ({ children }) => {
    const cState = ContentState();
    return <ContentContext.Provider value={cState}>{children}</ContentContext.Provider>;
};

const useContentState = () => {
    return useContext(ContentContext);
};

export { useContentState, ContentStateProvider, ContentContext };
