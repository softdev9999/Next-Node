import { useState, useRef, useCallback } from "react";
import { Typography, withStyles, IconButton, Tooltip, Button, Box } from "@material-ui/core";
import ScenerTheme from "theme/ScenerThemeDefault";
import EyeIcon from "@material-ui/icons/VisibilityRounded";
import ChatHideIcon from "@material-ui/icons/RemoveCircleRounded";
import ChatShowIcon from "@material-ui/icons/AddCircleRounded";
import LinkIcon from "@material-ui/icons/Link";
import HelpIcon from "@material-ui/icons/HelpOutline";
import ShareView from "../Room/ShareView";
import { useCurrentRoom } from "hooks/Room/Room";
import LiveToggle from "../../LiveToggle/LiveToggle";
import AvControls from "components/AvControls/AvControls";
import NavPopup from "../../NavPopup/NavPopup";
import HelpPopup from "../../Help/HelpPopup";
import { useApp } from "hooks/Global/GlobalAppState";
import CoHostButton from "../../CoHostButton/CoHostButton";

const ChatHeader = ({ classes, chatHidden, onChatHiddenToggle, memberCount, shareHidden, onHideShareView }) => {
    const {
        dimensions: { isLandscape }
    } = useApp();
    const [shareRef, setShareRef] = useState(null);
    const shareButtonRef = useRef(null);
    const helpButtonRef = useRef(null);

    const {
        room: {
            member: { role },
            type: roomType,
            owner: { activity }
        },
        liveStatus,
        setLiveStatus
    } = useCurrentRoom();

    const [showHelp, setShowHelp] = useState(false);
    const renderToolbar = useCallback(() => {
        if (role == "owner") {
            return (
                <div className={classes.chatToolbar}>
                    <Box className={classes.liveToggleContainer}>
                        <LiveToggle checked={liveStatus} onChange={setLiveStatus} style={{ height: 23, width: "10rem" }}>
                            <div className={classes.viewerCount}>
                                <EyeIcon style={{ lineHeight: "1em" }} />
                                <Typography align="left" variant="body1" className={classes.numberCount}>
                                    {Math.max(memberCount, 0)}
                                </Typography>
                            </div>
                        </LiveToggle>
                    </Box>
                    <div className={classes.buttonContainer}>
                        <AvControls classes={{ button: isLandscape ? classes.toolbarButtonLandscape : classes.toolbarButton }} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className={classes.chatToolbar}>
                    <div className={classes.viewerCountMini}>
                        <div className={role == "audience" || liveStatus ? classes.live : classes.notLive}>Live</div>
                        <EyeIcon style={{ fontSize: "1.5em" }} />
                        <Typography
                            align="left"
                            variant="body1"
                            className={classes.numberCount}
                        >
                            {Math.max(memberCount, 0)}
                        </Typography>
                    </div>
                    <div className={classes.buttonContainer}>
                        <AvControls classes={{ button: isLandscape ? classes.toolbarButtonLandscape : classes.toolbarButton }} />
                    </div>
                </div>
            );
        }
    }, [roomType, role, liveStatus, isLandscape, activity, memberCount]);

    const renderChatHeaderButtons = useCallback(() => {
        if (roomType == "public") {
            if (role != "audience" && !(isLandscape && chatHidden)) {
                return <CoHostButton />;
            } else {
                return <></>;
            }
        } else {
            if (role == "owner") {
                return <AvControls classes={{ button: isLandscape ? classes.toolbarButtonLandscape : classes.toolbarButton }} />;
            } else {
                return <AvControls classes={{ button: isLandscape ? classes.toolbarButtonLandscape : classes.toolbarButton }} />;
            }
        }
    }, [roomType, role, isLandscape, chatHidden]);

    return (
        <Box width="100%">
            {roomType == "public" && role != "audience" && !(isLandscape && chatHidden) && renderToolbar()}
            <div className={isLandscape && chatHidden ? classes.chatHeaderLandscape : classes.chatHeader}>
                {isLandscape && chatHidden ? (
                    <Tooltip title={isLandscape ? "" : chatHidden ? "show chat" : "hide chat"}>
                        <IconButton onClick={onChatHiddenToggle}>{chatHidden ? <ChatShowIcon /> : <ChatHideIcon />}</IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title={isLandscape ? "" : chatHidden ? "show chat" : "hide chat"}>
                        <Button
                            classes={{ label: classes.chatButtonLabel }}
                            onClick={onChatHiddenToggle}
                            startIcon={chatHidden ? <ChatShowIcon /> : <ChatHideIcon />}
                        >
                            {roomType != "public" || role != "host" ? "chat" : ""}
                        </Button>
                    </Tooltip>
                )}
                {roomType == "public" && role == "audience" && (!isLandscape || !chatHidden) && (
                    <div className={classes.viewerCountMini}>
                        <div className={classes.live}>Live</div>
                        <EyeIcon style={{ fontSize: "1.5em" }} />
                        <Typography
                            align="left"
                            variant="body1"
                            style={{ flex: "0 0 auto", letterSpacing: ".1em", fontWeight: 400, marginLeft: ScenerTheme.spacing() }}
                        >
                            {Math.max(memberCount, 0)}
                        </Typography>
                    </div>
                )}
                <div className={isLandscape && chatHidden ? classes.buttonContainerLandscape : classes.buttonContainer}>
                    {renderChatHeaderButtons()}
                    <Tooltip title="need help?">
                        <IconButton
                            classes={{ root: isLandscape ? classes.toolbarButtonLandscape : classes.toolbarButton }}
                            ref={helpButtonRef}
                            variant={showHelp ? "contained" : "text"}
                            onClick={() => setShowHelp(true)}
                            color="default"
                        >
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="share this theater">
                        <IconButton
                            ref={shareButtonRef}
                            variant={shareRef ? "contained" : "text"}
                            onClick={({ currentTarget }) => {
                                if (!shareHidden) {
                                    onHideShareView(true);
                                } else {
                                    console.log("open share", currentTarget);

                                    setShareRef(currentTarget);
                                }
                            }}
                            classes={{ root: isLandscape ? classes.toolbarButtonLandscape : classes.toolbarButton }}
                            color="default"
                        >
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                    <NavPopup
                        anchorEl={shareRef}
                        open={!!shareRef}
                        onDismiss={() => setShareRef(null)}
                        container={() => (typeof document !== "undefined" ? document.body : null)}
                        gradient
                        classnames={{
                            root: classes.shareDialogPaper
                        }}
                    >
                        <ShareView onCopied={() => setShareRef(null)} rounded={true} />
                    </NavPopup>
                    <HelpPopup dialog open={!!showHelp} onDismiss={() => setShowHelp(false)} disableDismissPassing />
                </div>
            </div>
        </Box>
    );
};

const styles = (theme) => ({
    chatHeader: {
        width: "100%",
        maxHeight: theme.spacing(5.5),
        display: "flex",
        flexFlow: "row nowrap",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(0.25),
        flex: "0 0 " + theme.functions.rems(50),
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.primary.light,
        borderTop: `1px solid ${theme.palette.common.black}`
    },
    chatToolbar: {
        width: "100%",
        height: theme.spacing(5.5),
        maxHeight: theme.spacing(5.5),
        display: "flex",
        flexFlow: "row nowrap",
        paddingRight: theme.spacing(0.25),
        flex: "0 0 " + theme.functions.rems(50),
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.primary.light,
        marginTop: 1
    },
    chatHeaderLandscape: {
        height: "100%",
        width: theme.functions.rems(50),
        display: "flex",
        flexFlow: "column nowrap",
        margin: theme.spacing(-1, 0),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        flex: "0 0 " + theme.functions.rems(50),
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: theme.palette.primary.dark
    },
    liveToggleContainer: {
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: theme.gradients.create("90", `${theme.palette.primary.dark} 0%`, "#270670 100%"),
        paddingLeft: theme.spacing(1)
    },
    live: {
        borderRadius: 2000,
        background: "#F00",
        transition: theme.transitions.create(),
        zIndex: 2,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        letterSpacing: ".1em",
        fontWeight: "700",
        fontSize: "0.9em",
        width: "4rem",
        height: "1.5rem",
        textTransform: "uppercase",
        marginRight: theme.spacing(1)
    },
    notLive: {
        borderRadius: 2000,
        opacity: 0.8,
        background: "#433",
        transition: theme.transitions.create(),
        zIndex: 2,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: ".1em",
        fontWeight: "700",
        color: "#777",
        fontSize: ".9em",
        width: "5rem",
        height: theme.spacing(4),
        textTransform: "uppercase",
        marginRight: theme.spacing(1)
    },
    sharePaper: {
        minHeight: "10rem",
        flexFlow: "column nowrap",
        padding: theme.spacing(2, 3),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: theme.functions.rems(4),
        backgroundColor: theme.palette.primary.light,
        border: "2px " + theme.palette.primary.main + " solid"
    },
    toolbarButton: {
        flex: "0 0 auto",
        borderLeft: `1px solid ${theme.palette.common.black}`,
        borderRadius: theme.spacing(0),
        maxHeight: theme.spacing(5.5),
        maxWidth: theme.spacing(6.4),
        width: theme.spacing(6.4),
        height: theme.spacing(5.5)
    },
    toolbarButtonLandscape: {
        flex: "0 0 auto",
        borderBottom: `1px solid ${theme.palette.common.black}`,
        borderRadius: theme.spacing(0),
        maxHeight: theme.spacing(5.5),
        maxWidth: theme.spacing(6.4),
        width: theme.spacing(6.4),
        height: theme.spacing(5.5)
    },
    chatToggleRoot: {
        padding: theme.spacing(0.5),
        flex: "0 0 auto",
        fontSize: theme.spacing(4)
    },
    viewerCount: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flex: "0 1 100%",
        height: "100%"
    },
    viewerCountMini: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        height: "100%"
    },
    toolbarItem: {
        flex: "0 1 100%"
    },
    buttonContainer: {
        flex: "0 0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexFlow: "row nowrap"
    },
    buttonContainerLandscape: {
        flex: "0 0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexFlow: "column nowrap"
    },
    shareDialogPaper: {
        borderRadius: 0,
        padding: theme.spacing(2, 0),
        minWidth: theme.functions.rems(350),
        maxWidth: theme.functions.rems(350),
        backgroundImage: theme.gradients.create("142.42", `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 100%`),
        [theme.breakpoints.down("xs")]: {
            maxWidth: "calc(100vw - 2rem)",
            width: "calc(100vw - 2rem)"
        }
    },
    chatButtonLabel: {
        textTransform: "capitalize",
        fontSize: theme.spacing(1.6),
        letterSpacing: 0.43,
        lineHeight: theme.spacing(2)
    },
    numberCount: {
        flex: "0 0 auto",
        letterSpacing: ".1em",
        fontWeight: 400,
        marginLeft: theme.spacing(1)
    }
});

export default withStyles(styles)(ChatHeader);
