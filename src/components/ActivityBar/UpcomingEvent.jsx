import { Grid, Typography, makeStyles, Box, Button } from "@material-ui/core";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useRouter } from "next/router";
import moment from "moment-timezone";
import config from "../../config";
import Username from "../Username/Username";
const useStyles = makeStyles((theme) => ({
    upcomingEventContainer: {
        background: theme.functions.rgba(theme.palette.common.white, 0.07),
        margin: theme.spacing(1, 0),
        padding: theme.spacing(0, 0, 0),
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        flex: "0 0 auto",
        position: "relative"
    },
    serviceContainer: {
        paddingTop: theme.functions.rems(12),
        paddingBottom: 0,
        paddingLeft: theme.functions.rems(18),
        paddingRight: theme.functions.rems(18)
    },
    titleContainer: {
        paddingLeft: theme.functions.rems(18),
        paddingRight: theme.functions.rems(18),
        minHeight: theme.functions.rems(60),
        maxHeight: theme.functions.rems(60)
    },
    itemContainer: {
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.07),
        width: "100%",
        paddingLeft: theme.functions.rems(15),
        paddingRight: theme.functions.rems(15),
        paddingTop: theme.functions.rems(16),
        paddingBottom: theme.functions.rems(12)
    },
    nameContainer: {
        flex: '0 1 100%',
        marginLeft: theme.spacing(1),
    },
    serviceTitle: {
        fontWeight: "bold",
        letterSpacing: 0.18,
        borderBottom: "1px solid #fff"
    },
    primaryText: {
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(18),
        whiteSpace: "pre-wrap",
        overflowX: "hidden",
        textOverflow: "ellipsis"
    },
    avatar: {
        height: "3.75rem",
        width: "3.75rem"
    },
    time: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexFlow: "column nowrap",
        backgroundColor: theme.palette.scener.supernova,
        borderRadius: 2000,
        fontSize: ".55rem",
        fontWeight: "900",
        textTransform: "uppercase",
        lineHeight: theme.functions.rems(12),
        height: theme.functions.rems(13),
        padding: theme.spacing(0, 2)
    },
    viewMoreButton: {
        marginTop: theme.spacing(1),
        minHeight: theme.functions.rems(28),
        minWidth: theme.functions.rems(140),
        borderRadius: theme.functions.rems(14),
    },
    displayName: {
        maxWidth: "100%",
        whiteSpace: "noWrap",
        overflowX: "hidden",
        textOverflow: "ellipsis",
        fontSize: theme.functions.rems(16),
        fontWeight: 800,
        letterSpacing: 0.29,
        marginTop: theme.functions.rems(5),
    },
    username: {
        color: theme.functions.rgba(theme.palette.common.white, 0.6),
        fontSize: theme.functions.rems(16),
        fontWeight: 600,
        letterSpacing: 0.29,
    },
}));

const UpcomingEvent = ({ event }) => {
    const classes = useStyles();
    const router = useRouter();

    if (event && event.user) {
        return (
            <Grid container alignItems="center" justify="space-between" spacing={0} key={event.user.id} className={classes.upcomingEventContainer}>
                <Grid item wrap="nowrap" container alignItems="center" justify="space-between" className={classes.serviceContainer}>
                    <Grid item>
                        {event.service && (
                            <Typography variant="overline" className={classes.serviceTitle}>
                                {config.SERVICE_LIST[event.service] ? config.SERVICE_LIST[event.service].name : event.service}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item>
                        <Box className={classes.time}>{moment.unix(event.startTime).fromNow()}</Box>
                    </Grid>
                </Grid>
                <Grid item className={classes.titleContainer} container alignItems="center" justify="flex-start">
                    <Grid item xs={12}>
                        <Typography align="left" variant="body2" color="textPrimary" className={classes.primaryText}>
                            {event.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item className={classes.itemContainer} wrap="nowrap" container alignItems="flex-start" justify="space-between">
                    <Grid item xs="auto">
                        <UserAvatar user={event.user} border className={classes.avatar} />
                    </Grid>
                    <Grid item className={classes.nameContainer}>
                        <Typography align="left" variant="subtitle2" className={classes.displayName}>
                            {event.user.displayName}
                        </Typography>
                        <Box>
                            <Username classname={classes.username}>{event.user.username}</Username>
                        </Box>
                        <Button
                            className={classes.viewMoreButton}
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => router.push("/[username]", "/" + event.user.username)}
                        >
                            View More
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    } else {
        return <></>;
    }
};

export default UpcomingEvent;
