import useSWR from "swr";
import {
    makeStyles,
    List,
    ListItem,
    ListItemText,
    /*ListItemAvatar,*/
    ListItemSecondaryAction,
    Grid,
    CircularProgress
} from "@material-ui/core";
import { useApp } from "hooks/Global/GlobalAppState";
//import AvatarGroup from "@material-ui/lab/AvatarGroup";
//import UserAvatar from "../UserAvatar/UserAvatar";
import moment from "moment-timezone";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import { useState } from "react";
import useAPI from "utils/useAPI";
import ActivityBarSection from "./ActivityBarSection";
import Username from "../Username/Username";
import JoinButton from "components/Join/JoinButton";

const useStyles = makeStyles((theme_) => ({
    secondaryAction: {}
}));

const RecentRooms = () => {
    const classes_ = useStyles();
    const {
        auth: { userId, loggedIn },
        sidebar
    } = useApp();
    const { join } = useAPI();
    const { data: rooms, error } = useSWR(() => loggedIn && "/rooms");
    const [status, setStatus_] = useState(null);
    return !error && loggedIn && rooms && rooms.length ? (
        <ActivityBarSection title={"Recent"}>
            <List>
                {rooms ? (
                    rooms.length ? (
                        rooms
                            .sort((a, b) => b.updated - a.updated)
                            .slice(0, 6)
                            .map((r) => {
                                return (
                                    <ListItem key={r.id}>
                                        {/*      <ListItemAvatar>
                                            <AvatarGroup max={4}>
                                                {r.participants
                                                    .filter((p) => p.id != userId)
                                                    .map((p) => (
                                                        <UserAvatar key={p.userId} user={p} />
                                                    ))}
                                            </AvatarGroup>
                                        </ListItemAvatar>*/}
                                        <ListItemText
                                            primary={r.participants
                                                .filter((p) => p.userId != userId)
                                                .map((p, i) => (
                                                    <span key={p.username + i}>
                                                        {i != 0 && ", "}
                                                        <Username>{p.username}</Username>
                                                    </span>
                                                ))}
                                            primaryTypographyProps={{
                                                variant: "subtitle2",
                                                style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }
                                            }}
                                            secondary={
                                                r.activeParticipants.filter((ap) => ap.id != userId).length
                                                    ? (r.activeParticipants.filter((ap) => ap.id != userId).length == 1
                                                          ? ""
                                                          : r.activeParticipants.filter((ap) => ap.id != userId).length + " ") + "ACTIVE NOW"
                                                    : moment.unix(r.updated).fromNow()
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <JoinButton width={"6rem"} type={"private"} roomId={r.id} roomCode={r.code} activeMembers={r.activeParticipants.filter((ap) => ap.id != userId).length} title={"Join"} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })
                    ) : (
                        <></>
                    )
                ) : (
                    <Grid container justify="center">
                        <Grid item>
                            <CircularProgress size={"5rem"} />
                        </Grid>
                    </Grid>
                )}
            </List>
        </ActivityBarSection>
    ) : null;
};

export default RecentRooms;
