import { makeStyles, CircularProgress, Typography } from "@material-ui/core";
import ScenerThemeProvider from "theme/ScenerThemeProvider";
import SidebarHeader from "./SidebarHeader";
import { useRouter } from "next/router";

import { RoomStateProvider } from "hooks/Room/Room";
import RoomView from "./Room/RoomView";
import { useApp } from "hooks/Global/GlobalAppState";
import { ChatProvider } from "hooks/Chat/ChatClient";
import { ContentStateProvider } from "hooks/ContentState/ContentState";
import useSWR, { mutate } from "swr";
import { useExtension } from "hooks/Extension/Extension";
import NavPopup from "../NavPopup/NavPopup";
import UpdateExtension from "../SidebarAlerts/UpdateExtension";
import { useEffect } from "react";
import ErrorBoundary from "../ErrorView/ErrorBoundary";
import { SidebarWindowStateProvider } from "hooks/SidebarState/SidebarWindowState";
import withAppState from "../Page/withAppState";
import { trackEventAll } from "utils/Tracking";
import localforage from "localforage";
const useStyles = makeStyles((theme_) => ({
    container: {
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        flexFlow: "column nowrap",
        justifyContent: "flex-start"
    },
    main: {
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "100%",
        flex: "1 1 100%",
        display: "flex",
        alignItems: "center",
        flexFlow: "column nowrap",
        justifyContent: "flex-start"
    },
    loadingContainer: {
        width: "100vw",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
        flex: "1 1 100%"
    },
    errorContainer: {
        width: "100vw",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
        flex: "1 1 100%"
    }
}));

function SidebarWrapper({ children }) {
    const classes = useStyles();
    const router = useRouter();
    const { auth } = useApp();
    const { needsUpdate } = useExtension();
    const { roomId } = router.query;

    const { data: room, error: roomError, mutate: updateRoom } = useSWR(roomId ? "/rooms/" + roomId : null, { revalidateOnFocus: false });
    // const ownerId = useMemo(() => (room && room.owner ? room.owner.id : null), [room]);
    const { data: activity, mutate: refreshActivity } = useSWR(() => "/activity/" + room.owner.id, { refreshInterval: 35000 });

    const refresh = (data) => {
        if (data) {
            updateRoom(data);
        } else {
            mutate("/rooms/" + roomId);
        }
    };

    useEffect(() => {
        localforage.getItem("sent_events").then((evs) => {
            if (!evs || !evs["FirstSidebarOpen"]) {
                if (!evs) {
                    evs = {};
                }
                trackEventAll("Purchase");
                evs["FirstSidebarOpen"] = 1;
                localforage.setItem("sent_events", evs);
            }
        });
    }, []);

    useEffect(() => {
        if (room && room.member && room.member.userId != auth.userId) {
            refresh();
        }
        if (room) {
            refreshActivity();
        }
    }, [auth.userId, room]);

    return (
        <ErrorBoundary
            onError={() => {
                if (process.browser) {
                    window.dispatchEvent(new Event("scenererror"));
                }
            }}
        >
            <ScenerThemeProvider theme="sidebar">
                <ContentStateProvider>
                    <SidebarWindowStateProvider>
                        <div id="container" className={classes.container}>
                            <style
                                dangerouslySetInnerHTML={{
                                    __html: `@media  screen and (max-width: 300px) {
                                                html {
                                                    font-size:4vw
                                                }
                                            }`
                                }}
                            />
                            {needsUpdate ? (
                                <div className={classes.loadingContainer}>
                                    <NavPopup dialog open={needsUpdate} hideLogo hideDismiss>
                                        <UpdateExtension />
                                    </NavPopup>
                                </div>
                            ) : room && room.member && activity && !roomError ? (
                                <ChatProvider userId={auth.userId}>
                                    {children}

                                    <RoomStateProvider room={room} refreshRoom={refresh} activity={activity} refreshActivity={refreshActivity}>
                                        <SidebarHeader />
                                        <main className={classes.main}>
                                            <RoomView />
                                        </main>
                                    </RoomStateProvider>
                                </ChatProvider>
                            ) : roomError ? (
                                <div className={classes.loadingContainer}>
                                    <Typography variant="h5" align="center">
                                        ERROR
                                    </Typography>
                                </div>
                            ) : (
                                <div className={classes.loadingContainer}>
                                    <CircularProgress size={"40vw"} />
                                    <Typography variant="h5" style={{ marginTop: "2rem", animation: "pulse-50 2s 0s ease-in-out infinite" }}>
                                        connecting...
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </SidebarWindowStateProvider>
                </ContentStateProvider>
            </ScenerThemeProvider>
        </ErrorBoundary>
    );
}

export default withAppState(SidebarWrapper);
