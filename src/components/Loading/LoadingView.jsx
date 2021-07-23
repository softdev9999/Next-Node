import React from "react";
import SyncIcon from "@material-ui/icons/SyncRounded";
import { Typography, withStyles, useTheme } from "@material-ui/core";

const LoadingView = ({ title, subtitle, classes }) => {
    const theme = useTheme();
    return (
        <div className={classes.main} style={{ paddingTop: theme.variables.header.height.rem }}>
            <div className={classes.mainBody}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexFlow: "column nowrap" }}>
                    <div style={{ transform: "scaleX(-1)" }}>
                        <SyncIcon style={{ color: "white", animation: "spin 3s infinite linear reverse" }} />
                    </div>
                    <Typography style={{ flex: "0 1 100%", animation: "pulse 2s infinite linear" }} variant={"h5"} align={"left"}>
                        {title || "loading..."}
                    </Typography>
                    {subtitle && (
                        <Typography style={{ flex: "0 1 100%", animation: "pulse 2s infinite linear" }} variant={"body1"} align={"left"}>
                            {subtitle}
                        </Typography>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    main: {
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    inviteLink: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 50,
        paddingRight: 50
    },
    mainBody: {
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        flex: "0 1 100%"
    }
};
export default withStyles(styles)(LoadingView);
