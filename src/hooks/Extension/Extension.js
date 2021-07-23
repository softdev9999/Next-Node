import React, { useContext, useEffect, useState, useRef } from "react";
import ExtensionMessagingClient from "./ExtensionMessagingClient";
import { useSettings } from "../Settings/Settings";
import config from "../../config";
const semver = require("semver");
import Cookies from "utils/Cookies";
import { getCountryByIP } from "utils/API";
import { useRouter } from "next/router";
import { trackEventAll } from "utils/Tracking";
import localforage from "localforage";
// minimum version for forced upgrade
const MIN_VERSION = "5.0.0";
const LATEST_VERSION = "5.0.0"; // WARNING: check hasUpdate checks if changing this!

//const OTHER_EXTENSION_IDS = ["lkhjgdkpibcepflmlgahofcmeagjmecc"];
//HELPER FUNCTIONS
const _useExtension = (isSidebar) => {
    const settings = useSettings();
    const [isExtensionInstalled, setIsExtensionInstalled] = useState(null);
    const [installing, setInstalling] = useState(false);
    const extensionInstalled = useRef(null);
    const windowCheckTimer = useRef(null);
    const router = useRouter();
    const [pendingRoomId, setPendingRoomId] = useState(null);
    const [extensionError, setExtensionError] = useState(null);
    const [finishedStart, setFinishedStart] = useState(false);
    const [version, setVersion] = useState(null);
    const [focused_, setFocused] = useState(false);
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const [hasUpdate, setHasUpdate] = useState(false);
    const [country, setCountry] = useState("United States");

    const [servicePermissions, setServicePermissions] = useState(new Set());
    const msgClient = useRef(new ExtensionMessagingClient("client")).current;
    const [supportedServices, setSupportedServices] = useState(["netflix"]);

    const checkServicePermissions = (serv) => {
        let permissionsToRequest = serv && config.SERVICE_LIST[serv] && config.SERVICE_LIST[serv].permissionList;

        if (permissionsToRequest) {
            return sendMessage("chrome", "background", {
                api: "permissions",
                fn: "contains",
                args: [
                    {
                        permissions: ["tabs"],
                        origins: permissionsToRequest
                    }
                ]
            }).then((res) => {
                console.log("*** permissions", permissionsToRequest, serv, res);
                if (res && serv) {
                    setServicePermissions((previousState) => new Set([...previousState, serv]));
                }
                return res;
            });
        } else {
            // assume that this service doesn't require permissions
            return Promise.resolve(serv && !!config.SERVICE_LIST[serv]);
        }
    };

    const requestServicePermissions = (serv) => {
        let permissionsToRequest = serv && config.SERVICE_LIST[serv] && config.SERVICE_LIST[serv].permissionList;

        if (permissionsToRequest) {
            return sendMessage("chrome", "background", {
                api: "permissions",
                fn: "request",
                args: [
                    {
                        permissions: ["tabs"],
                        origins: permissionsToRequest
                    }
                ]
            }).then((res) => {
                console.log("permissions", serv, res);
                if (res && serv) {
                    setServicePermissions((previousState) => new Set([...previousState, serv]));
                }
                return res;
            });
        } else {
            // assume that this service doesn't require permissions as its not in the config
            return Promise.resolve(serv && !!config.SERVICE_LIST[serv]);
        }
    };

    const versionSupported = (ver) => {
        // checks if the version supplied is <= the current version
        return semver.lte(ver, version);
    };

    const checkVersion = () => {
        if (typeof chrome !== "undefined" && chrome.runtime) {
            //console.log("check for extension", config.EXTENSION_ID);
            chrome.runtime.sendMessage(config.EXTENSION_ID, { name: "isInstalled", target: "background" }, (ver) => {
                //     console.log(ver);
                if (chrome.runtime.lastError || !ver || typeof ver !== "string") {
                    //  console.log(config.EXTENSION_ID, "not installed");
                    extensionInstalled.current = false;
                    setIsExtensionInstalled(false);
                } else if (typeof ver === "string") {
                    let versionToCheck = MIN_VERSION;
                    console.log(versionToCheck, LATEST_VERSION, ver);
                    let upgradeNeeded = semver.gt(versionToCheck, ver); //true
                    let hasUpgrade = semver.gt(LATEST_VERSION, ver); //true

                    //    console.log("*** VERSION ***", ver, upgradeNeeded);
                    //    console.log("found extension", config.EXTENSION_ID);
                    extensionInstalled.current = true;
                    setIsExtensionInstalled(true);
                    setVersion(ver);
                    if (upgradeNeeded) {
                        setNeedsUpdate(versionToCheck);
                    }
                    if (hasUpgrade) {
                        setHasUpdate(hasUpgrade);
                    }
                }
            });
        } else {
            setIsExtensionInstalled(false);
        }
    };

    const sendMessage = (name, target, data = {}) => {
        if (extensionInstalled.current) {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage(config.EXTENSION_ID, { name, target, ...data }, null, (resp) => {
                    resolve(resp);
                });
            });
        } else {
            console.log("extension not installed", { name });
            return Promise.resolve(true);
        }
    };

    const onMessage = ({ data }) => {
        const { name, error } = data;

        switch (name) {
            case "error": {
                if (error) {
                    setExtensionError(error);
                }
                break;
            }
            case "errorResolved": {
                if (error) {
                    setExtensionError(null);
                }
                break;
            }
            case "isInstalled": {
                checkVersion();
            }
        }
    };

    useEffect(() => {
        let unsubscribe = msgClient.addListener(onMessage);
        checkVersion();
        checkGeo();
        registerServices();
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        return () => {
            unsubscribe();
            clearInterval(windowCheckTimer.current);
            windowCheckTimer.current = null;
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    useEffect(() => {
        if (country !== "United States") {
            registerServices();
        }
    }, [country]);

    useEffect(() => {
        if (isExtensionInstalled) {
            //checkServicePermissions();
            setInstalling(false);
            if (document.location.hash.indexOf("installing") !== -1) {
                router.replace(router.route, document.location.pathname + "#installed", { shallow: true });
            }
        }
    }, [isExtensionInstalled]);

    const onBlur = () => {
        setFocused(false);
    };

    const onFocus = () => {
        setFocused(true);
        setInstalling(false);
        checkVersion();
    };

    const registerServices = () => {
        let services = [];
        let overrides = [];

        let so = Cookies.get("servicesOverride");

        if (so && so.length > 0) {
            overrides = so.split(",");
        } else {
            overrides = [];
        }

        //console.log("Registing services for: *" + country + "*");

        for (let k in config.SERVICE_LIST) {
            if (config.OFFICIAL_SERVICES[k]) {
                if (config.SERVICE_LIST[k].countryRestrict) {
                    if (config.SERVICE_LIST[k].countryRestrict.includes(country)) {
                        services.push(k);
                    } else {
                        //console.log("Country doesnt match service: ",config.SERVICE_LIST[k].countryRestrict);
                    }
                } else {
                    services.push(k);
                }
            } else {
                // override?
                if (overrides.includes(k)) {
                    services.push(k);
                }
            }
        }

        setSupportedServices(services);
    };

    const serviceSettingRequired = (serv) => {
        return serv && config.SERVICE_LIST[serv].promptStart && !settings.getItem("service." + serv);
    };

    const loginSettingRequired = (serv) => {
        let needsLogin = false;

        if (serv && settings && settings.ready) {
            let hasServSetting = settings.getItem("service." + serv);
            let hasLoginSetting = settings.getItem("login." + (hasServSetting ? hasServSetting : serv));

            if (config.SERVICE_LIST[serv].promptLogin) {
                needsLogin = !hasLoginSetting;
            }

            if (
                hasServSetting &&
                config.SERVICE_LIST[serv].promptStart &&
                config.SERVICE_LIST[serv].promptStart[hasServSetting] &&
                config.SERVICE_LIST[serv].promptStart[hasServSetting].promptLogin
            ) {
                needsLogin = !hasLoginSetting;
            }
        }

        return needsLogin;
    };

    const setServiceSetting = (serv, setting, login) => {
        if (login) {
            settings.setItem("login." + serv, true);
        } else {
            settings.setItem("service." + serv, setting);
        }
    };

    const execChromeAPI = (api, fn, ...args) => {
        return sendMessage("chrome", "background", {
            api,
            fn,
            args
        });
    };

    const openSidebar = (props) => {
        if (!props) {
            props = {};
        }
        let { service, serviceUrl, sidebarUrl } = props;

        if (needsUpdate) {
            router.push("/start");
            return Promise.resolve(false);
        } else if (service && !serviceUrl) {
            serviceUrl = config.getServiceStart(service, country);
        } else if (!serviceUrl) {
            serviceUrl = config.getStartUrl();
        }

        return sendMessage("openSidebar", "background", { serviceUrl, sidebarUrl });
    };

    const closeSidebar = () => {
        return sendMessage("closeSidebar", "background", {});
    };
    const openContentTab = (url) => {
        if (url) {
            if (typeof url === "string") {
                url = new URL(url);
            }
            return sendMessage("openContentTab", "background", { url: getCustomUrl(url).href });
        } else {
            return Promise.resolve(false);
        }
    };

    const getCustomUrl = (url) => {
        /*if (url && url.href && settings.getItem("hbosetting")) {
            url.href = url.href.replace(/(hbonow|hbogo|hbomax)/gi, settings.getItem("hbosetting"));
        }*/
        //url.search = "";
        //   console.log(url);
        return url;
    };

    const checkGeo = () => {
        getCountryByIP().then((result) => {
            setCountry(result);
            return result;
        });
    };

    const openChromeStore = () => {
        if (process.browser) {
            trackEventAll("AddToCart");

            setInstalling(true);
            router.replace(router.route, router.asPath.replace("#installing", "") + "#installing", { shallow: true });
            window.open(config.CHROMESTORE_URL, "ScenerChromeStore", "location=1,toolbar=0,menubar=0,status=0");
        }
    };

    const resetSidebar = () => {
        sendMessage("resetSidebar", "background", {});
    };

    const resetContent = () => {
        sendMessage("resetContent", "background", {});
    };

    return {
        isExtensionInstalled: isExtensionInstalled !== null ? isExtensionInstalled : settings.getItem("isExtensionInstalled"),
        error: extensionError,
        sendMessage,
        version,
        isSidebar,
        checkVersion,
        needsUpdate,
        openContentTab,
        hasUpdate,
        versionSupported,
        supportedServices,
        pendingRoomId,
        setPendingRoomId,
        finishedStart,
        setFinishedStart,
        openSidebar,
        closeSidebar,
        setExtensionError,
        servicePermissions,
        requestServicePermissions,
        checkServicePermissions,
        getCustomUrl,
        country,
        serviceSettingRequired,
        loginSettingRequired,
        setServiceSetting,
        openChromeStore,
        execChromeAPI,
        installing,
        resetSidebar,
        resetContent
    };
};

const ExtensionContext = React.createContext({});

const ExtensionProvider = ({ children, isSidebar = true }) => {
    let extension = _useExtension(isSidebar);
    return <ExtensionContext.Provider value={extension}>{children}</ExtensionContext.Provider>;
};

const useExtension = () => {
    return useContext(ExtensionContext);
};

export { ExtensionContext, ExtensionProvider, useExtension };
