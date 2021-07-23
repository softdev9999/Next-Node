import React from "react";
import { withStyles, Typography } from "@material-ui/core";

const Divider = ({ label, width, color_, spacing, classes }) => {
    return (
        <Typography
            variant={"body1"}
            className={label ? classes.separator : classes.separatorBlank}
            style={{ width: width || "auto", marginTop: spacing || 0, marginBottom: spacing || 0 }}
        >
            {label}
        </Typography>
    );
};

const defaultColor = "rgba(255,255,255,0.5)";

const styles = (theme) => ({
    separator: {
        width: "30vw",
        color: theme.color || "white",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        "&::before": {
            content: "''",
            flex: 1,
            borderBottom: "1px solid " + (theme.color || defaultColor),
            marginRight: "0.25em"
        },
        "&::after": {
            content: "''",
            flex: 1,
            borderBottom: "1px solid " + (theme.color || defaultColor),
            marginLeft: "0.25em"
        }
    },
    separatorBlank: {
        width: "30vw",
        color: theme.color || "white",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        "&::before": {
            content: "''",
            flex: 1,
            borderBottom: "1px solid " + (theme.color || defaultColor)
        },
        "&::after": {
            content: "''",
            flex: 1,
            borderBottom: "1px solid " + (theme.color || defaultColor)
        }
    }
});

export default withStyles(styles)(Divider);
