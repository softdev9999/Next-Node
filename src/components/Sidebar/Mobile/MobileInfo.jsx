import classname from "classnames";
import React, { useState, useEffect } from "react";
import { makeStyles, Button, Typography, DialogContent, DialogTitle, Box, LinearProgress } from "@material-ui/core";
import useRoomStatus from "hooks/Room/RoomStatus";
import { useCurrentRoom } from "hooks/Room/Room";
import Accordion from "./Accordion";
import NavPopup from "../../NavPopup/NavPopup";
import config from "../../../config";
import { Scener } from "../../Icon/Icon";
import { Laptop, LiveTvOutlined } from "@material-ui/icons";
import ServiceIcon from "../../Icon/ServiceIcon";

const useStyles = makeStyles((theme) => ({
    paper: {
        background: theme.gradients.create(135.45, `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 100%`),
        boxShadow: "none"
    },
    dialogTitle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: theme.spacing(5)
    },
    dialogContent: {
        padding: theme.spacing(1, 3)
    },
    title: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.29,
        lineHeight: theme.functions.rems(20)
    },
    brandIcon: {
        fontSize: "3rem",
        marginBottom: theme.spacing(1)
    },
    icon: {
        height: "2rem",
        width: "2rem"
    },
    accordionContent: {
        padding: theme.spacing(3.5, 2, 3)
    },
    contentContainer: {
        display: "flex",
        flexGrow: 1,
        marginBottom: theme.spacing(2)
    },
    contentBackground: {
        alignItems: "center",
        background: theme.functions.rgba("#D8D8D8", 0.1)
    },
    numberContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: theme.functions.rems(27),
        height: theme.functions.rems(28),
        background: theme.functions.rgba("#d8d8d8", 0.1),
        marginLeft: "1.20rem",
        marginRight: "1.20rem"
    },
    number: {
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(18)
    },
    textContainer: {
        display: "flex",
        alignItems: "center",
        width: "65%",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap"
    },
    linkContainer: {
        display: "flex",
        alignItems: "flex-start",
        width: "80%",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
        flexDirection: "column"
    },
    textDirection: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "55%"
    },
    fontBold: {
        fontSize: "inherit",
        fontWeight: 800,
        lineHeight: "inherit"
    },
    paragraph: {
        fontSize: theme.functions.rems(14),
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(18)
    },
    buttonContainer: {
        padding: theme.spacing(0, 6),
        margin: theme.spacing(4, 0)
    },
    button: {
        minHeight: theme.functions.rems(28),
        backgroundColor: "#F604FF"
    },
    imageContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: theme.functions.rems(61),
        height: theme.functions.rems(92),
        marginRight: theme.spacing(3),
        padding: theme.spacing(0.8),
        backgroundColor: theme.functions.rgba("#D8D8D8", 0.1)
    },
    primary: {
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(18)
    },
    secondary: {
        fontSize: theme.functions.rems(12),
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(18)
    },
    timerContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: theme.functions.rems(28),
        maxHeight: theme.functions.rems(28),
        backgroundColor: theme.functions.rgba("#D8D8D8", 0.25)
    },
    timer: {
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.26,
        lineHeight: theme.functions.rems(16)
    },
    progressContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: theme.functions.rems(28),
        maxHeight: theme.functions.rems(28),
        backgroundColor: theme.functions.rgba("#D8D8D8", 0.15)
    },
    progress: {
        width: "calc(100% - 20%)"
    },
    linearProgress: {
        height: theme.functions.rems(4),
        borderRadius: theme.functions.rems(2),
        backgroundColor: theme.palette.common.black
    },
    progressBar: {
        borderRadius: theme.functions.rems(2),
        backgroundColor: theme.palette.dangerous.main
    }
}));

const MobileInfo = ({ visible, onDismiss }) => {
    const [currentView, setCurrentView] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();
    const { status } = useRoomStatus();

    const {
        room: { owner }
    } = useCurrentRoom();

    const localDismiss = () => {
        onDismiss && onDismiss();
    };

    useEffect(() => {
        if (visible) {
            setCurrentView(null);
            setExpanded(false);
        }
    }, [visible]);

    const handleChange = (selectedValue) => {
        setCurrentView(selectedValue);
        setExpanded(!expanded);
    };

    return (
        <NavPopup dialog gradient classnames={{ paper: classes.paper }} open={visible} onDismiss={localDismiss} disableDismissPassing>
            <DialogTitle disableTypography className={classes.dialogTitle}>
                <Scener className={classes.brandIcon} />
                <Typography variant="h3" align="center" className={classes.title}>
                    How to watch
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Box display="flex" flexDirection="column" flexGrow="1">
                    <Accordion
                        expanded={currentView === "laptop" && expanded}
                        icon={Laptop}
                        title="Auto-sync with your laptop"
                        onChange={() => handleChange("laptop")}
                    >
                        <Box className={classes.accordionContent}>
                            <Box className={classes.contentContainer}>
                                <Box className={classes.numberContainer}>
                                    <Typography className={classes.number}>1</Typography>
                                </Box>
                                <Box className={classes.linkContainer}>
                                    <Typography className={classes.paragraph}>
                                        On your laptop Chrome browser, go to:
                                    </Typography>
                                    <Typography component="div" className={classes.fontBold} style={{marginTop: "1rem"}}>
                                        {config.WEB_HOST.replace("https://", "") + "/" + owner.username}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box className={classes.contentContainer}>
                                <Box className={classes.numberContainer}>
                                    <Typography className={classes.number}>2</Typography>
                                </Box>
                                <Box className={classes.textContainer}>
                                    <Typography className={classes.paragraph}>Click &quot;Join Party&quot;</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.contentContainer}>
                                <Box className={classes.numberContainer}>
                                    <Typography className={classes.number}>3</Typography>
                                </Box>
                                <Box className={classes.textContainer}>
                                    <Typography className={classes.paragraph}>Enjoy! Your video will sync automatically</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Accordion>
                    <Accordion
                            expanded={currentView === "tv" && expanded}
                            icon={LiveTvOutlined}
                            title="Manually sync with your TV"
                            onChange={() => handleChange("tv")}
                        >
                            <Box className={classes.accordionContent}>
                                <Box className={classes.contentContainer}>
                                    <Box className={classes.numberContainer}>
                                        <Typography className={classes.number}>1</Typography>
                                    </Box>
                                    <Box className={classes.textContainer}>
                                        {(status.hostService && status.hostService != "scener") ? <Typography className={classes.paragraph}>
                                            Go to &nbsp;
                                            <Typography component="span" className={classes.fontBold}>
                                                {config.SERVICE_LIST[status.hostService].name}
                                            </Typography>
                                            &nbsp; on your TV
                                        </Typography> :
                                        <Typography className={classes.paragraph}>Wait for host to choose a streaming service</Typography>}
                                    </Box>
                                </Box>
                                <Box className={classes.contentContainer}>
                                    <Box className={classes.numberContainer}>
                                        <Typography className={classes.number}>2</Typography>
                                    </Box>
                                    <Box className={classes.textContainer}>
                                        <Typography className={classes.paragraph}>{status.title ? "Choose and play:" : "Select the show that the host chooses"}</Typography>
                                    </Box>
                                </Box>
                                {status.title && <Box className={classname(classes.contentContainer, classes.contentBackground)}>
                                    <Box className={classes.imageContainer}>
                                      {status.hostService && <ServiceIcon name={status.hostService} opacity="0.7" centered />}
                                    </Box>
                                    <Box className={classes.linkContainer}>
                                        <Typography className={classes.primary}>
                                            {status.title}
                                        </Typography>
                                    </Box>
                                </Box>}
                                <Box className={classes.contentContainer}>
                                    <Box className={classes.numberContainer}>
                                        <Typography className={classes.number}>3</Typography>
                                    </Box>
                                    <Box className={classes.textContainer}>
                                        <Typography className={classes.paragraph}>
                                            {!status.timer && "Once the host has chosen something to play, "} Fast forward to the time {status.timer ? "shown below" : "that will appear below"} to
                                            watch along with the host:
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            {status.progress ? <Box className={classes.progressContainer}>
                                <Box className={classes.progress}>
                                    <LinearProgress
                                        classes={{ root: classes.linearProgress, bar: classes.progressBar }}
                                        variant="determinate"
                                        value={status.progress}
                                    />
                                </Box>
                            </Box> : null}
                            {status.timer && (
                                <Box className={classes.timerContainer}>
                                    <Typography component="time" className={classes.timer}>
                                        {status.timer}
                                    </Typography>
                                </Box>
                            )}
                        </Accordion>
                </Box>
                <Box className={classes.buttonContainer}>
                    <Button classes={{ root: classes.button }} onClick={localDismiss} variant="contained" color="secondary" fullWidth>
                        OK
                    </Button>
                </Box>
            </DialogContent>
        </NavPopup>
    );
};

export default MobileInfo;
