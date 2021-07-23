import React, { useEffect, useState } from "react";
import { Button, Typography, withStyles, Accordion, AccordionSummary, AccordionDetails, Divider, Box } from "@material-ui/core";

import config from "../../config";
import NavPopup from "../NavPopup/NavPopup";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useExtension } from "hooks/Extension/Extension";
import useRoomStatus from "hooks/Room/RoomStatus";
import { useCurrentRoom } from "hooks/Room/Room";

const HelpPopup = ({ classes, open, onDismiss }) => {
    const [expanded, setExpanded] = useState(false);
    const { openContentTab, isExtensionInstalled, country } = useExtension();
    const {
        room: { id: roomId }
    } = useCurrentRoom();

    const { status } = useRoomStatus();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    
    const onRestartAll = () => {
        onRestartContent();
        onRestartSidebar();
    };

    const onRestartContent = () => {
        if (isExtensionInstalled) {
            if (status && status.hostUrl) {
              openContentTab(status.hostUrl);
            } else {
              openContentTab(config.CONTENT_START_URL + "loading");
            }
        }
    };

    const onRestartSidebar = () => {
        window.location.reload();
    };

    const renderHelpSection = (id, title, description, onReset, resetTitle, moreInfo) => {
        return (
            <Accordion square classes={{ root: classes.helpBox, expanded: classes.expanded }} expanded={expanded === id} onChange={handleChange(id)}>
                <AccordionSummary
                    classes={{
                        root: classes.accordionSummary,
                        content: classes.accordionSummaryContent,
                        expandIcon: classes.expandIcon,
                        expanded: classes.expanded
                    }}
                    expandIcon={<ExpandMoreIcon />}
                    IconButtonProps={{
                        classes: {
                            edgeEnd: classes.edgeEnd
                        }
                    }}
                    aria-controls={id + "a-content"}
                    id={id + "a-header"}
                >
                    <Typography className={classes.heading}>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.sectionDetails}>
                    <Typography className={classes.helptext}>{description}</Typography>
                    <div className={classes.accordionDetailsFooter}>
                        {onReset && (
                            <Button className={classes.containedButton} color="primary" variant="contained" onClick={onReset}>
                                {resetTitle}
                            </Button>
                        )}
                        {moreInfo && (
                            <Button
                                className={classes.containedButton}
                                color="primary"
                                variant="contained"
                                onClick={() => window.open(moreInfo, "_blank")}
                            >
                                Read More Help Details...
                            </Button>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        );
    };

    useEffect(() => {}, []);

    return (
        <NavPopup
            dialog
            hideLogo
            gradient
            open={open}
            classnames={{
                paper: classes.paper,
                paperScrollPaper: classes.paperScrollPaper
            }}
            onDismiss={() => {
                setExpanded(false);
                onDismiss && onDismiss();
            }}
            fullScreen={false}
            disableDismissPassing
        >
            <Box p={4} display="flex" flexDirection="column" flexGrow="1">
                <Typography
                    align={"center"}
                    variant="h4"
                    style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.3, marginBottom: "1.5rem", width: "100%", marginTop: -5 }}
                >
                    Help
                </Typography>
                <Box display="flex" flexDirection="column" flexGrow="1">
                    {isExtensionInstalled &&
                        renderHelpSection(
                            "panel1",
                            "My video isn’t synching with others.",
                            "In most cases, the video should be ahead or behind by no more than a few seconds. If your video is significantly out of sync, however, try clicking the Re-Sync button below.",
                            onRestartAll,
                            "Re-Sync Scener"
                        )}
                    {renderHelpSection(
                        "panel2",
                        "My camera and/or microphone are not working.",
                        "Did you accidentally deny Scener access to audio or video? Is your audio or video not working or showing up? It happens. Try these steps below to allow for audio and video permissions.",
                        null,
                        null,
                        "https://blog.scener.com/permissions/"
                    )}
                    {renderHelpSection(
                        "panel3",
                        "I can’t see and/or hear someone else.",
                        "Is a host or co-host not appearing on video/audio, even though they are present/chatting? Try clicking the Re-Sync button below.",
                        onRestartSidebar,
                        "Re-Sync Scener"
                    )}
                    {renderHelpSection(
                        "panel6",
                        "I can't see the show that is playing.",
                        isExtensionInstalled
                            ? "If you do not see the show area on the left-hand side, it may have been closed or minimized. Click the Re-Launch button below."
                            : "This mobile version of Scener is used for video and text chatting along with the host. To see the show that is being watched, please use your laptop and download the Scener Chrome extension at scener.com",
                        isExtensionInstalled && onRestartContent,
                        isExtensionInstalled && "Re-Launch Show"
                    )}
                    {renderHelpSection(
                        "panel5",
                        "Chat isn't loading, or showing an error.",
                        "Having problems with chat? Click the Reload button below to try again.",
                        onRestartSidebar,
                        "Reload Chat"
                    )}

                    {renderHelpSection(
                        "panel4",
                        "Using a Firewall or VPN?",
                        "Unfortunately, Scener is currently unable to function properly with VPNs and some Firewall settings. In order to provide the best theater experience, we ask that you disable your VPN while enjoying shows with your friends! See the info below for help with configuring Firewall settings.",
                        null,
                        null,
                        "https://blog.scener.com/security/"
                    )}
                </Box>
                <Box marginBottom="1.5rem">
                    <Divider className={classes.helpDivider} />
                    <Typography className={classes.sectionFooter} align={"center"} style={{ width: "100%" }}>
                        Still having issues? Contact us at <a href="mailto:support@scener.com">support@scener.com</a>
                    </Typography>
                </Box>
            </Box>
        </NavPopup>
    );
};

const styles = (theme) => ({
    helpDivider: {
        width: "100%",
        marginTop: theme.spacing(2),
        height: theme.spacing(0.2),
        opacity: 0.5,
        background: theme.gradients.create("90", theme.palette.primary.lightest, theme.palette.primary.main)
    },
    helpBox: {
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1),
        marginBottom: `${theme.functions.rems(4)}!important`,
        boxShadow: "none",
        "&:before": {
            display: 'none'
        },
        "&$expanded": {
            margin: "0px!important",
            marginBottom: `${theme.functions.rems(4)}!important`,
        }
    },
    accordionSummary: {
        paddingRight: 0,
        alignItems: 'inherit',
        "&$expanded": {
            minHeight: 48
        }
    },
    sectionDetails: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2.2),
        backgroundColor: theme.functions.rgba(theme.palette.primary.dark, 0.3)
    },
    heading: {
        fontSize: theme.spacing(2),
        color: theme.palette.common.white,
        letterSpacing: 0.35,
        lineHeight: 1.5,
        fontWeight: 700
    },
    helptext: {
        fontSize: theme.spacing(2),
        color: theme.palette.common.white,
        letterSpacing: 0.35,
    },
    accordionDetailsFooter: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    sectionFooter: {
        marginTop: theme.spacing(2),
        fontSize: theme.spacing(2),
        fontWeight: 'bold',
        letterSpacing: 0.35,
    },
    paper: {
        margin: theme.spacing(1.3)
    },
    paperScrollPaper: {
        minHeight: "calc(100% - 130px)",
        padding: "0px!important"
    },
    accordionSummaryContent: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(2, 0),
        paddingRight: theme.spacing(1),
        "&$expanded": {
            margin: theme.spacing(2, 0)
        }
    },
    expandIcon: {
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1),
        borderRadius: 0,
        minHeight: theme.functions.rems(48),
        minWidth: theme.functions.rems(48),
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1)
        },
        '& > span > svg':{
            fontSize: theme.spacing(4),
            transform: 'rotate(0deg)',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
        '&$expanded': {
            transform: 'rotate(0deg)',
            '& > span > svg': {
                transform: 'rotate(180deg)'
            }
        }
    },
    edgeEnd: {
        marginRight: 0
    },
    containedButton: {
        boxShadow: "none",
        backgroundColor: theme.palette.secondary.main,
        borderRadius: theme.spacing(1.6),
        borderColor: `${theme.palette.secondary.main}!important`,
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: "none",
        }
    },
    expanded: {}
});

export default withStyles(styles)(HelpPopup);
