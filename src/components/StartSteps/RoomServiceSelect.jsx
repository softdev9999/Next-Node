import { Grid, ButtonBase, makeStyles, Typography, Divider, TextField, Button, Box, IconButton, Tooltip } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FixedRatioBox from "../FixedRatioBox/FixedRatioBox";
import { useExtension } from "hooks/Extension/Extension";
import { convertPlayURL } from "utils/Browser";
import ServiceIcon from "../Icon/ServiceIcon";
import NavPopup from "../NavPopup/NavPopup";
import { useSettings } from "hooks/Settings/Settings";
import SettingsIcon from "@material-ui/icons/Settings";
import config from "../../config";

const FixedRatioBoxProps = {
    xs: 0.2,
    sm: 0.5,
    md: 0.5,
    lg: 0.5
};
const useStyles = makeStyles((theme) => ({
    main: {
        width: "100%"
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
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    container: {
        margin: "auto"
    },
    contentContainer: {
        padding: theme.spacing(2)
    },
    contentBoxContainer: {
        backgroundImage: "url(/images/cards/ServiceSelect.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        padding: theme.spacing(8, 6),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(5)
        }
    },
    serviceBrandContainer: {
        marginBottom: theme.spacing(2)
    },
    serviceBrandIcon: {
        height: theme.spacing(8),
        width: "auto"
    },
    serviceButtonBase: {
        height: "100%",
        width: "100%",
        color: "white",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.2),
        borderRadius: theme.spacing(1),
        "&:hover,&:active,&:focus": {
            background: theme.gradients.create("317.39", theme.palette.primary.main, theme.palette.primary.lightest)
        }
    },
    settingButtonBase: {
        height: "100%",
        width: "100%",
        color: "white",
        flexFlow: "column wrap",
        justifyContent: "flex-start",
        alignContent: "center",
        backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.2),
        borderRadius: theme.spacing(1),
        "&:hover,&:active,&:focus": {
            background: theme.gradients.create("317.39", theme.palette.primary.main, theme.palette.primary.lightest)
        }
    },
    buttonInner: {
        position: "relative",
        flex: "0 1 auto",
        padding: theme.spacing(2, 3),
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "center",
        alignContent: "center",
        maxHeight: "calc(100% - 2rem)",
        maxWidth: "calc(100% - 2rem)"
    },
    serviceLogoDot: {
        height: theme.spacing(1),
        width: theme.spacing(1),
        borderRadius: "1rem",
        position: "absolute",
        right: theme.spacing(3),
        transform: "translate(0%, 0%)",
        top: theme.spacing(3),
        backgroundColor: theme.palette.primary.main
    },
    serviceDot: {
        height: theme.spacing(1),
        width: theme.spacing(1),
        borderRadius: theme.spacing(1),
        marginRight: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
    },
    bigButtonLabel: {},
    bigButtonIcon: {
        fontSize: "3em",
        marginBottom: "1rem",
        [theme.breakpoints.down("xs")]: {
            fontSize: "2em",
            marginBottom: ".25rem"
        }
    },
    gridTopContainer: {
        padding: theme.spacing(0, 4, 2)
    },
    gridBottomContainer: {
        padding: `${theme.spacing(2, 4, 0)}!important`
    },
    primary: {
        fontSize: theme.spacing(1.8),
        lineHeight: theme.spacing(2.5)
    },
    divider: {
        height: theme.spacing(0.3),
        marginTop: theme.spacing(0.5)
    }
}));

function RoomServiceSelect({ onServiceSelected, onSettingChanged, setting }) {
    const classes = useStyles();
    const settings = useSettings();

    const [customURL, setCustomURL] = useState("");
    const [error, setError] = useState(false);
    const [showCustom, setShowCustom] = useState(false);

    const [showSetting, setShowSetting] = useState(false);
    const [serviceChoice, setServiceChoice] = useState(false);

    const { supportedServices, setServiceSetting, serviceSettingRequired } = useExtension();

    const supportedService = (service) => {
        return supportedServices && supportedServices.includes(service);
    };

    const onCustomChosen = (url) => {
        let playURL = convertPlayURL(url, true);
        if (playURL) {
            setShowCustom(false);
            setCustomURL("");
            console.log("Loading custom URL at ", playURL);

            onServiceSelected(playURL);
        } else {
            setError("Invalid or un-supported watch URL specified. Please try another.");
            setCustomURL("");
        }
    };

    const changeSetting = (serv, set) => {
        setServiceSetting(serv, set);
        onSettingChanged && onSettingChanged(serv, set);
        onServiceSelected && onServiceSelected(serv);
    };

    const displaySetting = (serv) => {
        if (serv) {
            setServiceChoice(serv);

            if (serv && config.SERVICE_LIST[serv] && config.SERVICE_LIST[serv].promptStart) {
                setShowSetting(config.SERVICE_LIST[serv].promptStart);
            }
        }
    };

    const selectService = (serv) => {
        if (serv && serviceSettingRequired(serv)) {
            displaySetting(serv);
        } else {
            onServiceSelected(serv);
        }
    };

    useEffect(() => {
        if (setting) {
            displaySetting(setting);
        }
    }, [setting]);

    //{config.SERVICE_LIST[event.service].name}

    return (
        <div className={classes.container}>
            <div className={classes.serviceBrandContainer}>
                <img src={config.WORDMARK} style={{ height: "4rem", width: "auto" }} />
            </div>
            <div className={classes.contentContainer}>
                {serviceChoice && showSetting ? (
                    <Grid container spacing={0} justify="center" alignContent="flex-end">
                        <Grid item xs={12} sm={12} md={10}>
                            <Grid container justify="flex-start" alignContent="center" className={classes.contentBoxContainer}>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <ServiceIcon permissionToUse={true} centered width="10rem" name={serviceChoice} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h3" align="center" style={{ padding: "1rem", marginBottom: "2rem" }}>
                                        Choose how to watch
                                    </Typography>
                                </Grid>
                                <Grid container spacing={3} className={classes.gridTopContainer}>
                                    {Object.keys(showSetting).map((keyName, i) => (
                                        <Grid item xs={12} md={6} key={i}>
                                            <ButtonBase
                                                className={classes.settingButtonBase}
                                                variant={"outlined"}
                                                color={"primary"}
                                                onClick={() => changeSetting(serviceChoice, keyName)}
                                            >
                                                {" "}
                                                <div className={classes.buttonInner}>
                                                    <Typography style={{ fontSize: "2rem" }} align="center">
                                                        {showSetting[keyName].title}
                                                    </Typography>
                                                </div>
                                                <Divider color={"primary"} style={{ width: "100%" }} />
                                                <div className={classes.buttonInner}>
                                                    <Typography variant="h4" align="center">
                                                        {showSetting[keyName].description}
                                                    </Typography>
                                                </div>{" "}
                                            </ButtonBase>
                                        </Grid>
                                    ))}
                                </Grid>
                                {!setting && (
                                    <Grid container justify="center" style={{ marginTop: "2rem", opacity: "0.8" }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            style={{ width: "30%" }}
                                            onClick={() => {
                                                setServiceChoice(null);
                                            }}
                                            fullWidth
                                        >
                                            Choose a different service
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={0} justify="center" alignContent="flex-end">
                        <Grid item xs={12} sm={12} md={10}>
                            <Grid container spacing={2} justify="flex-start" alignContent="center" className={classes.contentBoxContainer}>
                                <Grid container spacing={2} className={classes.gridTopContainer}>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" align="left" gutterBottom>
                                            Choose a streaming service:
                                        </Typography>
                                    </Grid>
                                    {supportedServices.map(
                                        (s) =>
                                            s != "scener" && (
                                                <Grid item xs={12} sm={4} md={3} key={s}>
                                                    <FixedRatioBox {...FixedRatioBoxProps}>
                                                        <ButtonBase
                                                            className={classes.serviceButtonBase}
                                                            variant={"outlined"}
                                                            color={"primary"}
                                                            onClick={() => selectService(s)}
                                                        >
                                                            {" "}
                                                            <div className={classes.buttonInner}>
                                                                <ServiceIcon centered permissionToUse={true} name={s} />
                                                            </div>{" "}
                                                            {config.SERVICE_LIST[s].adFreeOnly && <div className={classes.serviceLogoDot} />}
                                                            {config.SERVICE_LIST[s].promptStart && settings.getItem("service." + s) && (
                                                                <Tooltip title="Settings">
                                                                    <IconButton
                                                                        style={{ marginLeft: "-1.5rem" }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            displaySetting(s);
                                                                        }}
                                                                    >
                                                                        <SettingsIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </ButtonBase>
                                                    </FixedRatioBox>
                                                </Grid>
                                            )
                                    )}
                                    <Grid item xs={12} sm={4} md={3}>
                                        <FixedRatioBox {...FixedRatioBoxProps}>
                                            <ButtonBase
                                                className={classes.serviceButtonBase}
                                                variant={"outlined"}
                                                color={"primary"}
                                                onClick={() => setShowCustom(true)}
                                            >
                                                {" "}
                                                <div className={classes.buttonInner}>
                                                    <Typography variant={"h3"} align={"center"} style={{}}>
                                                        Custom Link
                                                    </Typography>
                                                </div>
                                            </ButtonBase>
                                        </FixedRatioBox>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider variant="fullWidth" height="2" className={classes.divider} />
                                </Grid>
                                <Grid item xs={12} container className={classes.gridBottomContainer}>
                                    <Grid item container alignItems="center" justify="flex-start" wrap="nowrap">
                                        <Grid item>
                                            <Box width="0.5rem" height="0.5rem" marginRight="0.5rem" />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant={"h4"} align={"left"} className={classes.primary}>
                                                Everyone joining will need an active account on the service.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems="center" justify="flex-start" wrap="nowrap">
                                        <Grid item>
                                            <div className={classes.serviceDot} />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant={"h4"} align={"left"} className={classes.primary}>
                                                For syncing to work properly, everyone must have an ad-free account.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <NavPopup open={showCustom} dialog gradient size={"xl"} onDismiss={() => setShowCustom(false)} disableDismissPassing>
                                    <Grid container direction="column" wrap="wrap" alignItems="center" justify="center" style={{ padding: "1rem" }}>
                                        <Typography variant={"h3"} align={"center"}>
                                            Custom Link
                                        </Typography>
                                        <Typography
                                            variant={"h6"}
                                            align={"center"}
                                            style={{ marginTop: 10, marginBottom: 20, color: "rgba(255,255,255,0.7)" }}
                                        >
                                            Link must be a URL from one of the supported streaming services
                                            {supportedService("youtube") ? ", such as a YouTube link" : ", or a YouTube link"}
                                        </Typography>
                                        {error && (
                                            <Typography variant={"body1"} align={"center"} color={"error"} style={{ padding: 5 }}>
                                                {error}
                                            </Typography>
                                        )}
                                        <Grid container direction="row" alignItems="center" justify="center">
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
                                    </Grid>
                                </NavPopup>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </div>
        </div>
    );
}

export default RoomServiceSelect;
