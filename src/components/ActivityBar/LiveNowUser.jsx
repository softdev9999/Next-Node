import { useState } from "react";

import { Grid, Typography, makeStyles, Box } from "@material-ui/core";
import UserAvatar from "../UserAvatar/UserAvatar";
import useAPI from "utils/useAPI";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import { useRouter } from "next/router";
import { useApp } from "hooks/Global/GlobalAppState";
import { useUserActivity } from "hooks/User/UserActivity";
import Username from "../Username/Username";
import JoinButton from "components/Join/JoinButton";

const useStyles = makeStyles((theme) => ({
    liveUserContainer: {
        background: theme.functions.rgba(theme.palette.common.white, 0.07),
        margin: theme.spacing(1, 0),
        height: theme.spacing(16),
        cursor: "pointer",
        "&:hover": {
            background: theme.functions.rgba(theme.palette.common.white, 0.14)
        }
    },
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
    },
    live: {
        position: "absolute",
        right: theme.spacing(1),
        transform: "translate(0%,0%)",
        top: theme.spacing(1),
        backgroundColor: "red",
        color: "#fff",
        //  marginBottom: "0.2rem",
        //  marginRight: "1rem",
        lineHeight: ".75rem",
        width: "2.5rem",
        height: ".75rem",
        borderRadius: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 8px rgba(0,0,0,0.5)",
        fontSize: ".5rem",
        letterSpacing: ".1em",
        fontWeight: 900
    },
    contentImage: {
        flex: "0 0 26.7%",
        height: "100%",
        backgroundSize: "cover",
        backgroundColor: theme.palette.scener.eclipse,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        position: "relative"
    },
    noContent: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "center",
        flexFlow: "column nowrap",
        alignItems: "center"
    }
}));

const LiveNowUser = ({ user }) => {
    const classes = useStyles();
    const [status, setStatus] = useState(null);
    const router = useRouter();
    const { activity } = useUserActivity(user && user.id);


    if (user && activity && activity.live) {
        return (
            <Grid
                key={user.id}
                item
                container
                alignItems="center"
                justify="space-between"
                wrap="nowrap"
                spacing={0}
                style={{ position: "relative" }}
                className={classes.liveUserContainer}
                onClick={() => router.push("/[username]", "/" + user.username)}
            >
                <Box className={classes.live}>LIVE</Box>

                <Box
                    className={classes.contentImage}
                    style={{
                        backgroundImage: `url(${activity.img || "/images/LiveBrowsing.jpg"})`
                    }}
                ></Box>
                <Grid item style={{ position: "relative", flex: "0 0 4rem" }}>
                    <Box className={classes.avatarContainer}>
                        <UserAvatar user={user} border className={classes.avatar} />
                    </Box>
                </Grid>
                <Grid item style={{ flex: "0 1 100%", overflow: "hidden" }} container alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item xs={12} style={{ marginBottom: ".75rem" }}>
                        <Typography
                            align="left"
                            variant="subtitle2"
                            style={{ whiteSpace: "nowrap", overflowX: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}
                        >
                            {user.displayName}
                        </Typography>
                        <Typography align="left" variant="subtitle1" color="textSecondary">
                            <Username>{user.username}</Username>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <JoinButton size="small" fullWidth type={"public"} roomId={activity.roomId} user={user} title={"Join"} />
                    </Grid>
                </Grid>
            </Grid>
        );
    } else {
        return <></>;
    }
};

export default LiveNowUser;
