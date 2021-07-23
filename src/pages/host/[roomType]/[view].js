import Head from "next/head";
import Page from "components/Page/Page";
import OpenGraph from "components/OpenGraph/OpenGraph";
import { isChrome, isMobile } from "utils/Browser";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import CreateAccountCard from "components/SplitCard/CreateAccountCard";
import LoginCard from "components/SplitCard/LoginCard";
import { useApp } from "hooks/Global/GlobalAppState";
import { useExtension } from "hooks/Extension/Extension";
import useAPI from "utils/useAPI";
import GetExtensionCard from "components/SplitCard/GetExtensionCard";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.scener.eclipse
    }
}));


function HostStepsPage() {
    const classes = useStyles();
    const router = useRouter();
    const {
        auth: { loggedIn },
        popups: { account }
    } = useApp();
    const { host, schedule } = useAPI();
    const { isExtensionInstalled, needsUpdate } = useExtension();
    const {
        query: { view, roomType }
    } = router;
    const { unlisted, contentId, passcode } = router.query;
    const getPageTitle = () => {
        return "Scener – Host a watch party";
    };
    const mobile = useMemo(() => isMobile(), []);
    const onChrome = useMemo(() => isChrome(), []);
    const extensionReady = useMemo(() => isExtensionInstalled && !needsUpdate, [isExtensionInstalled, needsUpdate]);
    const next = (user) => {
        if (roomType != "schedule" && extensionReady) {
            host({ contentId, roomType, unlisted, passcode }, {}, true);
            router.push("/host/[roomType]/[view]", { pathname: `/host/${roomType}/creating`, query: { contentId } }, { shallow: true });
        } else if (roomType == "schedule") {
            schedule(contentId, {}, user);
        }
    };
    //use roomCode if we want to load dynamic data
    useEffect(() => {
        if (mobile) {
            router.replace("/mobile");
        } else if (!onChrome) {
            router.replace("/chrome");
        }
    }, []);

    useEffect(() => {
        if (["public", "private", "schedule"].indexOf(roomType) == -1) {
            router.replace("/host");
        }
    }, [roomType]);

    useEffect(() => {
        if (view !== "creating") {
            if (view !== "signup" && view !== "login" && !loggedIn) {
                router.push("/host/[roomType]/[view]", `/host/${roomType}/signup`, { shallow: true });
            } else if (loggedIn && view !== "extension" && !extensionReady) {
                router.push("/host/[roomType]/[view]", `/host/${roomType}/extension`, { shallow: true });
            } else if (view == "extension" && extensionReady) {
                router.push("/host/[roomType]/[view]", `/host/${roomType}/loading`, { shallow: true });
                next();
            }
        }
    }, [view, loggedIn, extensionReady, roomType]);

    return (
        <Page containerClassName={classes.container}>
            <Head>
                <title>{getPageTitle()} </title>
                {createOpenGraphTags({ title: getPageTitle() })}

                {/* OG TAGS GO HERE*/}
            </Head>{" "}
            {!mobile && onChrome && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    {view == "signup" ? (
                        <CreateAccountCard
                            onFinished={next}
                            onLoginClicked={() => router.push("/host/[roomType]/[view]", `/host/${roomType}/login`, { shallow: true })}
                        />
                    ) : view == "login" ? (
                        <LoginCard
                            onFinished={next}
                            onSignupClicked={() => router.push("/host/[roomType]/[view]", `/host/${roomType}/signup`, { shallow: true })}
                            onForgotPasswordClicked={() => account.show(true, { initialView: "forgot", singleView: true })}
                        />
                    ) : view == "extension" ? (
                        <GetExtensionCard />
                    ) : (
                        <Grid container alignItems="center" justify="center">
                            <Grid item>
                                <CircularProgress size={100} />
                                <Typography align="center">{view === "creating" ? "creating watch party..." : "loading..."}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </div>
            )}
        </Page>
    );
}

export default withAppState(HostStepsPage);
