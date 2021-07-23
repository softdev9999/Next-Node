import React from "react";
import { Button, withStyles } from "@material-ui/core";

import { HBOGO, HBONOW, HBOMax } from "../Icon/Icon";
import Popup from "../Popup/Popup";
import { useExtension } from "hooks/Extension/Extension";
import { useSettings } from "hooks/Settings/Settings";
const ROUTES_WITH_INVITE = [/\/live/];

const ENABLE_MAX = false;

const HBOSelect = ({ visible, onDismiss, classes }) => {
    const settings = useSettings();
    const { openContentTab } = useExtension();

    const inRoom = ROUTES_WITH_INVITE.reduce((prev, cur) => {
        return prev || !!location.pathname.match(cur);
    }, false);

    const currentSetting = settings.getItem("hbosetting");

    const updateSetting = (value) => {
        if (value != "unknown") {
            settings.setItem("hbosetting", value);

            if (inRoom && currentSetting != value) {
                openContentTab("https://play.hbonow.com/");
            }

            onDismiss(value);
        } else {
            openContentTab("https://www.hbo.com/ways-to-get");
        }
    };

    return (
        <Popup
            modal={true}
            visible={visible}
            onDismiss={onDismiss}
            onConfirm={onDismiss}
            title={currentSetting ? "HBO SERVICE SETTINGS" : "WHICH HBO SERVICE DO YOU HAVE?"}
            confirmTitle={"CANCEL"}
        >
            <div className={classes.mainBody}>
                {ENABLE_MAX && (
                    <Button
                        className={currentSetting == "hbomax" ? classes.serviceButtonActive : classes.serviceButton}
                        variant={"outlined"}
                        color={"primary"}
                        onClick={() => updateSetting("hbomax")}
                    >
                        {<HBOMax className={classes.serviceLogo} />}
                    </Button>
                )}
                <Button
                    className={currentSetting == "hbonow" ? classes.serviceButtonActive : classes.serviceButton}
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => updateSetting("hbonow")}
                >
                    <HBONOW className={classes.serviceLogo} />
                </Button>
                <Button
                    className={currentSetting == "hbogo" ? classes.serviceButtonActive : classes.serviceButton}
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => updateSetting("hbogo")}
                >
                    <HBOGO className={classes.serviceLogo} />
                </Button>
                <Button
                    className={classes.serviceButton}
                    style={{ marginTop: 20 }}
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => {
                        updateSetting("unknown");
                    }}
                >
                    No account / I don&apos;t know
                </Button>
            </div>
        </Popup>
    );
};

const styles = (theme) => ({
    main: {
        width: "100%"
    },
    mainBody: {
        width: "100%",
        padding: theme.spacing(),
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    serviceButton: {
        color: "white",
        width: "80%",
        padding: 15,
        marginTop: theme.spacing(2),
        backgroundColor: "rgba(0,0,0,0.5)",
        borderColor: "white"
    },
    serviceButtonActive: {
        color: "white",
        width: "80%",
        padding: 15,
        marginTop: theme.spacing(2),
        backgroundColor: "rgba(0,0,0,0.2)",
        borderColor: "yellow"
    },
    serviceLogo: {
        fill: "white",
        height: "1.2rem",
        "& path": {
            fill: "white"
        },
        "& ellipse": {
            fill: "white"
        },
        "& circle": {
            fill: "white"
        }
    },
    menuButtonInactive: {
        backgroundColor: "rgba(255,255,255,0.5)",
        padding: theme.spacing()
    },
    menuButtonActive: {
        backgroundColor: "#8f2af5",
        padding: theme.spacing()
    },
    menuButton: {
        color: "white",
        fontSize: "1.75rem"
    }
});

export default withStyles(styles)(HBOSelect);
