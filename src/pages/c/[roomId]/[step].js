import classname from "classnames";
import Head from "next/head";
import PageWrapper from "components/Page/Page";
import AVWizard from "components/StartSteps/AVWizard";
import RoomServiceSelect from "components/StartSteps/RoomServiceSelect";
import ServicePermissions from "components/StartSteps/ServicePermissions";
import { Scener } from "components/Icon/Icon";

import { makeStyles, Grid, Container, Typography, CircularProgress, Button } from "@material-ui/core";
import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import config from "../../../config";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import useBroadcastChannel from "hooks/useBroadcastChannel/useBroadcastChannel";
import useSWR from "swr";
import { useExtension } from "hooks/Extension/Extension";
import { useSettings } from "hooks/Settings/Settings";

import SyncProblemIcon from "@material-ui/icons/SyncProblem";
import OfflineIcon from "@material-ui/icons/VoiceOverOff";
import LoginCard from "components/SplitCard/LoginCard";
import CreateAccountCard from "components/SplitCard/CreateAccountCard";
import withAppState from "components/Page/withAppState";
const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.common.black
    }
}));
function LiveStartPage({ query: { roomId, url, setting } }) {
    const classes = useStyles();
    const router = useRouter();
    const {
        mediaState: { videoEnabled, audioEnabled }
    } = useMedia();

    const {
        query: { step }
    } = router;

    const [service, setService] = useState(null);

    const { data: room } = useSWR("/rooms/" + roomId);
    const { country } = useExtension();
    const settings = useSettings();

    const { postMessage } = useBroadcastChannel({ name: "TheaterSetup" });


    const onFinishedAVSetup = () => {
        if (room.member) {
            postMessage({
                name: "AVSetupFinished",
                mediaState: {
                    audioEnabled,
                    videoEnabled
                }
            });

            if (room.member.role == "owner") {
                if (url) {
                    setService(url);
                    router.push("/c/permissions/[service]", "/c/permissions/" + service + "?url=" + url, { shallow: true });
                } else {
                    router.push("/c/[roomId]/[step]", "/c/" + roomId + "/finished", { shallow: true });
                }
            } else {
                router.push("/c/permissions/[service]", "/c/permissions/" + service, { shallow: true });
            }
        }
    };

    const getTitle = useCallback(() => {
        switch (step) {
            case "camera": {
                return "Camera Settings";
            }
            case "service": {
                return "Select a Service";
            }
            case "permissions": {
                return "Permissions";
            }
            case "login": {
                return "Log In";
            }
            case "signup": {
                return "Create Account";
            }
            case "error": {
                return "Error";
            }
            case "waiting": {
                return "Waiting for Host";
            }
            case "loading": {
                return "Loading...";
            }
            case "finished": {
                return "Loading....";
            }
            default: {
                return "Loading.....";
            }
        }
    }, [step]);

    const getStep = useCallback(() => {
        switch (step) {
            case "camera": {
                return <AVWizard onFinished={onFinishedAVSetup} finishedTitle="NEXT" />;
            }
            case "login": {
                return <LoginCard />;
            }
            case "signup": {
                return <CreateAccountCard />;
            }
            case "error": {
                return (
                    <Grid container spacing={2} style={{ height: "100vh", minHeight: "100vh" }} justify="center" alignContent="center">
                        <Grid item>
                            {room ? (
                                <SyncProblemIcon
                                    color="inherit"
                                    style={{ opacity: "0.6", fontSize: "8rem", animation: "punch 2s infinite linear" }}
                                />
                            ) : (
                                <OfflineIcon olor="inherit" style={{ fontSize: "8rem", animation: "punch 2s infinite linear" }} />
                            )}
                        </Grid>
                        <Grid container justify="center" style={{ marginTop: "3rem" }}>
                            <Button variant="contained" color="primary" style={{ padding: "1rem", width: "10rem" }}>
                                Try Again
                            </Button>
                        </Grid>
                    </Grid>
                );
            }
            case "waiting": {
                return room.owner && room.owner.wallImageUrl ? (
                    <Grid container spacing={0} style={{ height: "100vh", minHeight: "100vh" }} justify="center" alignContent="center">
                        <Grid
                            item
                            xs={12}
                            container
                            alignItems="center"
                            justify="center"
                            direction="column"
                            style={{ position: "absolute", bottom: "15%" }}
                        >
                            <Typography variant="h1" align="center" style={{ animation: "pulse-50 2s infinite linear" }}>
                                <Scener style={{ position: "relative", top: "2rem", width: "5rem", height: "5rem" }} /> waiting{" "}
                                {room.owner && room.owner.username ? "for " + room.owner.username : "for host"}
                                {service ? " to pick a show" : "..."}
                            </Typography>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={0} justify="center" alignItems="center" alignContent="center">
                        <Grid item xs={12}>
                            <img src={config.WORDMARK} style={{ height: "6rem", width: "auto" }} />
                        </Grid>
                        <Grid item xs={12} container alignItems="center" justify="center" direction="row">
                            <Typography variant="h1" align="center" style={{ width: "40%", animation: "pulse-50 2s infinite linear" }}>
                                waiting for host to pick a show
                            </Typography>
                            <img src="/images/alien-couch-rocket-transparent.png" style={{ height: "auto", width: "50%" }} />
                        </Grid>
                    </Grid>
                );
            }
            default: {
                return (
                    <Grid container spacing={2} style={{ height: "100vh", minHeight: "100vh" }} justify="center" alignContent="center">
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
    }, [step, room, audioEnabled, videoEnabled]);

    return (
        <PageWrapper
            containerClassName={classname({ [classes.container]: step === "camera" && room })}
            hideFooter={true}
            hideHeader={true}
            fullWidth={step == "waiting" || step == "service"}
        >
            <Head>
                <title>Scener – {getTitle()}</title>
            </Head>
            <Container
                disableGutters
                style={
                    step == "waiting"
                        ? {
                              padding: "3rem",
                              backgroundImage: `url(${room && room.owner && room.owner.wallImageUrl ? room.owner.wallImageUrl : ""})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center center",
                              width: "100vw",
                              height: "100vh",
                              overflow: "hidden"
                          }
                        : { padding: "3rem", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }
                }
                maxWidth={step != "waiting" && step != "service" ? "md" : false}
            >
                {!room ? (
                    <Grid container spacing={2} style={{ height: "100vh", minHeight: "100vh" }} justify="center" alignContent="center">
                        <Grid item>
                            <CircularProgress color="inherit" size={"10vh"} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h2" align="center" style={{ animation: "pulse-50 2s infinite linear" }}>
                                <Scener style={{ position: "relative", top: "2rem", width: "5rem", height: "5rem" }} /> loading...
                            </Typography>
                        </Grid>
                    </Grid>
                ) : (
                    getStep()
                )}
            </Container>
        </PageWrapper>
    );
}

export default withAppState(LiveStartPage);

export function getServerSideProps(context) {
    /*  const { verifyAuthorizationCookie } = require("lib/auth");
    const { getParticipant, getRoom } = require("lib/room");
    const { getUser } = require("lib/user");

    let roomId = context.params.roomId;
    // username of user to show
    // need to pull actual user info out of db to statically render for seo purposes
    let id = null;
    try {
        let auth = verifyAuthorizationCookie(context);
        id = auth.id;
    } catch (e) {
        id = null;
    }
    try {
        if (roomId && id) {
            let room = await getRoom(roomId);
            room.owner = await getUser(room.ownerId, true);
            room.member = await getParticipant(roomId, id);
            console.log(room);
            return {
                props: JSON.parse(JSON.stringify({ room, query: context.query }))
            };
        } else {
            throw "Room id missing";
        }
    } catch (e) {
        console.error(e);*/
    return {
        props: { room: {}, query: context.query }
    };
    //  }
}
