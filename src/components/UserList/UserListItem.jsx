import { makeStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Badge, CircularProgress } from "@material-ui/core";

import { useApp } from "hooks/Global/GlobalAppState";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useState } from "react";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import { useRouter } from "next/router";
import useAPI from "utils/useAPI";
import config from "../../config";
import { useUserActivity } from "hooks/User/UserActivity";
import JoinButton from "components/Join/JoinButton";

const useStyles = makeStyles((theme_) => ({
    userList: {
        width: "100%",
        display: "flex",
        alignContent: "center"
    },
    typeWrap: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    liveBadge: {
        "& span": {
            marginLeft: "0.2rem",
            backgroundColor: "red !important"
        }
    }
}));

function UserListItem({ user, embedded, style }) {
    const classes = useStyles();
    const {
        auth: { userId, isFollowingUser }
    } = useApp();
    const { follow, join } = useAPI();
    const [status, setStatus] = useState(null);
    const router = useRouter();
    const { activity } = useUserActivity(user && user.id);
    const onFollow = () => {
        //setAnchorEl(null);
        console.log("*** Follow ***", user, userId);

        setStatus("loading");
        follow(user)
            .then((res) => {
                console.log(res);
                if (res) {
                    setStatus(null);
                } else {
                    setStatus("error");
                }
            })
            .catch(() => {
                setStatus("error");
            });
    };

    const onClickUser = (userData) => {
        //setAnchorEl(null);
        if (embedded) {
            window.open(config.WEB_HOST + "/" + userData.username, "_blank");
        } else {
            
            router.push("/[username]", "/" + userData.username);
        }
    };

    return user && user.username ? (
        <ListItem button onClick={() => onClickUser(user)} component={"div"} ContainerComponent="div" style={style}>
            <ListItemAvatar>
                <Badge
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left"
                    }}
                    badgeContent={activity && activity.live ? "LIVE" : null}
                    className={classes.liveBadge}
                >
                    <UserAvatar user={user} border />
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={user.displayName}
                secondary={user.username && "@" + user.username}
                primaryTypographyProps={{ className: onFollow && classes.typeWrap, variant: "subtitle2" }}
                secondaryTypographyProps={{ className: onFollow && classes.typeWrap, variant: "h6" }}
            />
            {userId != user.id && (
                <ListItemSecondaryAction>
                    {activity && activity.live ? (
                        <JoinButton width={"6rem"} type={"public"} roomId={activity.roomId} user={user} title={"Join"} />
                    ) : (
                        <ButtonWithFeedback
                            disabled={isFollowingUser(user.id)}
                            style={{ width: "6rem" }}
                            variant={"outlined"}
                            color={"default"}
                            status={status}
                            onClick={() => {
                                onFollow();
                            }}
                        >
                            {isFollowingUser(user.id) ? "Following" : "Follow"}
                        </ButtonWithFeedback>
                    )}
                </ListItemSecondaryAction>
            )}
        </ListItem>
    ) : (
        <ListItem button disabled onClick={() => {}} component={"div"}>
            <ListItemAvatar>
                <CircularProgress size={20} />
            </ListItemAvatar>
            <ListItemText primary={"loading..."} primaryTypographyProps={{ className: onFollow && classes.typeWrap, variant: "subtitle2" }} />
        </ListItem>
    );
}

export default UserListItem;
