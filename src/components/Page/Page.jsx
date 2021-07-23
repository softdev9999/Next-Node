import classnames from "classnames";
import { Container, makeStyles, useMediaQuery, useTheme, Dialog, IconButton } from "@material-ui/core";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScenerThemeProvider from "theme/ScenerThemeProvider";
import { useRef } from "react";
import { useApp } from "hooks/Global/GlobalAppState";
import { useRouter } from "next/router";
import EditAccountPopup from "../EditAccountPopup/EditAccountPopup";
import NavPopup from "../NavPopup/NavPopup";
import RoomType from "../StartSteps/RoomType";
import AccountPopup from "../AccountPopup/AccountPopup";
import ErrorCard from "../ErrorView/ErrorCard";
import StartCard from "../SplitCard/StartCard";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import DeleteAccount from "../AccountScreens/DeleteAccount";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
import AddEvent from "../Event/AddEvent";
import FeedbackPopup from "../Report/FeedbackPopup";
import dynamic from "next/dynamic";
const ActivityBar = dynamic(() => import("components/ActivityBar/ActivityBar"), { ssr: false });

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundAttachment: "scroll",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top"
    },
    main: {
        width: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        flex: "1 1 100%",
        display: "flex",
        flexFlow: "row nowrap",
        position: "relative",
        justifyContent: "flex-start"
        // padding: 0
    },

    activityDrawerContainer: {
        marginLeft: theme.spacing(1.5),
        width: theme.functions.rems(350),
        flex: "0 0 " + theme.functions.rems(350),
        height: "auto",
        position: "relative"
    },
    activityDrawer: {
        position: "sticky",
        top: theme.functions.rems(80),
        marginBottom: "5rem",
        height: "auto",
        width: "100%",
        backgroundImage: theme.gradients.create(
            217,
            theme.functions.rgba(theme.palette.scener.blackberry, 0.3),
            theme.functions.rgba(theme.palette.scener.gradientDark, 0.3)
        ),
        minHeight: "70vh",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderRadius: "1rem",
        overflow: "hidden"
    },
    mainContainer: {
        height: "auto",
        position: "relative",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "100vw"
    },
    mainContainerWidthMd: {
        maxWidth: theme.functions.rems(600),
        flex: "0 0 " + theme.functions.rems(600)
    },
    mainContainerWidthLg: {
        maxWidth: theme.functions.rems(725),
        flex: "0 0 " + theme.functions.rems(725),
        marginLeft: theme.spacing(-15),
        transition: theme.transitions.create(),
        [theme.breakpoints.down("lg")]: {
            marginLeft: theme.spacing(0),
            maxWidth: theme.functions.rems(600),
            flex: "0 0 " + theme.functions.rems(600),
            transition: theme.transitions.create()
        },
        [theme.breakpoints.down("md")]: {
            flex: "0 1 " + theme.functions.rems(600),
            marginLeft: theme.spacing(0),
            transition: theme.transitions.create()
        }
    },
    mainContainerDrawer: {
        marginRight: theme.spacing(1.5)
    },
    mainContainerNoDrawer: {
        flexShrink: 1,
        marginLeft: "auto",
        marginRight: "auto"
    },
    mainContainerFullWidth: {
        maxWidth: "100%",
        flex: "0 0 100%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    mainContainerWidthSm: {
        maxWidth: theme.functions.rems(390),
        flex: "0 0 " + theme.functions.rems(390),
        [theme.breakpoints.between(720, 976)]: {
            maxWidth: theme.functions.rems(660),
            flex: "0 0 " + theme.functions.rems(660)
        }
    },
    mainInner: {
        flex: "1 1 0%",
        width: "100%",
        display: "flex",
        justifyContent: "stretch",
        flexFlow: "column nowrap"
    },
    flexAuto: {
        flex: "inherit"
    },
    closeButtonRoot: {
        position: "absolute",
        right: "-2.5rem",
        top: "-2.5rem"
    },
    popoverPaper: {
        padding: 0,
        borderRadius: 0,
        background: theme.gradients.create("47.52", `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 80%`)
    },
    dismissButton: {
        top: theme.spacing(1.3)
    },
    dialogPaper: {
        padding: theme.spacing(2, 0)
    }
}));

function PageWrapper({
    children,
    hideFooter,
    hideInnerFlex,
    hideHeader,
    showActivityDrawer,
    fullWidth = false,
    halfWidth = false,
    maxWidth = "md",
    background,
    backgroundLayer,
    containerClassName,
    stickyFooter = true
}) {
    const classes = useStyles();
    const containerRef = useRef();
    const theme = useTheme();
    const router = useRouter();
    const hideActivityBar = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        auth,
        sidebar: { channel },
        popups: { account, hosting, addScener, editProfile, deleteAccount, confirmation, addEvent, feedback, error }
    } = useApp();
    useEffect(() => {
        if (channel) {
            channel.postMessage({ name: "connected" });
            window.addEventListener("focus", () => {
                channel.postMessage({ name: "connected" });
            });
            window.addEventListener("scenererror", () => {
                error.show(true);
            });
            return () => {
                window.removeEventListener("focus", () => {
                    channel.postMessage({ name: "connected" });
                });
                window.removeEventListener("scenererror", () => {
                    error.show(true);
                });
            };
        }
    }, [channel]);

    return (
        <ScenerThemeProvider>
            <div
                id="container"
                className={classnames(classes.container, containerClassName)}
                style={background ? { backgroundImage: "url(" + background + ")" } : null}
            >
                {!hideHeader && <Header maxWidth={"lg"} />}
                <Container maxWidth={fullWidth ? false : "md"} className={classes.main} ref={containerRef} component="main" disableGutters>
                    {backgroundLayer}
                    <div
                        className={classnames(classes.mainContainer, {
                            [classes.mainContainerDrawer]: showActivityDrawer && !hideActivityBar && !fullWidth,
                            [classes.mainContainerNoDrawer]: (!showActivityDrawer || hideActivityBar) && !fullWidth,
                            [classes.mainContainerWidthLg]: maxWidth == "lg" && !fullWidth,
                            [classes.mainContainerWidthMd]: maxWidth == "md" && !fullWidth,
                            [classes.mainContainerFullWidth]: fullWidth || !showActivityDrawer,
                            [classes.mainContainerWidthSm]: halfWidth && !fullWidth
                        })}
                    >
                        <div
                            className={classnames(classes.mainInner, {
                                [classes.flexAuto]: hideInnerFlex
                            })}
                        >
                            {children}
                        </div>
                        {!hideFooter && <Footer sticky={!hideInnerFlex && stickyFooter} />}
                    </div>
                    {showActivityDrawer && !hideActivityBar && (
                        <div className={classes.activityDrawerContainer}>
                            <div className={classes.activityDrawer}>
                                <ActivityBar />
                            </div>
                        </div>
                    )}
                </Container>
            </div>
            <EditAccountPopup
                open={!!editProfile.open}
                defaultTab={editProfile.defaultTab}
                onClose={() => editProfile.show(false)}
                {...editProfile.options}
            />
            <NavPopup
                disablePadding
                classes={{ paper: classes.dialogPaper }}
                dialog={!(hosting.options && hosting.options.anchorEl)}
                anchorEl={hosting.options && hosting.options.anchorEl}
                open={!!hosting.open}
                onDismiss={() => hosting.show(false)}
            >
                <RoomType
                    {...hosting.options}
                    onSchedule={(url) => addEvent.show(true, { anchorEl: hosting.options && hosting.options.anchorEl, url: url })}
                />
            </NavPopup>

            <NavPopup
                classes={{
                    paper: classes.popoverPaper
                }}
                open={!!account.open}
                dialog={!(account.options && account.options.anchorEl)}
                anchorEl={account.options && account.options.anchorEl}
                dismissStyle={classes.dismissButton}
                onDismiss={(result) => {
                    if (result == "host") {
                        hosting.show(true);
                    } else if (result == "profile") {
                        router.push("/[username]", "/" + auth.user.username);
                    }
                    if (account.options && account.options.onDismiss) {
                        account.options.onDismiss(result);
                    }
                    account.show(false);
                }}
            >
                <AccountPopup {...account.options} />
            </NavPopup>
            <NavPopup
                open={!!confirmation.open}
                dialog={!(confirmation.options && confirmation.options.anchorEl)}
                anchorEl={confirmation.options && confirmation.options.anchorEl}
                onDismiss={(result) => {
                    confirmation.show(false);
                    confirmation.options && confirmation.options.onFinished && confirmation.options.onFinished(result);
                }}
            >
                <ConfirmationPopup {...confirmation.options} />
            </NavPopup>
            <Dialog
                maxWidth="lg"
                open={!!addScener.open}
                onClose={() => {
                    addScener.show(false);
                }}
                PaperProps={{ style: { padding: 0, overflow: "visible" } }}
            >
                <IconButton classes={{ root: classes.closeButtonRoot }} onClick={() => addScener.show(false)}>
                    <CloseIcon />
                </IconButton>
                <StartCard {...addScener.options} />
            </Dialog>
            <Dialog
                maxWidth="lg"
                fullScreen={hideActivityBar}
                open={!!deleteAccount.open}
                onClose={() => {
                    deleteAccount.show(false);
                }}
                PaperProps={{ style: { padding: 0, overflow: "visible" } }}
            >
                <DeleteAccount />
            </Dialog>
            <NavPopup
                open={!!addEvent.open}
                logo={false}
                PaperProps={{ style: { width: "30rem" } }}
                dialog={!(addEvent.options && addEvent.options.anchorEl)}
                anchorEl={addEvent.options && addEvent.options.anchorEl}
                onDismiss={(result) => {
                    addEvent.show(false);
                    addEvent.options && addEvent.options.onFinished && addEvent.options.onFinished(result);
                }}
            >
                <AddEvent withCode="" onDismiss={() => addEvent.show(false)} {...confirmation.options} />
            </NavPopup>
            <Dialog maxWidth="xl" disableBackdropClick open={!!error.open} PaperProps={{ style: { padding: 0, overflow: "visible" } }}>
                <ErrorCard />
            </Dialog>
            <FeedbackPopup visible={!!feedback.open} onDismiss={() => feedback.show(false)} />
        </ScenerThemeProvider>
    );
}

export default PageWrapper;
