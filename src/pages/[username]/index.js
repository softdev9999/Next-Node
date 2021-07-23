import classname from "classnames";
import { useState, useEffect, useMemo } from "react";

import { useRouter } from "next/router";
import Page from "components/Page/Page";
import OpenGraph from "components/OpenGraph/OpenGraph";
import Head from "next/head";
import UserList from "components/UserList/UserList";
import Event from "components/Event/Event";
import LinkShare from "components/Event/LinkShare";
//import ProfileSection from "components/Section/ProfileSection";
import ReportPopup from "components/Report/ReportPopup";
import NavPopup from "components/NavPopup/NavPopup";
import { LoadingDots, TheaterIcon, RoomIcon, AudienceIcon } from "components/Icon/Icon";

import useSWR from "swr";
import {
    IconButton,
    Typography,
    Grid,
    AppBar,
    Tabs,
    Tab,
    MenuItem,
    Tooltip,
    Link,
    List,
    Button,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Divider,
    Popover,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    Box
} from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";

import { makeStyles } from "@material-ui/core/styles";
import FixedRatioBox from "components/FixedRatioBox/FixedRatioBox";
import { useApp } from "hooks/Global/GlobalAppState";
import WebsiteIcon from "@material-ui/icons/Language";

import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";
import { TikTok, Verified } from "components/Icon/Icon";
import config from "../../config";

import EventIcon from "@material-ui/icons/Event";
import LaunchIcon from "@material-ui/icons/Launch";
import LinkIcon from "@material-ui/icons/Link";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import ServiceIcon from "components/Icon/ServiceIcon";
import JoinButton from "components/Join/JoinButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import FormattedText from "components/Section/FormattedText";
import moment from "moment";
import useAPI from "utils/useAPI";
import { useUserActivity } from "hooks/User/UserActivity";
import ButtonWithFeedback from "components/ButtonWithFeedback/ButtonWithFeedback";
import TabPanel from "components/TabPanel/TabPanel";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
import GetScenerButton from "components/GetScenerButton/GetScenerButton";
import dynamic from "next/dynamic";
const Hero = dynamic(() => import("components/Hero/Hero"), { ssr: false });
import { isMobile } from "utils/Browser";

/*
const tabProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
};*/

/* fields: bio, twitter

Name, username, photo, cover photo, bio, website
*/

const useStyles = makeStyles((theme) => ({
    profileImage: {
        position: "relative",
        maxWidth: "2rem",
        maxHeight: "2rem",
        padding: "calc(2rem + 3%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        borderRadius: "100%"
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        position: "absolute",
        bottom: "-25%",
        left: "1rem",
        border: "0.3rem solid " + theme.palette.secondary.main
    },
    profileUnder: {
        marginTop: theme.spacing(4)
    },
    heroText: {
        position: "relative",
        marginTop: theme.spacing(10)
    },
    profileBio: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        marginBottom: theme.spacing(3),
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    tabPanel: {
        width: "100%",
        height: "100%"
    },
    socialLink: {
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        transform: "scale(1.5)"
    },
    socialLinks: {
        width: "100%",
        marginTop: "2rem",
        marginBottom: "2rem"
    },
    scheduleItem: {
        backgroundColor: "rgba(255,255,255,0.05)",
        marginTop: "1rem"
    },
    scheduleItemLinked: {
        backgroundColor: "rgba(255,255,255,0.05)",
        marginBottom: "1rem",
        cursor: "pointer",
        "&:hover": {
            background: theme.gradients.create("90", theme.palette.primary.dark, theme.palette.primary.darkest)
        }
    },
    dialogPaper: {
        margin: theme.functions.rems(12),
        width: "auto",
        maxWidth: "max-content",
        overflow: "hidden"
    },
    popoverPaper: {
        minWidth: theme.functions.rems(205),
        borderRadius: 0,
        background: theme.gradients.create("45", `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 100%`)
    },
    popoverMenuItem: {
        minHeight: theme.functions.rems(45),
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(20),
        paddingLeft: theme.spacing(2.4),
        paddingRight: theme.spacing(2.4),
        "&:hover": {
            background: theme.functions.rgba(theme.palette.common.white, 0.1)
        }
    },
    verifiedIcon: {
        fontSize: "1.2rem",
        cursor: "pointer"
    },
    buttonListMobile: {
        position: "absolute",
        top: "-4rem",
        right: "0.5rem"
    },
    button: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            width: "75%"
        }
    },
    divider: {
        marginTop: theme.spacing(6),
        marginBottom: theme.functions.rems(50)
    },
    eventItemContainer: {
        marginTop: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            padding: theme.functions.rems(16)
        }
    },
    eventListContainer: {
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.functions.rems(16),
            paddingRight: theme.functions.rems(16)
        }
    },
    scheduleButtonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        "& > button:first-child": {
            marginRight: theme.functions.rems(16),
            fontSize: theme.functions.rems(24)
        }
    },
    scheduleButton: {
        padding: 0,
        fontSize: theme.functions.rems(20)
    },
    primaryText: {
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(20)
    },
    secondaryText: {
        fontSize: theme.functions.rems(14),
        fontWeight: "bold",
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(20),
        textTransform: "uppercase",
        color: theme.functions.rgba(theme.palette.common.white, 0.25)
    },
    timestampText: {
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0,
        color: "#9987B7",
        lineHeight: theme.functions.rems(16),
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2)
        }
    },
    eventListIcon: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(4)
        }
    },
    accordionDetailsRoot: {
        margin: "3rem 1rem !important",
        borderRadius: "0.5rem",
        boxShadow: "0rem 0rem 1rem 0 rgba(100,0,100,0.5)",
        background: theme.gradients.create(151.97, `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 100%`),
        "&$expanded": {
            margin: "1rem"
        }
    },
    toggleButton: {
        color: "white",
        textTransform: "inherit",
        border: "none",
        margin: "0.5rem",
        width: "calc(100% - 1rem)",
        minHeight: "10rem",
        borderRadius: "0.5rem",
        padding: "1rem",
        background: theme.functions.rgba(theme.palette.primary.main, 0.25),
        "&:hover": {
            background: theme.gradients.create(151.97, `${theme.palette.primary.main} 0%`, `${theme.palette.secondary.light} 100%`)
        },
        [theme.breakpoints.down("xs")]: {
            margin: "0rem"
        }
    }
}));

function UserProfilePage({ user: initUser, query, events: initEvents, featuredEvent }) {
    const {
        auth: { userId, logout, isFollowingUser },
        popups: { account, editProfile, addEvent }
    } = useApp();
    const { join, follow, unfollow, block } = useAPI();

    const classes = useStyles();
    const theme = useTheme();
    const mobileScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const [tabValue, setTabValue] = useState(0);
    const [showHostInfo, setShowHostInfo] = useState(false);
    const router = useRouter();
    const {
        query: { username }
    } = router;
    const { action, contentId, eventId } = query;
    // const [featuredUsers, setFeaturedUsers] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [eventHighlight, setEventHighlight] = useState(featuredEvent);
    const [shareUrl, setShareUrl] = useState(false);
    const [popupTarget, setPopupTarget] = useState(null);
    // const [showJoin, setShowJoin] = useState(false);
    // const [relations, setRelations] = useState(null);
    //   const [selfRelations, setSelfRelations] = useState(null);
    //const [userEvent, setUserEvent] = useState(null);
    //  const [userWatchingNow, setUserWatchingNow] = useState(null);
    // const [userFavorite, setUserFavorite] = useState(null);
    const [shouldLoadRelationships, setShouldLoadRelationships] = useState(false);

    const { data: user, error } = useSWR(() => "/users/" + username, { initialData: initUser, revalidateOnMount: true });

    const { activity } = useUserActivity(user && user.id);
    const { data: room } = useSWR(() => activity && activity.roomId && "/rooms/" + activity.roomId);
    const [status, setStatus] = useState(null);
    const [eventsToShow, setEventsToShow] = useState(null);
    //  const { following, followers /*, banned, blocked*/ } = relations || {};
    const { data: events, error: eventsError_ } = useSWR(() => "/users/" + user.id + "/events", { initialData: initEvents });
    const { data: content } = useSWR(() => contentId > 0 && `/content/${contentId}`);
    const [showReportPopup, setShowReportPopup] = useState(false);

    const isLive = useMemo(
        () =>
            user &&
            activity &&
            activity.roomId &&
            (activity.live || (room && room.member && (room.member.role == "host" || room.member.role == "owner"))),
        [user, activity, room]
    );

    useEffect(() => {
        if (username) {
            setTabValue(0);
            window.scrollTo({ top: 0 });
        }
    }, [username]);

    useEffect(() => {
        if (events && eventId) {
            console.log("*** EVENT H ***", eventId);
            let foundEvent = events.find((x) => x.id == eventId);
            if (foundEvent) {
                setEventHighlight(foundEvent);
            }
        }
    }, [eventId, events]);

    useEffect(() => {
        console.log(action, contentId, content);
        let cid = parseInt(contentId || 0, 10);
        if (action == "schedule" && user && user.id == userId && (!cid || content)) {
            addEvent.show(true);
            //editProfile.show(true, { defaultTab: 2, content });
            router.replace("/[username]", `/${username}`, { shallow: true });
        }
    }, [user, userId, action, contentId, content]);

    useEffect(() => {
        if (events) {
            let needToSlice = false;

            if (events && events.length > 1) {
                events.sort((a, b) => a.startTime - b.startTime);

                if (events[0] && events[1] && events[0].startTime && events[1].startTime) {
                    let curTime = Math.floor(Date.now() / 1000);

                    let currentEventRuntime = +events[0].startTime - curTime;
                    let timeUntilNextEvent = +events[1].startTime - curTime;

                    if (timeUntilNextEvent < 3600) {
                        console.log("Next event is coming soon!", currentEventRuntime, timeUntilNextEvent);
                        if (currentEventRuntime > -1800) {
                            // current event has only been running for 30 minutes
                            needToSlice = false;
                        } else {
                            needToSlice = true;
                        }
                    }
                }
            }

            if (needToSlice && events) {
                setEventsToShow(events.slice(1));
            } else {
                setEventsToShow(events);
            }
        }
    }, [events]);

    const formatDate = (d) => {
        //return d;
        return moment.unix(d).format("dddd, MMMM Do, h:mm A z");
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setShouldLoadRelationships(true);
    };

    const onOptions = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeOptions = () => {
        setAnchorEl(null);
    };

    const gotoLink = (url) => {
        window.open(url, "_blank");
    };

    const onBlock = (uid) => {
        console.log("*** Block ***", uid);
        closeOptions();
        if (status == null) {
            block({ id: uid })
                .then((ok) => {
                    if (ok && ok.success) {
                        router.push("/", "/");
                    }
                })
                .then(() => setStatus(null))
                .catch(() => setStatus("error"));
        }
    };

    const onFollow = (u) => {
        //setAnchorEl(null);
        console.log("*** Follow ***", u, userId);
        closeOptions();
        if (status == null) {
            setStatus("loading");
            follow(u)
                .then(() => setStatus(null))
                .catch(() => setStatus("error"));
        }
    };

    const onUnfollow = (u) => {
        //setAnchorEl(null);
        console.log("*** UN Follow ***", u.id);
        closeOptions();
        if (status == null) {
            setStatus("loading");
            unfollow(u)
                .then(() => setStatus(null))
                .catch(() => setStatus("error"));
        }
    };

    //export const reportUser = (userId, fields) => { .text
    //export const createReminder = (fields) => { phone, code, time, userId, message, hostId

    const onReport = (event) => {
        setPopupTarget(event.currentTarget);
        setAnchorEl(null);
        setShowReportPopup(true);
    };

    const onShareEvent = (event) => {
        if (event && event.id) {
          if (isMobile()) {
            try {
              navigator.share({
                url: config.WEB_HOST + "/" + username + "?eventId=" + event.id,
                title: event.name
              });
            } catch(e) {
              // sharesheet error
            }
          } else {
            setShareUrl(config.WEB_HOST + "/" + username + "?eventId=" + event.id);
          }
        }
    };

    /* const parseUserJson = (block) => {
        try {
            return JSON.parse(block);
        } catch (ex) {
            return null;
        }
    };

    /*useEffect(() => {
        if (user && user.id) {
            if (user.event) {
                let eventData = parseUserJson(user.event);
                setUserEvent(eventData);
            }
            if (user.watchingnow) {
                let watchingData = parseUserJson(user.watchingnow);
                setUserWatchingNow(watchingData);
            }
            if (user.favorite) {
                let favoriteData = parseUserJson(user.favorite);
                setUserFavorite(favoriteData);
            }
        }
    }, [user, userId]);*/

    /*useEffect(() => {
        if (user && relations) {
            let sFeatured = featuredUsers;

            if (following) {
                if (featuredUsers) {
                    sFeatured = featuredUsers
                        .filter(
                            (feat) =>
                                !following.find(
                                    (sr) => sr.relationship.toUserId == feat.relationship.toUserId || feat.relationship.toUserId == userId
                                )
                        )
                        .map((rf) => ({
                            ...rf,
                            relationship: {
                                ...rf.relationship,
                                status: "none"
                            }
                        }));
                    console.log("*** FILTER FEATURE ***", sFeatured);
                }
            }
            setFeaturedUsersFiltered(sFeatured);
        }
    }, [relations, selfRelations, user, featuredUsers]);*/

    const normalizeUrl = (url) => {
        if (url) {
            return "https://" + url.replace(/https?/, "");
        } else {
            return null;
        }
    };

    /*const getFeaturedEventIndex = (eventsList) => {

        if (events && events.length > 1 && events[0] && events[1] && events[0].startTime && events[1].startTime) {

            let currentEventRuntime = +(events[1].startTime * 1000) - +new Date();
            let timeUntilNextEvent = +(events[1].startTime * 1000) - +new Date();

            if (timeUntilNextEvent < 3600) {
              if (currentEventRuntime > -1800) {
                // current event has only been running for 30 minutes
                return 0;
              }
              return 1;
            }
        } else {
          return 0;
        }
    };*/

    let numEvents = eventsToShow ? eventsToShow.length : 0;
    //let eventToFeature = getFeaturedEventIndex(eventsToShow);

    return (
        <Page showActivityDrawer hideFooter>
            <Head>
                {eventId && eventHighlight ? (
                    <>
                        <title>{user && user.username ? "Scener - @" + username + " - " + eventHighlight.title : "Scener – User not found"}</title>
                        {createOpenGraphTags({
                            title: user && user.username ? "Scener - @" + username + " - " + eventHighlight.title : "Scener – User not found",
                            image: user && user.profileImageUrl,
                            url: config.WEB_HOST + "/" + username + "?eventId=" + eventId,
                            imageHeight: 300,
                            imageWidth: 300,
                            description: eventHighlight.title
                        })}
                    </>
                ) : (
                    <>
                        <title>{user && user.username ? "Scener - @" + username : "Scener – User not found"}</title>
                        {createOpenGraphTags({
                            title: user && user.username ? "Scener - @" + username : "Scener – User not found",
                            image: user && user.profileImageUrl,
                            url: config.WEB_HOST + "/" + username,
                            imageHeight: 300,
                            imageWidth: 300,
                            description: user && user.bio
                        })}
                    </>
                )}
            </Head>
            {user && !error ? (
                <>
                    <FixedRatioBox xs={0.4}>
                        <Hero
                            user={user}
                            activity={activity}
                            room={room}
                            onOptions={onOptions}
                            onFollow={onFollow}
                            mobile={mobileScreen}
                            canFollow={!isFollowingUser(user.id) && user.id != userId}
                        ></Hero>
                    </FixedRatioBox>

                    {user && (
                        <Grid container className={classes.heroText} alignContent="center" justify="flex-start" direction="column" wrap={"nowrap"}>
                            <Grid
                                container
                                alignContent="center"
                                justify="flex-start"
                                direction="row"
                                wrap={"nowrap"}
                                style={{ paddingLeft: "1rem" }}
                            >
                                <Grid item container alignContent="center">
                                    <Grid item xs={12}>
                                        {user.displayName && (
                                            <Typography variant="h3" align="left" noWrap>
                                                {user.displayName}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Box display="flex" alignItems="center" marginTop=".3rem">
                                            {user.username && (
                                                <Typography
                                                    variant="h6"
                                                    color="textSecondary"
                                                    align="left"
                                                    style={{ position: "relative", marginRight: ".5rem" }}
                                                >
                                                    @{user.username}
                                                </Typography>
                                            )}
                                            {user.verified && (
                                                <Tooltip title="Verified">
                                                    <Box display="flex">
                                                        <Verified className={classes.verifiedIcon} />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid
                                    className={mobileScreen ? classes.buttonListMobile : classes.buttonList}
                                    item
                                    container
                                    alignItems="center"
                                    justify="flex-end"
                                    wrap="nowrap"
                                >
                                    {isLive && user.id != userId ? (
                                        <JoinButton type={"public"} roomId={activity.roomId} user={user} title={"Join Party"} />
                                    ) : null}
                                    {userId != user.id ? (
                                        <ButtonWithFeedback
                                            disabled={isFollowingUser(user.id)}
                                            style={{ margin: 5 }}
                                            variant={"outlined"}
                                            color={"default"}
                                            status={status}
                                            onTimeout={setStatus}
                                            onClick={() => {
                                                onFollow && onFollow(user);
                                            }}
                                            key="follow"
                                        >
                                            {isFollowingUser(user.id) ? "Following" : "Follow"}
                                        </ButtonWithFeedback>
                                    ) : (
                                        <Button
                                            style={{ margin: 5, paddingLeft: "2rem", paddingRight: "2rem" }}
                                            variant={"outlined"}
                                            color={"default"}
                                            onClick={() => {
                                                editProfile.show(true);
                                            }}
                                            key="editProfile"
                                        >
                                            Edit Profile
                                        </Button>
                                    )}

                                    <Button
                                        style={{ margin: 5 }}
                                        variant={"text"}
                                        color={"default"}
                                        onClick={(e) => {
                                            onOptions && onOptions(e);
                                        }}
                                    >
                                        <MoreIcon style={{ fontSize: "1rem", transform: "scale(2)" }} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    <Grid container className={classes.profileUnder} alignContent="flex-start" justify="flex-start" direction="row" wrap="wrap">
                        <Grid container className={classes.profileBio} direction="row" wrap="wrap">
                            <Grid item xs={12}>
                                {user.bio && (
                                    <Typography
                                        variant="subtitle2"
                                        style={{
                                            textOverflow: "ellipsis",
                                            whiteSpace: "wrap",
                                            wordWrap: "break-word",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {user.bio}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {user.website && (
                                    <Link href={normalizeUrl(user.website)} target="_blank" color="secondary">
                                        <WebsiteIcon style={{ top: "0.2rem", position: "relative", marginRight: ".5rem" }} />

                                        {user.website}
                                    </Link>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    <AppBar position="static" color="transparent" style={{ zIndex: 1099 }}>
                        <Tabs indicatorColor={"secondary"} value={tabValue} onChange={handleTabChange}>
                            <Tab label="Details" />
                            <Tab label={user.followerCount + " Follower" + (user.followerCount != 1 ? "s" : "")} />
                            <Tab label={user.followingCount + " Following"} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} style={{ width: "100%", overflowX: "hidden" }} index={0}>

                      {user.id == userId ? <Accordion
                          elevation={0}
                          classes={{ root: classes.accordionDetailsRoot, expanded: classes.expanded }}
                      >
                          <AccordionSummary
                              expandIcon={<ExpandMoreIcon style={{transform: "scale(1.2)"}}/>}
                              classes={{
                                  root: classes.childAccordionSummaryRoot,
                                  content: classes.childAccordionSummaryContent,
                                  expanded: classes.expanded
                              }}
                          >
                              <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                  Learn about hosting watch parties
                              </Typography>
                          </AccordionSummary>
                          <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                            <Grid container alignContent="space-around" justify="center" direction="row" wrap="nowrap">
                              <Grid item>
                                <ToggleButton
                                    classes={{ root: classes.toggleButton }}
                                    value={1}
                                    onClick={() => {
                                        router.push("/watch-party-tips?t=rooms");
                                    }}
                                >
                                  <Grid container alignContent="space-around" justify="center" direction="column">
                                    <Grid item>
                                      <RoomIcon style={{ transform: "scale(1.2)", marginBottom: "1rem" }} />
                                    </Grid>
                                    <Grid item>
                                    <Typography>Watch party room</Typography>
                                  </Grid>
                                  </Grid>
                                </ToggleButton>
                              </Grid>
                              <Grid item>
                                <ToggleButton
                                    classes={{ root: classes.toggleButton }}
                                    value={2}
                                    onChange={() => {
                                        router.push("/watch-party-tips?t=theaters");
                                    }}
                                ><Grid container alignContent="space-around" justify="center" direction="column">
                                  <Grid item>
                                    <TheaterIcon style={{ transform: "scale(1.2)", marginBottom: "1rem" }} />
                                  </Grid>
                                  <Grid item>
                                  <Typography>Watch party theater</Typography>
                                </Grid>
                                </Grid></ToggleButton>
                              </Grid>
                              <Grid item>
                                <ToggleButton
                                    classes={{ root: classes.toggleButton }}
                                    value={3}
                                    onChange={() => {
                                        router.push("/build-an-audience");
                                    }}
                                ><Grid container alignContent="space-around" justify="center" direction="column">
                                  <Grid item>
                                    <AudienceIcon style={{ transform: "scale(1.2)", marginLeft: "0.3rem", marginBottom: "1rem" }} />
                                  </Grid>
                                  <Grid item>
                                  <Typography>Build an audience</Typography>
                                </Grid>
                                </Grid></ToggleButton>
                              </Grid>
                              </Grid>

                          </AccordionDetails>
                      </Accordion> : <></>}

                        {numEvents > 0 && (
                            <Grid item container xs={12}>
                                <Grid item container xs={12} style={{ padding: "1rem" }}>
                                    <Event
                                        timer={true}
                                        isLive={isLive}
                                        event={eventsToShow[0]}
                                        host={user}
                                        onShare={() => onShareEvent(eventsToShow[0])}
                                        onClick={() => null} /*onRemind={(event) => onReminder(event)}*/
                                    />
                                </Grid>
                                {user.schedule && (
                                    <Grid item xs={12} style={{ padding: "1rem" }}>
                                        <Typography
                                            variant="h5"
                                            align="left"
                                            style={{
                                                maxWidth: "90vw",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "wrap",
                                                wordWrap: "break-word",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <FormattedText tags={["br", "small", "b", "i", "h2", "ul", "li"]} text={user.schedule} links={true} />
                                        </Typography>
                                    </Grid>
                                )}
                                {numEvents > 1 && (
                                    <>
                                        <Grid item xs={12} className={classes.eventItemContainer}>
                                            <Divider variant="fullWidth" color="primary" style={{ opacity: "0.5" }} />
                                        </Grid>
                                        <Grid container alignItems="center" justify="space-between" className={classes.eventItemContainer}>
                                            <Typography variant="h3" align="left">
                                                Upcoming watch parties
                                            </Typography>
                                            {user.id == userId && (
                                                <Button
                                                    style={{ margin: 5, backgroundColor: "transparent" }}
                                                    variant="outlined"
                                                    color="default"
                                                    onClick={() => {
                                                        editProfile.show(true, { defaultTab: 2 });
                                                    }}
                                                >
                                                    Edit schedule
                                                </Button>
                                            )}
                                        </Grid>
                                        <List dense={false} className={classes.eventListContainer}>
                                            {eventsToShow.slice(1).map(
                                                (u) =>
                                                    u.id && (
                                                        <ListItem
                                                            button={!!u.url}
                                                            key={u.id}
                                                            onClick={() => u.url && gotoLink(u.url)}
                                                            className={classname({
                                                                [classes.scheduleItemLinked]: u.url,
                                                                [classes.scheduleItem]: !u.url
                                                            })}
                                                            alignItems={(mobileScreen && "flex-start") || "center"}
                                                        >
                                                            <ListItemIcon className={classes.eventListIcon}>
                                                                <EventIcon style={{ fontSize: "2rem" }} />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                classes={{
                                                                    secondary: classes.timestampText
                                                                }}
                                                                primary={
                                                                    <>
                                                                        {u.service && (
                                                                            <div style={{ marginBottom: "0.3rem" }}>
                                                                                <Typography className={classes.secondaryText}>{u.service}</Typography>
                                                                            </div>
                                                                        )}
                                                                        <Typography gutterBottom className={classes.primaryText}>
                                                                            {u.title}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                                secondary={formatDate(u.startTime)}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                {u.id && (
                                                                    <Tooltip title={"Share this event"}>
                                                                        <IconButton onClick={() => onShareEvent(u)}>
                                                                            <LinkIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {u.url && (
                                                                    <Tooltip title={u.url}>
                                                                        <IconButton onClick={() => gotoLink(u.url)}>
                                                                            <LaunchIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    )
                                            )}
                                        </List>
                                        {!mobileScreen && (
                                            <Grid item xs={12} style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                                                <Divider variant="fullWidth" color={"primary"} style={{ opacity: "0.5" }} />
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </Grid>
                        )}

                        {numEvents < 2 && user.id == userId && (
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justify="center"
                                style={{ padding: "1rem 1rem 2rem", marginTop: "1rem", backgroundColor: "rgba(255,255,255,0.05)" }}
                            >
                                {numEvents == 0 && (
                                    <Grid item>
                                        <Typography variant="h4" style={{ margin: "1rem" }}>
                                            You have no scheduled watch parties
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid container direction="row" justify="center">
                                    {numEvents > 0 ? (
                                        <Button
                                            variant="outlined"
                                            color="default"
                                            onClick={() => {
                                                editProfile.show(true, { defaultTab: 2 });
                                            }}
                                            className={classes.button}
                                        >
                                            Edit Schedule
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                addEvent.show(true);
                                            }}
                                            className={classes.button}
                                        >
                                            Schedule a watch party
                                        </Button>
                                    )}
                                    <GetScenerButton style={{ margin: "0.5rem" }} invert={true} invertedColor={"primary"} trackingSource="Profile" />
                                </Grid>
                            </Grid>
                        )}

                        {user.about && (
                            <Grid item xs={12} style={{ padding: "1rem", marginTop: "1rem", marginBottom: "1rem" }}>
                                <Typography
                                    variant={"h5"}
                                    align={"left"}
                                    style={{ maxWidth: "100%", textOverflow: "ellipsis", whiteSpace: "wrap", wordWrap: "break-word" }}
                                >
                                    {user.about}
                                </Typography>
                            </Grid>
                        )}
                        {(user.twitter || user.instagram || user.tiktok || user.youtube) && (
                            <Grid container className={classes.socialLinks} alignContent="center" justify="center" direction="row" wrap="wrap">
                                {user.twitter && (
                                    <Grid item>
                                        <IconButton className={classes.socialLink} href={"https://www.twitter.com/" + user.twitter} target={"_blank"}>
                                            <TwitterIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                                {user.instagram && (
                                    <Grid item>
                                        <IconButton
                                            className={classes.socialLink}
                                            href={"https://www.instagram.com/" + user.instagram}
                                            target={"_blank"}
                                        >
                                            <InstagramIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                                {user.tiktok && (
                                    <Grid item>
                                        <IconButton className={classes.socialLink} href={"https://www.tiktok.com/@" + user.tiktok} target={"_blank"}>
                                            <TikTok />
                                        </IconButton>
                                    </Grid>
                                )}
                                {user.youtube && (
                                    <Grid item>
                                        <IconButton
                                            className={classes.socialLink}
                                            href={"https://www.youtube.com/user/" + user.youtube}
                                            target={"_blank"}
                                        >
                                            <YouTubeIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                                {user.facebook && (
                                    <Grid item>
                                        <IconButton
                                            className={classes.socialLink}
                                            href={"https://www.facebook.com/" + user.facebook}
                                            target={"_blank"}
                                        >
                                            <FacebookIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                                <Grid item xs={12} style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                                    <Divider variant="fullWidth" color={"primary"} style={{ opacity: "0.5" }} />
                                </Grid>
                            </Grid>
                        )}
                    </TabPanel>
                    <TabPanel className={classes.tabPanel} value={tabValue} index={1}>
                        <UserList
                            endpoint={"/users/" + user.id + "/relationships/followers"}
                            noneLabel="no followers yet"
                            shouldLoad={shouldLoadRelationships}
                            infinite
                            pageSize={40}
                        />
                    </TabPanel>
                    <TabPanel className={classes.tabPanel} value={tabValue} index={2}>
                        <UserList
                            endpoint={"/users/" + user.id + "/relationships/following"}
                            noneLabel="none yet"
                            shouldLoad={shouldLoadRelationships}
                            infinite
                            pageSize={40}
                        />
                    </TabPanel>
                </>
            ) : (
                <>
                    <FixedRatioBox xs={0.4}>{error && <Hero></Hero>}</FixedRatioBox>
                    <Grid container className={classes.profileUnder} alignContent="center" justify="center" direction="column" wrap="wrap">
                        {error ? (
                            <>
                                <Typography variant={"h3"} align={"left"} style={{ marginTop: "2rem" }}>
                                    User not found
                                </Typography>
                                <Typography variant={"h4"} align={"left"} style={{ marginTop: "2rem" }}>
                                    The user you are looking for could not be found. Please make sure you have the right username and try again
                                </Typography>
                                <Grid item xs={12} sm={11} style={{ marginTop: "2rem" }}>
                                    <Button variant="contained" color="primary" style={{ width: "10rem" }} onClick={() => gotoLink("/help")}>
                                        Get Help
                                    </Button>
                                </Grid>
                            </>
                        ) : (
                            <LoadingDots style={{ width: "20%" }} />
                        )}
                    </Grid>
                </>
            )}
            {mobileScreen && (
                <Grid container justify="center">
                    <Grid item xs={10}>
                        <Divider className={classes.divider} component="div" variant="fullWidth" />
                    </Grid>
                </Grid>
            )}
            {user && (
                <Popover
                    id="popover-user-menu"
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={closeOptions}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    classes={{
                        paper: classes.popoverPaper
                    }}
                >
                    {userId && userId == user.id ? (
                        <MenuItem
                            component="div"
                            className={classes.popoverMenuItem}
                            onClick={() => {
                                logout();
                                closeOptions();
                                account.show(true, { initialView: "login", message: "Signed out", skipFinish: true });
                            }}
                        >
                            Sign out
                        </MenuItem>
                    ) : (
                        <>
                            {isFollowingUser(user.id) && (
                                <MenuItem component="div" className={classes.popoverMenuItem} onClick={() => onUnfollow(user)}>
                                    Unfollow
                                </MenuItem>
                            )}
                            <MenuItem component="div" className={classes.popoverMenuItem} onClick={(e) => onReport(e)}>
                                Report user
                            </MenuItem>
                            {userId && (
                                <MenuItem component="div" className={classes.popoverMenuItem} onClick={() => onBlock(user)}>
                                    Block user
                                </MenuItem>
                            )}
                        </>
                    )}
                </Popover>
            )}
            {eventId && (
                <NavPopup
                    disablePadding
                    classes={{ paper: classes.dialogPaper }}
                    dialog={true}
                    open={!!eventHighlight}
                    onDismiss={() => setEventHighlight(null)}
                >
                    <Event
                        timer={true}
                        event={eventHighlight}
                        host={user}
                        userHeader={true}
                        onShare={() => onShareEvent(eventHighlight)}
                        onClick={() => null} /*onRemind={(event) => onReminder(event)}*/
                    />
                </NavPopup>
            )}
            {shareUrl && (
                <NavPopup disablePadding classes={{ paper: classes.dialogPaper }} dialog={true} open={!!shareUrl} onDismiss={() => setShareUrl(null)}>
                    <LinkShare url={shareUrl} title={"Share Event"} />
                </NavPopup>
            )}

            <ReportPopup user={user} visible={showReportPopup} target={popupTarget} onDismiss={() => setShowReportPopup(false)} />
        </Page>
    );
}

export async function getServerSideProps(context) {
    const db = require("lib/db");
    const { getUserByName } = require("lib/user");
    let user = null;
    let events = null;
    let featuredEvent = null;
    try {
        user = await getUserByName(context.params.username, true);
        if (user) {
            events = await db.query(
                `SELECT * from userEvents where userId=${db.escape(
                    user.id
                )} AND startTime > UNIX_TIMESTAMP(NOW() - INTERVAL 3 HOUR) ORDER BY startTime ASC LIMIT 50`
            );
            events = db.parse(events);
            console.log(events);
            if (context.query && context.query.eventId) {
                let foundEvent = events.find((x) => x.id == context.query.eventId);
                if (foundEvent) {
                    featuredEvent = foundEvent;
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    await db.end();
    return {
        props: { query: context.query, user, featuredEvent, events }
    };
}

export default withAppState(UserProfilePage);
