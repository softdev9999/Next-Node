import React from "react";
import {
    Toolbar,
    Button,
    makeStyles,
    IconButton,
    Typography,
    Tooltip,
    MenuList,
    MenuItem,
    ListItem,
    ListItemIcon,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from "@material-ui/core";
import { useApp } from "hooks/Global/GlobalAppState";
import UserIcon from "@material-ui/icons/AccountCircleRounded";
import { useExtension } from "hooks/Extension/Extension";
import MenuIcon from "@material-ui/icons/Menu";
import HelpIcon from "@material-ui/icons/HelpOutline";
import FeedbackIcon from "@material-ui/icons/Comment";
import CloseIcon from "@material-ui/icons/CloseRounded";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import InfoIcon from "@material-ui/icons/Info";
import UpdateIcon from "@material-ui/icons/Update";
import AccountPopup from "../AccountPopup/AccountPopup";
import { useState, useEffect } from "react";
import { useRef } from "react";
import NavLink from "../NavLink/NavLink";
import NavPopup from "../NavPopup/NavPopup";
import { useContentState } from "hooks/ContentState/ContentState";

import UserAvatar from "../UserAvatar/UserAvatar";
import { useCurrentRoom } from "hooks/Room/Room";
import UpdateExtension from "../SidebarAlerts/UpdateExtension";
import FullScreenInstructions from "../SidebarAlerts/FullScreenInstructions";
import { isMobile } from "utils/Browser";
import { useRouter } from "next/router";
import config from "../../config";
import ErrorCard from "../ErrorView/ErrorCard";

const useStyles = makeStyles((theme) => ({
    navBar: {
        height: "2.5rem",
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        minHeight: 0
    },
    mcol: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center"
    },
    mleft: {
        paddingTop: "1rem"
    },
    logo: {
        height: "100%",

        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        "& img": {
            height: "100%"
        }
    },
    backButtonRoot: {
        padding: "0.25rem",
        backgroundColor: "red",
        "&:hover": {
            backgroundColor: "#CC0000"
        }
    },
    backButtonLabel: {
        color: "white"
    },
    iconButtonSm: {
        backgroundColor: theme.palette.primary.dark,
        margin: theme.spacing(0, 0.5),
        padding: "0.25rem"
    },
    menuIcon: {
        backgroundColor: "rgba(255,255,255,0.2)",
        marginLeft: "1rem",
        marginRight: "1rem",
        padding: "0.4rem",
        borderRadius: "50%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.8rem"
    },
    menuIconInner: {
        color: "white",
        fill: "white",
        height: "2rem",
        width: "2rem"
    },
    menuHeader: {
        height: "3rem",
        padding: "1rem 1.5rem",
        backgroundColor: theme.palette.primary.darkest,
        marginBottom: "1rem"
    },
    menuFooter: {
        marginTop: "1rem",
        height: "2rem",
        padding: "1rem 1.5rem",
        backgroundColor: theme.palette.primary.darkest
    },
    popoverPaper: {
        minHeight: "calc(100vh - 100px)",
        background: theme.gradients.create("47.52", `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 80%`)
    },
    dialogPaper: {
        margin: theme.functions.rems(12),
        padding: theme.spacing(2, 0, 4),
        backgroundImage: theme.gradients.create(65, `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 100%`)
    }
}));

const SidebarNav = () => {
    const classes = useStyles();
    const {
        auth,
        popups: { sidebarHelp, feedback, account, sidebarAlert, error }
    } = useApp();
    const [showExitWarning, setShowExitWarning] = useState(false);
    const [showNavMenu, setShowNavMenu] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showFSInfo, setShowFSInfo] = useState(false);
    const closeRef = useRef();
    const buttonRef = useRef();

    const { closeSidebar, version, hasUpdate, isExtensionInstalled } = useExtension();
    const { disconnect } = useCurrentRoom();
    const { fullscreen } = useContentState();

    const router = useRouter();

    useEffect(() => {
        if (fullscreen) {
            setShowFSInfo(false);
        }
    }, [fullscreen]);

    useEffect(() => {
        window.addEventListener("scenererror", () => {
            error.show(true);
        });
        return () => {
            window.removeEventListener("scenererror", () => {
                error.show(true);
            });
        };
    }, []);

    const onConfirmedLeave = () => {
        if (isExtensionInstalled) {
            disconnect().then(() => {
                closeSidebar();
            });
        } else {
            if (auth && auth.user && auth.user.username) {
                router.push("/[username]", "/" + auth.user.username);
            } else {
                router.push("/");
            }
        }
    };

    const onAccountButtonClicked = () => {
        if (auth && auth.user && auth.user.username) {
            window.open("/" + auth.user.username, "_blank");
        } else {
            account.show(true, { initialView: "login", skipFinish: true });
        }
    };

    const onTermsClicked = () => {
        window.open("/terms", "_blank");
    };

    return (
        <>
            <Toolbar className={classes.navBar} variant="dense" disableGutters>
                <div className={classes.logo}>
                    <NavLink href="/">
                        <a target={isMobile() ? null : "_blank"} rel="noopener noreferrer">
                            <img src={config.WORDMARK} />
                        </a>
                    </NavLink>
                </div>
                <div>
                    {!fullscreen && isExtensionInstalled && (
                        <IconButton className={classes.iconButtonSm} onClick={() => setShowFSInfo(true)}>
                            <Tooltip title={"fullscreen instructions"}>
                                <FullscreenIcon style={{ transform: "scale(1.3)" }} />
                            </Tooltip>
                        </IconButton>
                    )}

                    <IconButton ref={buttonRef} className={classes.iconButtonSm} onClick={() => setShowNavMenu(true)}>
                        <MenuIcon />
                    </IconButton>

                    <IconButton ref={closeRef} onClick={() => setShowExitWarning(true)} className={classes.iconButtonSm}>
                        <Tooltip title={"leave watch party"}>
                            <CloseIcon />
                        </Tooltip>
                    </IconButton>
                </div>
            </Toolbar>

            <NavPopup
                gradient
                hideLogo
                anchorEl={() => (buttonRef.current ? buttonRef.current : null)}
                open={showFSInfo}
                onDismiss={() => setShowFSInfo(false)}
            >
                <FullScreenInstructions />
            </NavPopup>
            <NavPopup
                open={showNavMenu}
                gradient
                paperStyle={{ padding: "0rem" }}
                anchorEl={() => (buttonRef.current ? buttonRef.current : null)}
                onDismiss={() => setShowNavMenu(false)}
                container={() => (typeof document !== "undefined" ? document.body : null)}
                disableDismissPassing
            >
                <MenuList style={{ padding: 0 }}>
                    <ListItem classes={{ root: classes.menuHeader }}>
                        <Typography align="left" variant="h5" style={{ width: "100%" }}>
                            {auth.user.username}
                        </Typography>
                    </ListItem>
                    <MenuItem
                        classes={classes.menuItem}
                        onClick={() => {
                            onAccountButtonClicked();
                            setShowNavMenu(false);
                        }}
                    >
                        <ListItemIcon>
                            <div className={classes.menuIcon}>
                                {auth.user.profileImageUrl ? (
                                    <UserAvatar user={auth.user} className={classes.menuIconInner} />
                                ) : (
                                    <UserIcon className={classes.menuIconInner} />
                                )}
                            </div>
                        </ListItemIcon>
                        {auth.loggedIn ? "My Profile" : "Log In"}
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            feedback.show(true);
                            setShowNavMenu(false);
                        }}
                    >
                        <ListItemIcon>
                            <div className={classes.menuIcon}>
                                <FeedbackIcon className={classes.menuIconInner} />
                            </div>
                        </ListItemIcon>
                        Give Feedback
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            sidebarHelp.show(true);
                            setShowNavMenu(false);
                        }}
                    >
                        <ListItemIcon>
                            <div className={classes.menuIcon}>
                                <HelpIcon className={classes.menuIconInner} />
                            </div>
                        </ListItemIcon>
                        Help
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            onTermsClicked();
                            setShowNavMenu(false);
                        }}
                    >
                        <ListItemIcon>
                            <div className={classes.menuIcon}>
                                <InfoIcon className={classes.menuIconInner} />
                            </div>
                        </ListItemIcon>
                        Terms and Privacy
                    </MenuItem>
                    {isExtensionInstalled && version && (
                        <MenuItem
                            className={classes.menuFooter}
                            disabled={!hasUpdate}
                            onClick={() => {
                                setShowUpdate(true);
                            }}
                        >
                            {hasUpdate && (
                                <ListItemIcon>
                                    <div className={classes.menuIcon}>
                                        <UpdateIcon className={classes.menuIconInner} />
                                    </div>
                                </ListItemIcon>
                            )}
                            version {version} {hasUpdate && " (Update Available)"}
                        </MenuItem>
                    )}
                </MenuList>
            </NavPopup>
            <NavPopup
                classes={{
                    paper: classes.popoverPaper
                }}
                dialog
                open={account.open}
                onDismiss={() => {
                    account.show(false);
                }}
            >
                <AccountPopup {...account.options} />
            </NavPopup>
            <NavPopup
                classnames={{
                    paper: classes.dialogPaper
                }}
                dialog
                hideDismiss
                fullScreen={false}
                open={sidebarAlert.open}
                onDismiss={() => {
                    sidebarAlert.show(false);
                }}
            >
                {sidebarAlert.options && sidebarAlert.options.Component ? sidebarAlert.options.Component : <></>}
            </NavPopup>
            <Dialog maxWidth="xl" disableBackdropClick open={!!error.open} PaperProps={{ style: { padding: 0, overflow: "visible" } }}>
                <ErrorCard />
            </Dialog>
            <NavPopup dialog onDismiss={() => setShowUpdate(false)} open={showUpdate} hideLogo>
                <UpdateExtension />
            </NavPopup>
            <NavPopup open={showExitWarning} onDismiss={() => setShowExitWarning(false)} anchorEl={closeRef.current}>
                <>
                    <DialogTitle style={{ paddingTop: "1rem" }}>ARE YOU SURE?</DialogTitle>
                    <DialogContent>
                        <Typography>You will leave this watch party</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={onConfirmedLeave}
                            classes={{ root: classes.backButtonRoot, label: classes.backButtonLabel }}
                            variant="contained"
                            fullWidth
                        >
                            LEAVE WATCH PARTY
                        </Button>
                    </DialogActions>
                </>
            </NavPopup>
        </>
    );
};

export default SidebarNav;
