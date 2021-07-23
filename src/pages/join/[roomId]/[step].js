import classname from "classnames";
import Head from "next/head";
import PageWrapper from "components/Page/Page";
import AVWizard from "components/StartSteps/AVWizard";
import { Scener } from "components/Icon/Icon";

import { makeStyles, Grid, Container, Typography, CircularProgress, Button, Toolbar, Divider } from "@material-ui/core";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import useSWR from "swr";
import { useExtension } from "hooks/Extension/Extension";
import { Settings } from "hooks/Settings/Settings";
import config from "../../../config";
import GetExtensionCard from "components/SplitCard/GetExtensionCard";
import { isChrome, isMobile } from "utils/Browser";
import AddEvent from "components/Event/AddEvent";
import GetChromeCard from "components/SplitCard/GetChromeCard";
import withAppState from "components/Page/withAppState";
import { useApp } from "hooks/Global/GlobalAppState";
import SchedulelaterStars from "components/SplitCard/svg/Schedulelater_Stars.svg";
import JoinButton from "components/Join/JoinButton";

const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.common.black
    },
    contentContainer: {
        height: "100%",
        padding: theme.spacing(6),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    background: {
        backgroundImage: `url(/images/cards/Readytowatch.png)`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "calc(100% - 100px)",
        padding: theme.spacing(16),
        height: theme.functions.rems(448)
    },
    backgroundPadder: {
        padding: theme.spacing(0, 10, 6)
    },
    backgroundGradient: {
        background: theme.gradients.create(
            224.46,
            theme.functions.rgba(theme.palette.secondary.light, 0.8),
            theme.functions.rgba(theme.palette.primary.dark, 0.8)
        ),
        paddingBottom: theme.spacing(3)
    },
    primary: {
        fontSize: theme.functions.rems(40),
        fontWeight: "bold",
        lineHeight: theme.functions.rems(42),
        letterSpacing: 0
    },
    button: {
        minWidth: theme.functions.rems(250)
    },
    headerContainer: {},
    headerTitle: {
        fontSize: theme.functions.rems(20),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(20),
        fontWeight: "bold"
    },
    divider: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)"
    },
    actionButtonContainer: {
        "& > button:first-child": {
            width: "40%"
        },
        "& > button:last-child": {
            width: "55%"
        }
    }
}));

function JoinStepsPage({ room: roomData }) {
    const classes = useStyles();
    const router = useRouter();
    const {
        sidebar,
        auth: { userId, loggedIn }
    } = useApp();
    const {
        mediaState: { videoEnabled, audioEnabled },
        lastUpdated
    } = useMedia();
    const {
        query: { roomId, step }
    } = router;
    const { isExtensionInstalled, openSidebar, needsUpdate } = useExtension();
    const roomSettings = Settings("RoomSettings:" + roomId);
    const { data: room } = useSWR("/rooms/" + roomId, { initialData: roomData });
    const mobile = useMemo(() => isMobile(), []);
    const onChrome = useMemo(() => isChrome(), []);
    const onFinishedAVSetup = () => {
        if (room.member) {
            Promise.all([roomSettings.setItem("videoEnabled", videoEnabled), roomSettings.setItem("audioEnabled", audioEnabled)]).then(() => {
                openRoom();
            });
        }
    };

    const openRoom = () => {
        console.log(sidebar);
        if (room && room.id && room.member) {
            router.push("/join/[roomId]/[step]", "/join/" + room.id + "/ready", { shallow: true });
            if (!sidebar || !sidebar.state || sidebar.state.roomId != room.id) {
                openSidebar({
                    serviceUrl: config.getStartUrl() + "loading",
                    sidebarUrl: config.getSidebarUrl(room.id)
                });
            } else {
                openSidebar();
            }
        }
    };

    useEffect(() => {
        console.log({ isExtensionInstalled });
        if (isExtensionInstalled !== null) {
            if (step == "extension" && isExtensionInstalled && !needsUpdate) {
                if (room && room.member) {
                    if (room.member.role != "audience") {
                        router.push("/join/[roomId]/[step]", "/join/" + roomId + "/camera", { shallow: true });
                    } else {
                        router.push("/join/[roomId]/[step]", "/join/" + roomId + "/ready", { shallow: true });
                    }
                } else if (roomId && room.type == "public") {
                    router.push("/join/[roomId]/[step]", "/join/" + roomId + "/ready", { shallow: true });
                } else {
                    router.push("/join/[roomId]", "/join/" + roomId, { shallow: true });
                }
            } else if (step != "extension" && (!isExtensionInstalled || needsUpdate) && !mobile && onChrome) {
                router.push("/join/[roomId]/[step]", "/join/" + roomId + "/extension", { shallow: true });
            } else if (mobile && step != "mobile") {
                router.push("/join/[roomId]/[step]", "/join/" + roomId + "/mobile", { shallow: true });
            } else if (!mobile && step != "chrome" && !onChrome) {
                router.push("/join/[roomId]/[step]", "/join/" + roomId + "/chrome", { shallow: true });
            }
        }
    }, [step, room, mobile, onChrome, isExtensionInstalled, needsUpdate, loggedIn]);

    useEffect(() => {
        if (videoEnabled) {
            roomSettings.setItem("videoEnabled", true);
        } else if (videoEnabled === false) {
            roomSettings.setItem("videoEnabled", false);
        }
        if (audioEnabled) {
            roomSettings.setItem("audioEnabled", true);
        } else if (audioEnabled === false) {
            roomSettings.setItem("audioEnabled", false);
        }
    }, [lastUpdated]);

    const getTitle = useCallback(() => {
        switch (step) {
            case "camera": {
                return "Camera settings";
            }

            case "mobile": {
                return "Get Google Chrome";
            }
            case "extension": {
                return "Add Scener extension";
            }
            case "chrome": {
                return "Get Google Chrome";
            }
            case "error": {
                return "Error";
            }
            case "loading": {
                return "Loading...";
            }
            case "ready": {
                return "Ready";
            }
            case "schedule": {
                return "Schedule a live watch party";
            }
            default: {
                return "Loading.....";
            }
        }
    }, [step]);

    const getStep = useCallback(() => {
        switch (step) {
            case "camera": {
                return (
                    <Container disableGutters maxWidth="md" className={classes.contentContainer}>
                        <AVWizard onFinished={onFinishedAVSetup} finishedTitle="DONE" autostart />
                    </Container>
                );
            }
            case "ready": {
                return (
                    <Container disableGutters maxWidth="md" className={classname(classes.contentContainer, classes.background)}>
                        <Grid container spacing={2} alignContent="center">
                            <Grid item xs={12}>
                                <Typography variant="h1" gutterBottom className={classes.primary}>
                                    Ready <br /> to watch?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <JoinButton
                                    autoOpen={room.type == "private" || room.ownerId == userId}
                                    width={"16rem"}
                                    type={room.type}
                                    roomId={room.id}
                                    roomCode={room.code}
                                    title={"Launch watch party"}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                );
            }
            case "chrome": {
                return (
                    <Container disableGutters maxWidth="md" className={classes.contentContainer}>
                        <GetChromeCard />
                    </Container>
                );
            }
            case "extension": {
                return (
                    <Container disableGutters maxWidth="md" className={classes.contentContainer}>
                        <GetExtensionCard />
                    </Container>
                );
            }
            case "schedule": {
                return (
                    <Container disableGutters maxWidth="md" className={classname(classes.contentContainer, classes.backgroundPadder)}>
                        <SchedulelaterStars style={{ position: "absolute", right: 0, top: 0, transform: "translate(-10%, 12%) scale(1)" }} />
                        <Grid container className={classes.backgroundGradient}>
                            <Grid item xs={12}>
                                <div className={classes.headerContainer}>
                                    <Toolbar className={classes.toolbar}>
                                        <Typography component="h2" className={classes.headerTitle}>
                                            Schedule a live watch party
                                        </Typography>
                                    </Toolbar>
                                    <Divider component="div" className={classes.divider} />
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <AddEvent withCode="" hideTitle bottomClassname={classes.actionButtonContainer} />
                            </Grid>
                        </Grid>
                    </Container>
                );
            }
            default: {
                return (
                    <Grid container spacing={2} justify="center" alignContent="center">
                        <Grid item>
                            <CircularProgress color="inherit" size={"10vh"} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h2" align="center">
                                <Scener style={{ position: "relative", top: "2rem", width: "5rem", height: "5rem" }} /> loading...
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }
        }
    }, [step, room, audioEnabled, videoEnabled, isExtensionInstalled]);

    return (
        <PageWrapper containerClassName={classname({ [classes.container]: step === "camera" && room })} showActivityDrawer={false}>
            <Head>
                <title>Scener – {getTitle()}</title>
            </Head>
            {!room ? (
                <Container disableGutters maxWidth="md" className={classes.contentContainer}>
                    <Grid container justify="center" alignContent="center">
                        <Grid item>
                            <CircularProgress color="inherit" size={"10vh"} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h2" align="center" style={{ animation: "pulse-50 2s infinite linear" }}>
                                <Scener style={{ position: "relative", top: "2rem", width: "5rem", height: "5rem" }} /> loading...
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            ) : (
                getStep()
            )}
        </PageWrapper>
    );
}
export default withAppState(JoinStepsPage);

export function getServerSideProps(context) {
    return {
        props: { room: null, query: context.query }
    };
}
