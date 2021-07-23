import React from "react";
import { makeStyles, Typography, Button, Divider,  Toolbar, DialogContent, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column"
    },
    appBar: {
        position: "relative",
        background: "transparent"
    },
    toolbar: {
        minHeight: theme.functions.rems(65)
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontSize: theme.functions.rems(20),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    divider: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)"
    },
    content: {
        padding: 0
    },
    section: {
        padding: theme.spacing(5)
    },
    sectionTitle: {
        fontSize: theme.functions.rems(20),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24),
        marginBottom: theme.spacing(1)
    },
    paragraph: {
        fontSize: theme.spacing(2),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24),
        fontWeight: 200,
        marginBottom: theme.spacing(1)
    },
    inner: {
        padding: theme.spacing(0, 0, 2)
    },
    button: {
        minWidth: theme.functions.rems(226)
    },
    gradianButton: {
        minWidth: theme.functions.rems(226),
        minHeight: theme.functions.rems(36),
        border: "none",
        marginTop: theme.spacing(3),
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: theme.spacing(6),
            background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        "&:before": {
            content: "''",
            background: `gradient(linear, left top, right top, from(${theme.palette.scener.blackberry}), to(${theme.palette.scener.gradientDark}))`,
            backgroundClip: " padding-box",
            border: "solid 2px transparent",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            borderRadius: theme.spacing(6)
        },
        "& > .MuiTouchRipple-root-345": {
            zIndex: 5
        }
    },
    gradianButtonLabel: {
        zIndex: 5
    }
}));

const FinishedAccountCreation = ({ onFinished }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Box component="div" position="relative" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" className={classes.title}>
                        Get Started
                    </Typography>
                </Toolbar>
                <Divider component="div" className={classes.divider} />
            </Box>
            <DialogContent className={classes.content}>
                <div className={classes.section}>
                    <div className={classes.inner}>
                        <Typography variant="h3" align="left" className={classes.sectionTitle}>
                            Go to Profile
                        </Typography>
                        <Typography variant="body1" align="left" className={classes.paragraph}>
                            Add a profile photo, background image, link your social accounts, and more.
                        </Typography>
                    </div>
                    <Button variant="contained" color="secondary" onClick={() => onFinished("profile")} className={classes.button}>
                        Edit profile
                    </Button>
                </div>
                <Divider />
                <div className={classes.section}>
                    <div className={classes.inner}>
                        <Typography variant="h3" align="left" className={classes.sectionTitle}>
                            Host a Watch Party
                        </Typography>
                        <Typography variant="body1" align="left" className={classes.paragraph}>
                            Start a public or private watch party in your very own Scener theater.
                        </Typography>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button variant="contained" color="secondary" onClick={() => onFinished("host")} className={classes.button}>
                            Start a watch party
                        </Button>
                        <Button variant="outlined" classes={{ root: classes.gradianButton, label: classes.gradianButtonLabel }}>
                            Schedule a party for later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </div>
    );
};

export default FinishedAccountCreation;
