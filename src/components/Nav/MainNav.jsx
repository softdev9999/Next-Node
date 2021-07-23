import React, { useEffect } from "react";
import {
    Link,
    Container,
    Toolbar,
    Button,
    makeStyles,
    IconButton,
    MenuItem,
    Hidden,
    ListItemIcon,
    MenuList,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import { useApp } from "hooks/Global/GlobalAppState";
import UserIcon from "@material-ui/icons/AccountCircleOutlined";
import { useExtension } from "hooks/Extension/Extension";
import { useState } from "react";
import { useRef } from "react";
import NavLink from "../NavLink/NavLink";
import { useRouter } from "next/router";
import RoomCode from "../StartSteps/RoomCode";
import NavPopup from "../NavPopup/NavPopup";
import MenuIcon from "@material-ui/icons/Menu";
import TVIcon from "@material-ui/icons/LiveTvOutlined";
import HelpIcon from "@material-ui/icons/HelpOutline";
import FeedbackIcon from "@material-ui/icons/FeedbackOutlined";
import SignOutIcon from "@material-ui/icons/ExitToApp";
import ActivityBarIcon from "@material-ui/icons/FlashOn";
import UserAvatar from "../UserAvatar/UserAvatar";
import GetScenerButton from "../GetScenerButton/GetScenerButton";

import { addTracking } from "utils/Tracking";
import { useCallback } from "react";
import config from "../../config";
import { isChrome, isMobile } from "utils/Browser";
import dynamic from "next/dynamic";
const useStyles = makeStyles((theme) => ({
    navBar: {
        height: theme.functions.rems(132),
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        borderBottom: "solid .25rem transparent",
        alignItems: "flex-end",
        paddingBottom: theme.spacing(2.5),
        transition: theme.transitions.create(["padding-bottom", "height"]),
        [theme.breakpoints.down("xs")]: {
            height: theme.functions.rems(80),
            paddingBottom: theme.spacing(1)
        },
        [theme.breakpoints.between(500, 720)]: {
            height: theme.functions.rems(96),
            paddingBottom: theme.spacing(1)
        }
    },
    navBarElevated: {
        height: theme.functions.rems(80),
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: theme.spacing(1),
        //  borderBottom: "solid .25rem rgba(255,255,255,.3)",
        transition: theme.transitions.create(["padding-bottom", "height"])
    },
    logo: {
        height: "100%",
        flex: "0 0  auto",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        "& img": {
            height: "100%"
        }
    },
    buttons: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-end",
        flex: "0 1 100%",
        alignItems: "center"
    },
    navLeft: {
        display: "flex",
        flexFlow: "row nowrap",
        height: "4rem",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: "0 1 " + theme.functions.rems(600),
        paddingLeft: theme.spacing(2)
    },
    navRight: {
        height: "4rem",
        marginLeft: "1.5rem",
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-end",
        flex: "0 0 " + theme.functions.rems(350),
        alignItems: "center",
        paddingRight: theme.spacing(2)
    },
    navButton: {
        margin: theme.spacing(0, 0.5)

        //   padding: theme.spacing(1)
    },
    navButtonLabel: {
        ...theme.typography.h5
    },
    buttonGroup: {
        display: "flex"
    },
    iconButtonSm: {
        //  padding: theme.spacing(1, 1),
        //  fontSize: "1rem",
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.14),
        margin: theme.spacing(0, 0.5)
    },
    iconSm: {
        color: theme.functions.rgba(theme.palette.common.white, 0.7)
    },
    menuIcon: {
        backgroundColor: theme.functions.rgba(theme.palette.primary.light, 0.8),
        height: "3rem",
        width: "3rem",
        borderRadius: "50%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem"
    },
    menuIconInner: {
        color: "white",
        fill: "white",
        height: "2rem",
        width: "2rem"
    }
}));

const ActivityBar = dynamic(() => import("../ActivityBar/ActivityBar"), { ssr: false });

const MainNav = ({ invert, elevated }) => {
    const router = useRouter();
    const classes = useStyles();
    const {
        auth,
        sidebar,
        popups: { account, hosting, feedback }
    } = useApp();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const [showNavMenu, setShowNavMenu] = useState(false);
    const [roomCodePopoverOpen, setRoomCodePopoverOpen] = useState(false);
    const [activityBarPopoverOpen, setActivityBarPopoverOpen] = useState(false);

    const { isExtensionInstalled, openSidebar } = useExtension();
    const startButtonRef = useRef();
    const tvButtonRef = useRef();
    const joinButtonRef = useRef();
    const loginButtonRef = useRef();
    const activityButtonRef = useRef();
    const buttonRef = useRef();
    const handleRouteChange = useCallback(() => {
        setActivityBarPopoverOpen(false);
    }, [activityBarPopoverOpen]);
    useEffect(() => {
        router.events.on("routeChangeComplete", handleRouteChange);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, []);

    const onAccountButtonClicked = () => {
        if (auth.loggedIn) {
            goToUserProfile();
        } else {
            account.show(true, { initialView: "login", anchorEl: loginButtonRef.current });
        }
    };

    const goToUserProfile = (otheruser) => {
        if (otheruser && otheruser.username) {
            router.push("/[username]", "/" + otheruser.username, { prefetch: false });
        } else {
            if (auth && auth.user && auth.user.username) {
                router.push("/[username]", "/" + auth.user.username, { prefetch: false });
            }
        }
    };

    const onFeedback = () => {
        if (isExtensionInstalled) {
            feedback.show(true);
        } else {
            feedback.show(true);
        }
    };

    const getMenu = useCallback(() => {
        let items = [];
        if (isXs) {
            items.push(
                <MenuItem disabled divider key="divider">
                    {auth.user.username}
                </MenuItem>,
                <MenuItem
                    key="profile"
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
                </MenuItem>,
                <MenuItem
                    key="host"
                    onClick={() => {
                      isMobile() ? router.push("/mobile", "/mobile") : (
                        auth.user && auth.user.username
                            ? router.push("/get", "/get")
                            : account.show(true, {
                                  initialView: "signup",
                                  anchorEl: startButtonRef.current,
                                  message: "Log in to continue.",
                                  onFinished: () => router.push("/host", "/host")
                              }));
                        setShowNavMenu(false);
                    }}
                >
                    <ListItemIcon>
                        <div className={classes.menuIcon}>
                            <TVIcon className={classes.menuIconInner} />
                        </div>
                    </ListItemIcon>
                    Get Scener
                </MenuItem>
            );
        }

        items.push(
            <MenuItem
                key="feedback"
                onClick={() => {
                    onFeedback();
                    setShowNavMenu(false);
                }}
            >
                <ListItemIcon>
                    <div className={classes.menuIcon}>
                        <FeedbackIcon className={classes.menuIconInner} />
                    </div>
                </ListItemIcon>
                Give Feedback
            </MenuItem>,
            <MenuItem
                key="help"
                onClick={() => {
                    router.push("/faq", "/faq");
                    setShowNavMenu(false);
                }}
            >
                <ListItemIcon>
                    <div className={classes.menuIcon}>
                        <HelpIcon className={classes.menuIconInner} />
                    </div>
                </ListItemIcon>
                FAQ
            </MenuItem>
        );
        if (auth.loggedIn) {
            items.push(
                <MenuItem
                    key="logout"
                    onClick={() => {
                        auth.logout();
                        setShowNavMenu(false);
                        account.show(true, { initialView: "login", message: "You've been signed out.", skipFinish: true });
                    }}
                >
                    <ListItemIcon>
                        <div className={classes.menuIcon}>
                            <SignOutIcon className={classes.menuIconInner} />
                        </div>
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            );
        }
        return items;
    }, [isXs, auth]);

    return (
        <>
            <Container maxWidth="md" fixed disableGutters>
                <Toolbar className={elevated ? classes.navBarElevated : classes.navBar} variant="dense" disableGutters>
                    <div className={classes.navLeft}>
                        <div className={classes.logo}>
                            <NavLink href="/">
                                <a>
                                    <img src={config.WORDMARK} />
                                </a>
                            </NavLink>
                        </div>
                        <div className={classes.buttons} ref={loginButtonRef}>
                            <Hidden smDown>
                                <NavLink href="/about" passHref>
                                    <Button color="inherit" classes={{ root: classes.navButton, label: classes.navButtonLabel }}>
                                        About
                                    </Button>
                                </NavLink>
                                <NavLink href="/faq" passHref>
                                    <Button color="inherit" classes={{ root: classes.navButton, label: classes.navButtonLabel }}>
                                        FAQ
                                    </Button>
                                </NavLink>
                                <Button
                                    color="inherit"
                                    href="https://community.scener.com"
                                    classes={{ root: classes.navButton, label: classes.navButtonLabel }}
                                >
                                    Blog
                                </Button>
                            </Hidden>
                            <Hidden xsDown>
                                {auth.loggedIn ? (
                                    <IconButton
                                        onClick={onAccountButtonClicked}
                                        classes={{ root: classes.navButton }}
                                        {...addTracking("Navbar", "click", "Account")}
                                    >
                                        <UserAvatar user={auth.user} style={{ height: "2rem", width: "2rem" }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        classes={{ root: classes.navButton, label: classes.navButtonLabel }}
                                        onClick={() =>
                                            account.show(true, {
                                                initialView: "login",
                                                anchorEl: loginButtonRef.current,
                                                onFinished: (u) => {
                                                    goToUserProfile(u);
                                                    console.log("GO TO PROFILE", u);
                                                    account.show(false);
                                                }
                                            })
                                        }
                                        {...addTracking("Navbar", "click", "Log In")}
                                    >
                                        Log In
                                    </Button>
                                )}
                            </Hidden>

                            <Hidden mdUp xsDown>
                                <IconButton
                                    className={classes.iconButtonSm}
                                    ref={tvButtonRef}
                                    onClick={() =>
                                        auth.user && auth.user.username
                                            ? router.push("/host", "/host")
                                            : account.show(true, {
                                                  initialView: "signup",
                                                  anchorEl: tvButtonRef.current,
                                                  message: "Log in to continue.",
                                                  onFinished: () => router.push("/host", "/host")
                                              })
                                    }
                                    {...addTracking("Navbar", "click", "Open Hosting")}
                                >
                                    <TVIcon classes={{ root: classes.iconSm }} />
                                </IconButton>
                            </Hidden>

                            <Hidden mdUp>
                                <IconButton
                                    className={classes.iconButtonSm}
                                    ref={activityButtonRef}
                                    onClick={() => setActivityBarPopoverOpen(true)}
                                    {...addTracking("Navbar", "click", "Open Activity Bar")}
                                >
                                    <ActivityBarIcon classes={{ root: classes.iconSm }} />
                                </IconButton>
                            </Hidden>
                            <Hidden mdUp>
                                <IconButton
                                    ref={buttonRef}
                                    className={classes.iconButtonSm}
                                    onClick={() => setShowNavMenu(true)}
                                    {...addTracking("Navbar", "click", "Open Menu")}
                                >
                                    <MenuIcon classes={{ root: classes.iconSm }} />
                                </IconButton>
                            </Hidden>
                        </div>{" "}
                    </div>
                    <Hidden smDown>
                        <div className={classes.navRight}>
                            {!sidebar?.state?.roomId && (
                                <Button
                                    color="default"
                                    variant="outlined"
                                    classes={{ root: classes.navButton }}
                                    ref={joinButtonRef}
                                    fullWidth
                                    onClick={() => setRoomCodePopoverOpen(true)}
                                    {...addTracking("Navbar", "click", "Have a Code?")}
                                >
                                    Have a Code?
                                </Button>
                            )}
                            {sidebar?.state?.roomId ? (
                                <Button
                                    fullWidth
                                    ref={startButtonRef}
                                    variant={"contained"}
                                    color={"secondary"}
                                    onClick={() => openSidebar()}
                                    {...addTracking("Navbar", "click", "Return to Watch Party")}
                                >
                                    Return to Watch Party
                                </Button>
                            ) : (
                                <GetScenerButton
                                    buttonRef={startButtonRef}
                                    invert={invert}
                                    fullWidth
                                    style={{ marginLeft: "1rem" }}
                                    source="Navbar"
                                />
                            )}
                        </div>
                    </Hidden>
                </Toolbar>
                <NavPopup
                    open={showNavMenu}
                    anchorEl={buttonRef.current}
                    onDismiss={() => setShowNavMenu(false)}
                    dialog={isXs}
                    //  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    //  transformOrigin={{ horizontal: "right", vertical: "top" }}
                >
                    <>
                        {!isXs && <RoomCode dense />}
                        <MenuList>{getMenu()}</MenuList>
                    </>
                </NavPopup>

                <NavPopup
                    dialog={isXs}
                    hideLogo
                    open={activityBarPopoverOpen}
                    onDismiss={() => setActivityBarPopoverOpen(false)}
                    anchorEl={activityButtonRef.current}
                    disablePadding
                    gradient
                >
                    <ActivityBar />
                </NavPopup>
                <NavPopup open={roomCodePopoverOpen} onDismiss={() => setRoomCodePopoverOpen(false)} anchorEl={joinButtonRef.current}>
                    <RoomCode />
                </NavPopup>
            </Container>
        </>
    );
};

export default MainNav;
