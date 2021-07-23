import ActivityBarSection from "./ActivityBarSection";
import useSWR from "swr";
import { Grid, CircularProgress, makeStyles } from "@material-ui/core";
import LiveNowUser from "./LiveNowUser";

const useStyles_ = makeStyles((theme_) => ({
    avatarContainer: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-75%, -75%)",
        height: "4rem",
        width: "4rem"
    },
    avatar: {
        height: "4rem",
        width: "4rem"
    }
}));

const LiveNow = ({ service }) => {
    const { data: liveUsers, error } = useSWR(() => "/users/live" + (service ? "?service=" + service : ""), { refreshInterval: 30000 });
    if (liveUsers && liveUsers.items.length) {
        return (
            <ActivityBarSection title={"Featured Live Now"}>
                <Grid container spacing={0} style={service ? null : { padding: "1rem" }}>
                    {liveUsers.items.length > 0 &&
                        liveUsers.items
                            .slice(0, 10)
                            .map(({ activity: c, ...user }) => <LiveNowUser key={user.id} user={user} content={c} />)}
                </Grid>
            </ActivityBarSection>
        );
    } else if (error) {
        console.log("*** LiveNow error: ", error);
        return <></>;
    } else if (!liveUsers) {
        return (
            <Grid container justify="center">
                <Grid item>
                    <CircularProgress size={"5rem"} />
                </Grid>
            </Grid>
        );
    } else {
        return <></>;
    }
};

export default LiveNow;
