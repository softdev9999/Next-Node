import React, { useEffect, useState, Fragment } from "react";
import { Button, Typography, withStyles, MenuItem, MenuList, Grid, TextField, Tooltip, IconButton } from "@material-ui/core";

import ServiceIcon from "../Icon/ServiceIcon";
import { useExtension } from "hooks/Extension/Extension";
import { useSettings } from "hooks/Settings/Settings";
import { useCurrentRoom } from "hooks/Room/Room";
import { convertPlayURL, getServiceNameFromUrl } from "utils/Browser";

import SettingsIcon from "@material-ui/icons/Settings";

import config from "../../config";
import NavPopup from "../NavPopup/NavPopup";

const SelectServicePopup = ({ classes, visible, onDismiss, anchorEl }) => {
    //    const theme = useTheme();
    const { supportedServices, isExtensionInstalled, checkServicePermissions, serviceSettingRequired, loginSettingRequired } = useExtension();
    const [customURL, setCustomURL] = useState("");
    const [error, setError] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const {
        room: {
            id: roomId,
            type: roomType,
        }
    } = useCurrentRoom();


    const settings = useSettings();

    const onCustomChosen = async (url) => {
        let playURL = convertPlayURL(url, true);

        if (playURL) {
            let serv = getServiceNameFromUrl(playURL);
            let allowed = await checkServicePermissions(serv);

            if (serv) {
                if (allowed && !loginSettingRequired(serv)) {
                    setShowCustom(false);
                    setCustomURL("");
                    console.log("Loading custom URL at ", playURL);

                    onDismiss(playURL);
                } else {
                    onDismiss(config.getStartUrl() + "permissions/" + serv + (playURL ? "?url=" + playURL : ""));
                }
            } else {
                setError("Invalid or un-supported watch URL specified. Please try another.");
                setCustomURL("");
            }
        } else {
            setError("Invalid or un-supported watch URL specified. Please try another..");
            setCustomURL("");
        }
    };

    const onServiceSelected = (service) => {
        checkServicePermissions(service).then((allowed) => {
            if (allowed) {
                ga("Chose " + service);

                if (serviceSettingRequired(service)) {
                    onDismiss(config.getStartUrl() + "service?setting=" + service);
                } else if (loginSettingRequired(service)) {
                    onDismiss(config.getStartUrl() + "service?login=" + service);
                } else {
                    onDismiss(service);
                }
            } else {
                console.warn("no permissions for ", service);
                onDismiss(config.getStartUrl() + "permissions/" + service);
            }
        });
    };

    const supportedService = (service) => {
        return supportedServices && supportedServices.includes(service);
    };

    useEffect(() => {
        if (settings.ready) {
            //     setHBOSetting(settings.getItem("hbosetting"));
        }
    }, []);

    useEffect(() => {
        if (visible) {
            setShowCustom(false);
        }
    }, [visible]);

    return (
        <NavPopup
            open={visible && isExtensionInstalled}
            anchorEl={anchorEl.current}
            PaperProps={{ className: classes.main }}
            onDismiss={onDismiss}
            disableDismissPassing
        >
            <Grid container className={classes.selectorService}>
                <MenuList>
                    {!showCustom &&
                        supportedServices
                            .map(
                                (s) =>
                                    s != "scener" && (
                                        <MenuItem onClick={() => onServiceSelected(s)} className={classes.menuItem} key={s}>
                                            <ServiceIcon height={"1.2rem"} permissionToUse={true} centered name={s} />
                                            {config.SERVICE_LIST[s].promptStart && settings.getItem("service." + s) && (
                                                <Tooltip title={config.SERVICE_LIST[s].name + " Settings"}>
                                                    <IconButton
                                                        style={{ position: "absolute", left: "1rem" }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            onDismiss(config.getStartUrl() + "service?setting=" + s);
                                                        }}
                                                    >
                                                        <SettingsIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {config.SERVICE_LIST[s].adFreeOnly && <div className={classes.serviceLogoDot}>&#9679;</div>}
                                        </MenuItem>
                                    )
                            )
                            .concat([
                                <MenuItem key="custom" onClick={() => setShowCustom(true)} className={classes.menuItem}>
                                    <Typography variant={"h5"} align={"center"}>
                                        Custom Link
                                    </Typography>
                                </MenuItem>
                            ])}
                    {showCustom && (
                        <Grid container direction="row" wrap="wrap" alignItems="center" justify="center" spacing={1} style={{ padding: "1rem" }}>
                            <Typography variant={"h5"} align={"center"}>
                                Custom Link
                            </Typography>
                            <Typography
                                variant={"body2"}
                                align={"center"}
                                style={{ marginTop: 10, marginBottom: 20, color: "rgba(255,255,255,0.7)" }}
                            >
                                Link must be a URL from one of the supported streaming services
                                {supportedService("youtube") ? ", such as a YouTube link" : ", or a YouTube link"}
                            </Typography>
                            {error && (
                                <Typography variant={"body2"} align={"center"} color={"error"} style={{ padding: 5 }}>
                                    {error}
                                </Typography>
                            )}
                            <TextField
                                onKeyPress={(ev) => {
                                    if (ev.key === "Enter") {
                                        // Do code here
                                        if (customURL && customURL.length > 0) {
                                            onCustomChosen(customURL);
                                        }
                                    }
                                }}
                                style={{ width: "70%" }}
                                inputProps={{
                                    style: { width: "100%" }
                                }}
                                autoFocus={true}
                                placeholder={"Enter Link URL"}
                                value={customURL}
                                onChange={(rcode) => {
                                    setError(null);
                                    setCustomURL(rcode.target.value);
                                }}
                            />
                            <Button
                                style={{ margin: 5 }}
                                variant={"contained"}
                                color={"primary"}
                                disabled={!customURL || customURL.length < 10}
                                onClick={() => {
                                    onCustomChosen(customURL);
                                }}
                            >
                                GO
                            </Button>
                        </Grid>
                    )}

                    <Typography variant={"body2"} align={"center"} style={{ padding: "1rem" }}>
                        Everyone joining will need an active account on the service.
                    </Typography>
                    {!showCustom && (
                        <div className={classes.mainFooter}>
                            <Typography variant={"body2"} align={"center"}>
                                <span style={{ lineHeight: "1rem", position: "relative", top: "0.2rem", fontSize: "2rem" }}>&#9679;</span> Premium
                                (ad-free) accounts only
                            </Typography>
                        </div>
                    )}
                </MenuList>
            </Grid>
        </NavPopup>
    );
};

const styles = (theme) => ({
    main: {
        width: "100%",
        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.darkest})`
    },
    badge: {
        position: "absolute",
        left: 20,
        top: -2
    },
    mainBody: {
        width: "100%",
        padding: theme.spacing(),
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    mainFooter: {
        width: "100%",
        color: "#b667f8",
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginBottom: theme.spacing(2)
    },
    menuItem: {
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 3,
        backgroundColor: "rgba(255,255,255,0.1)",
        "&:hover": {
            backgroundImage: `linear-gradient(16.37deg, ${theme.palette.scener.supernova},${theme.palette.scener.gradientLight})`
        }
    },
    selectorService: {
        padding: "1.75rem 1.6875rem 0 1.6875rem",
        transform: "scaleX(1) scaleY(1)",
        backgroundImage: `linear-gradient(56.18deg,${theme.palette.scener.gradientDark},${theme.palette.scener.blackberry})`
    },
    serviceLogoDot: {
        fontSize: "2rem",
        position: "absolute",
        right: "1rem",
        color: "#b667f8",
        marginTop: "-0.1rem"
    },
    menuButtonInactive: {
        backgroundColor: "rgba(255,255,255,0.5)",
        padding: theme.spacing()
    },
    menuButtonActive: {
        backgroundColor: "red",
        padding: theme.spacing()
    },
    menuButton: {
        color: "white",
        fontSize: "1.2rem"
    }
});

export default withStyles(styles)(SelectServicePopup);
