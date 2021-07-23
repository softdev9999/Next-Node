import classname from "classnames";
import React, { useState } from "react";
import Head from "next/head";
import Page from "components/Page/Page";
import withAppState from "components/Page/withAppState";
import BGStars from "components/Page/svg/bg-stars.svg";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
import {
    useMediaQuery,
    useTheme,
    makeStyles,
    Grid,
    Box,
    Link,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(12),
        [theme.breakpoints.between(320, 500)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(4)
        },
        [theme.breakpoints.between(500, 720)]: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4)
        },
        [theme.breakpoints.between(720, 976)]: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4)
        }
    },
    boxContainer: {
        paddingLeft: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(3),
            marginBottom: theme.spacing(4)
        },
        [theme.breakpoints.between(500, 720)]: {
            paddingLeft: 0,
            marginBottom: theme.spacing(4)
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingLeft: 0,
            marginBottom: theme.spacing(4)
        }
    },
    rightContainer: {
        paddingLeft: theme.spacing(7),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0, 2)
        },
        [theme.breakpoints.between(500, 720)]: {
            paddingLeft: 0,
            paddingRight: 0
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingLeft: 0,
            paddingRight: 0
        }
    },
    dividerContainer: {
        marginBottom: theme.spacing(4),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0, 3)
        }
    },
    accordionRoot: {
        marginBottom: theme.functions.rems(35),
        background: "transparent",
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.functions.rems(25)
        },
        "&:before": {
            display: "none"
        },
        "&$expanded": {
            marginTop: 0,
            marginBottom: theme.functions.rems(35),
            [theme.breakpoints.down("xs")]: {
                marginBottom: theme.functions.rems(25)
            }
        }
    },
    accordionSummaryRoot: {
        minHeight: theme.functions.rems(64),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(2),
        background: theme.gradients.create(151.97, `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 100%`),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.functions.rems(5),
            minHeight: theme.functions.rems(60)
        },
        "&$expanded": {
            [theme.breakpoints.down("xs")]: {
                minHeight: theme.functions.rems(60)
            }
        }
    },
    accordionSummaryContent: {
        "&$expanded": {
            [theme.breakpoints.down("xs")]: {
                marginTop: theme.functions.rems(12),
                marginBottom: theme.functions.rems(12)
            }
        }
    },
    accordionDetailsRoot: {
        flexDirection: "column",
        padding: theme.spacing(4),
        background: theme.gradients.create(
            140.18,
            `${theme.functions.rgba("#390354", 0.35)} 0%`,
            `${theme.functions.rgba(theme.palette.secondary.light, 0.35)} 100%`
        ),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.functions.rems(12),
            paddingRight: theme.functions.rems(12),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2)
        }
    },
    childAccordionRoot: {
        width: "100%",
        background: "transparent",
        marginBottom: theme.functions.rems(18),
        "&:before": {
            display: "none"
        },
        "&$expanded": {
            marginTop: 0,
            marginBottom: theme.functions.rems(18)
        }
    },
    childAccordionSummaryRoot: {
        minHeight: theme.functions.rems(52),
        background: theme.functions.rgba(theme.palette.common.white, 0.05),
        "&$expanded": {
            minHeight: theme.functions.rems(52),
            background: theme.functions.rgba("#A89CBA", 0.89)
        }
    },
    childAccordionSummaryContent: {
        "&$expanded": {
            marginTop: theme.functions.rems(12),
            marginBottom: theme.functions.rems(12),
            "& > h3": {
                color: theme.palette.common.black
            }
        }
    },
    childAccordionDetailsRoot: {
        flexDirection: "column",
        paddingTop: theme.spacing(2),
        background: theme.functions.rgba(theme.palette.common.white, 0.8)
    },
    primary: {
        marginBottom: theme.functions.rems(20),
        paddingRight: theme.functions.rems(40),
        [theme.breakpoints.down("xs")]: {
            paddingRight: 0,
            fontSize: theme.functions.rems(36),
            lineHeight: theme.functions.rems(40)
        },
        [theme.breakpoints.between(500, 720)]: {
            paddingRight: 0
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingRight: 0
        }
    },
    secondary: {
        fontWeight: 400,
        [theme.breakpoints.down("xs")]: {
            paddingRight: theme.spacing(2)
        }
    },
    primaryTitle: {
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(20)
        }
    },
    secondarySubTitle: {
        color: theme.palette.common.black
    },
    paragraph: {
        color: theme.palette.common.black,
        fontWeight: 400
    },
    paragraphImage: {
        marginTop: theme.functions.rems(12),
        marginBottom: theme.functions.rems(12)
    },
    paragraphImageHalf: {
        maxWidth: "50%"
    },
    paragraphImageFixContent: {
        maxWidth: "fit-content"
    },
    expandIcon: {
        fontSize: theme.spacing(4),
        marginRight: 0
    },
    backgroundStars: {
        position: "absolute",
        top: "8%",
        left: "0%",
        transform: "translate(-48%, 100%)",
        overflow: "hidden",
        zIndex: -1,
        [theme.breakpoints.down("xs")]: {
            display: "none"
        },
        [theme.breakpoints.between(500, 720)]: {
            display: "none"
        },
        [theme.breakpoints.between(720, 976)]: {
            transform: "translate(-25%, 25%)"
        }
    },
    listContainer: {
        margin: 0,
        listStyle: "square",
        color: theme.palette.common.black
    },
    spacerLeft: {
        paddingLeft: theme.functions.rems(10)
    },
    spacerBottom: {
        marginBottom: theme.spacing(2)
    },
    expanded: {}
}));

function WatchPartyTipsPage({ query }) {
    const classes = useStyles();
    const theme = useTheme();
    const [expanded, setExpanded] = useState(query && query.t);
    const [childExpanded, setChildExpanded] = useState(false);
    const isTablet = useMediaQuery(theme.breakpoints.between(500, 720));
    const isLaptop = useMediaQuery(theme.breakpoints.between(720, 976));
    const getPageTitle = () => {
        return "Scener – Watch party tips";
    };
    const handleChange = (accordion) => (event, isExpanded) => {
        setExpanded(isExpanded ? accordion : false);
    };
    const handleChildChange = (accordion) => (event, isExpanded) => {
        setChildExpanded(isExpanded ? accordion : false);
    };
    return (
        <Page
            backgroundLayer={
                <Box className={classes.backgroundStars}>
                    <BGStars />
                </Box>
            }
            halfWidth={isTablet || isLaptop}
        >
            <Head>
                <title>{getPageTitle()}</title>
                {createOpenGraphTags({ title: getPageTitle() })}
            </Head>
            <Grid container className={classes.container}>
                <Grid item xs={12} md={(isLaptop && 12) || 3}>
                    <Box className={classes.boxContainer}>
                        <Typography variant="h1" component="h1" className={classes.primary}>
                            Getting started with watch parties
                        </Typography>
                        <Typography variant="h5" className={classes.secondary}>
                            Here’s a brief intro blurb on Scener being fun and awesome and here are a few initial things to know before starting.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={(isLaptop && 12) || 9} className={classes.rightContainer}>
                    <Accordion
                        square
                        elevation={0}
                        classes={{ root: classes.accordionRoot, expanded: classes.expanded }}
                        expanded={expanded === "before"}
                        onChange={handleChange("before")}
                    >
                        <AccordionSummary
                            classes={{
                                root: classes.accordionSummaryRoot,
                                expanded: classes.expanded,
                                expandIcon: classes.expandIcon,
                                content: classes.accordionSummaryContent
                            }}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography variant="h2" component="h2" className={classes.primaryTitle}>
                                Before beginning
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 1}
                                onChange={handleChildChange(1)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Equipment needs
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography variant="h5" component="h5" className={classes.secondarySubTitle}>
                                        Laptop or desktop computer
                                    </Typography>
                                    <Typography paragraph variant="h5" className={classes.paragraph}>
                                        Hosting a watch party with Scener’s Chrome Extension only works from a laptop or desktop computer, not a
                                        smartphone or tablet. Make sure the computer has a built-in camera or camera attachment in order to join a
                                        watch party room or theater on video.
                                    </Typography>
                                    <Typography variant="h5" component="h5" className={classes.secondarySubTitle}>
                                        Headphones
                                    </Typography>
                                    <Typography paragraph variant="h5" className={classes.paragraph}>
                                        Use wired or wireless headphones to prevent others from hearing an echo when using audio. If using wireless
                                        Bluetooth headphones, we recommend ensuring headphones are fully charged before beginning a watch party.
                                    </Typography>
                                    <Typography variant="h5" component="h5" className={classes.secondarySubTitle}>
                                        Broadband internet
                                    </Typography>
                                    <Typography paragraph variant="h5" className={classes.paragraph}>
                                        Good bandwidth ensures a show can be streamed next to video feeds of friends or co-hosts watching together. On
                                        slow connections, the show will buffer and the video chat may disconnect.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 2}
                                onChange={handleChildChange(2)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Create a scener account
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography variant="h5" className={classes.paragraph}>
                                        After an account is created, Scener automatically populates your profile with your display name and username.
                                        You can complete your profile by adding a photo, cover image, bio, social profiles and any scheduled watch
                                        parties that you’re planning.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/watch-1a.png" atl="watch_1a" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 3}
                                onChange={handleChildChange(3)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Add the scener chrome extension
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="div" paragraph variant="h5" className={classes.paragraph}>
                                        The Scener Chrome Extension, which works on laptops and desktops, allows people to watch movies and shows
                                        across most streaming platforms with their friends in perfect sync. Without it, the theater does not work.
                                        Download the{" "}
                                        <Link
                                            target="_new"
                                            href="https://chrome.google.com/webstore/detail/scener-%E2%80%93-virtual-movie-th/lkhjgdkpibcepflmlgahofcmeagjmecc"
                                        >
                                            Scener Google Chrome Extension
                                        </Link>
                                        .
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        square
                        elevation={0}
                        classes={{ root: classes.accordionRoot, expanded: classes.expanded }}
                        expanded={expanded === "rooms"}
                        onChange={handleChange("rooms")}
                    >
                        <AccordionSummary
                            classes={{ root: classes.accordionSummaryRoot, expandIcon: classes.expandIcon }}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography variant="h2" component="h2" className={classes.primaryTitle}>
                                Getting Started with Rooms
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 4}
                                onChange={handleChildChange(4)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Join a watch party room
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph variant="h5" className={classes.paragraph}>
                                        To join a room, you must be on a laptop or desktop and have a room code or URL. Clicking on the link will
                                        launch the watch party welcome screen.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If you’re given a party code, go to Scener.com on your computer and click the “Have a Code?” button at the top
                                        of the screen to join.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/watch-1.png" atl="watch_1" />
                                    <Typography paragraph variant="h5" className={classes.paragraph}>
                                        At this point, you should have created a Scener account and installed the Scener Chrome Extension. Remember,
                                        joining a watch party room is only possible from a laptop or desktop, not a mobile device.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 5}
                                onChange={handleChildChange(5)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Start a watch party room
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        To create a room, go to Scener.com and click the ‘Host a watch party‘ button on the top right corner of the
                                        page. The next screen will have two options: room or theater. Select ‘room’ to create an invite-only, secure
                                        event that allows up to 10 guests on camera or microphone at once.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/watch-2.png" atl="watch_2" />
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/watch-3.png" atl="watch_3" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 6}
                                onChange={handleChildChange(6)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Set up camera and microphone
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Once a watch party is started, the audio and visual settings will appear. Click the ‘camera’ or ‘microphone’
                                        icons to turn each feature on or off. For first-time hosts, Google Chrome will ask for permission to access
                                        your camera and microphone.
                                    </Typography>
                                    <Typography paragraph component="div" variant="h5" className={classes.paragraph}>
                                        Fine tune the camera and microphone selection with the drop down menus. Most likely, the computer default
                                        preferences will already be pre-selected. Scener is compatible with Snap Camera but it must be selected in the
                                        camera dropdown menu and running on the computer to avoid getting a a blank yellow screen.{" "}
                                        <Link href="https://snapcamera.snapchat.com">Download Snap Camera here.</Link> Be sure to read their
                                        instructions on how to get started.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Headphones are strongly recommended when on camera and unmuted. Otherwise, everyone watching will hear an
                                        echo. You can also mute each participant individually to prevent this (but headphones are the way to go!).
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-14.png" alt="hosted-14" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 7}
                                onChange={handleChildChange(7)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Select a streaming service
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Scener supports most major streaming services:
                                    </Typography>
                                    <ul className={classname(classes.listContainer, classes.spacerBottom)}>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                No account required: YouTube, Vimeo
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                Regular subscriptions required: Netflix, Disney +, Prime Video, HBO Max, Hotstar, Alamo On Demand,
                                                Shudder, YouTube
                                            </Typography>
                                            <ul>
                                                <li>
                                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                                        Premium Accounts (no ads): Hulu, Funimation
                                                    </Typography>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Remember, each guest needs their own streaming service account for most services, so picking a popular
                                        streaming service will ensure everyone can join the watch party.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If guests live in another country, they can still use Scener together as long as they have access to the same
                                        streaming service and show or movie content. Keep in mind, certain shows and movies might not be available in
                                        different countries. Streaming services manage their own rights for shows and movies across different
                                        countries, which Scener has no control over. Pro tip: Netflix Originals tend to be available in all
                                        territories.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-15.png" alt="hosted-15" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 8}
                                onChange={handleChildChange(8)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Invite guests
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        After creating a room, Scener generates a unique 16-character code for that event. Copy the code to share it
                                        with guests, or click the ‘Copy invite link’ in the watch party sidebar and share the link directly. Like
                                        other video platforms, once the link is created, the same group of guests can join it again and again.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Scener is working on an upcoming notification system that notifies guests when one person joins the watch
                                        party, so they can jump in too!
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-4.png"
                                        alt="watch-4"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 9}
                                onChange={handleChildChange(9)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Pick a show together
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        The person who created the watch party is the host, and they automatically have the remote (see remote
                                        section). The host can select any show or movie once they launch a streaming service.
                                    </Typography>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        While the host is selecting a show, guests can still see their own streaming service homepage. However, only
                                        the host with the remote can select a show to play.
                                    </Typography>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Guests can enable their videos and microphones while the host selects a show to discuss what to watch next.
                                    </Typography>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Note for Paid Content: Some streaming services like, Disney+ and Amazon Prime offer movies for rent or
                                        purchase. To view a paid film, every Watch Party guest will have to purchase the movie or show on their own
                                        streaming service account.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Throughout a watch party, the host can switch shows and streaming services without limitation. However, the
                                        guests in the watch party all must have the same streaming services to watch together. Just because the
                                        theater owner can switch between services, doesn’t mean every guest in the watch party can without having to
                                        purchase a subscription.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 10}
                                onChange={handleChildChange(10)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Remote
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        The host will start out with the remote but they can pass it to a guest (if present) at any time. Only one
                                        user can have the remote at a time. When a user has the remote, they can select the show and select the time
                                        placement within a show. They can even switch to a new streaming service and select a different show.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The host or guest can pass the remote by hovering over their video container and clicking the remote icon that
                                        appears. A popup will appear with all the usernames who can get the remote.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-6.png"
                                        alt="watch-6"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 11}
                                onChange={handleChildChange(11)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Pinning a comment
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Pinning comments can be helpful for giving guests a welcome message or instructions at the top of chat. The
                                        person who creates the watch party is the host and has the sole ability to pin comments. The host cannot pin
                                        comments from another guest, and passing the remote doesn’t allow other guests to pin comments.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-7.png"
                                        alt="watch-7"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 12}
                                onChange={handleChildChange(12)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Chat (open/close)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If chat isn’t being used or the messages are distracting, it can always be minimized. Just click the “chat ”
                                        button in the theater control bar and chat will collapse. To expand chat, just press the same area again.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-8.png"
                                        alt="watch-8"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 13}
                                onChange={handleChildChange(13)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Camera & mic buttons + settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The camera and microphone settings can always be changed in the room, regardless of what was selected when
                                        starting the watch party. The camera and microphone can easily be turned on or off by clicking their icons in
                                        the control bar.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-9.png"
                                        alt="watch-9"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        To select a different microphone or camera, click the settings icon and select the camera or microphone to use
                                        in the corresponding dropdown menu.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-10.png"
                                        alt="watch-10"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 14}
                                onChange={handleChildChange(14)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Technical difficulties
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The most common technical difficulties are a camera or mic not working, a show not syncing, or chat not
                                        loading. The good news is most issues can be solved by pressing the ‘?’ icon in the theater control bar and
                                        reading through the ‘help menu’ popup:
                                    </Typography>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                For video and mic issues, click the ‘Re-sync Scener’ button
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                For streaming service issues click the ‘Re-launch show’ button
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                For chat issues, click the ‘Reload chat’ button
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="div" variant="h5" className={classes.paragraph}>
                                                For all other issues, read our{" "}
                                                <Link href="https://community.scener.com/help/" target="_new">
                                                    help section.
                                                </Link>
                                            </Typography>
                                        </li>
                                    </ul>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-11.png"
                                        alt="watch-11"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 15}
                                onChange={handleChildChange(15)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        End watch party
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        A watch party in a room ends when ALL of the attendees leave, even if the host leaves first. To leave a watch
                                        party, click the ‘X’ icon in the top right corner of the sidebar and click the ‘leave watch party’ button.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-12.png"
                                        alt="watch-12"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Clicking the close browser icon (a red ‘X’) will end the watch party for you. Anyone still in the Watch Party
                                        will continue to hangout and watch whatever was playing.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-13.png"
                                        alt="watch-13"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 16}
                                onChange={handleChildChange(16)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Return to the same watch party
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If a person accidentally quits the watch party and wishes to rejoin, or there was a technical issue like
                                        internet failure, they can simply return to the room. Most likely the ‘Launch watch party’ popup will still
                                        display. Click the ‘Launch watch party’ button to jump back into the same party.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/watch-14.png" alt="watch-14" />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Another way to rejoin a watch party is by going to the Scener.com homepage. The ‘Most recent’ section at the
                                        top of the activity bar will display recent watch parties. Click ‘Join’ next to the desired watch party.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-15.png"
                                        alt="watch-15"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 17}
                                onChange={handleChildChange(17)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Start a new watch party with the same guests
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        The most recent watch parties are saved in the activity bar under the ‘Recent’ section. Click ‘Join’ next to
                                        the watch party to start it again. Once in the watch party, everyone who was in the party before will see
                                        ‘active now’.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Save the 16 character Room code, or URL and use it to relaunch a room previously created.
                                    </Typography>
                                    <Box display="flex">
                                        <img
                                            className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                            src="/images/watch-party-tips/watch-15.png"
                                            alt="watch-15"
                                        />
                                        <img
                                            className={classname(classes.paragraphImage, classes.paragraphImageHalf, classes.spacerLeft)}
                                            src="/images/watch-party-tips/watch-15a.png"
                                            alt="watch-15a"
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        square
                        elevation={0}
                        classes={{ root: classes.accordionRoot, expanded: classes.expanded }}
                        expanded={expanded === "theaters"}
                        onChange={handleChange("theaters")}
                    >
                        <AccordionSummary
                            classes={{ root: classes.accordionSummaryRoot, expandIcon: classes.expandIcon }}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography variant="h2" component="h2" className={classes.primaryTitle}>
                                Getting started with theaters
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 18}
                                onChange={handleChildChange(18)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Join a watch party theater as a co-host
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Co-host(s) are featured at the top of the watch party sidebar and can join the host on video, or just
                                        microphone.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-1.png"
                                        alt="hosted-1"
                                    />
                                    <Typography component="p" variant="h5" paragraph className={classes.paragraph}>
                                        A co-host can be invited before the watch party theater goes live or during it.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If a co-host is invited to a theater before it goes live, they must be signed into their personal account AND
                                        go to the hosts profile page. On the hosts profile page, there will be a pink button that says ‘Join Party’.
                                        This button is ONLY visible to the invited co-host to allow them to join the party ahead of time.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImage)}
                                        src="/images/watch-party-tips/hosted-2.png"
                                        alt="hosted-2"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If the host invites a co-host while the theater is live, there are a few ways they can join. If the invited
                                        co-host is currently in the watch party, a popup will appear over their sidebar. This popup asks them to join
                                        the current theater as a co-host.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-3.png"
                                        alt="hosted-3"
                                    />
                                    <Typography component="p" variant="h5" paragraph className={classes.paragraph}>
                                        If the invited co-host(s) are not currently in the watch party, they can join by clicking on the Chrome
                                        notification with the invitation link.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        If the co-host(s) miss the Chrome notification, they can go to the host’s profile page and click ‘Join Party’.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-2.png" alt="hosted-2" />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The invited co-host(s) can also go to Scener.com homepage and look in the activity bar on the right to find
                                        the Watch Party at the top of the recent section.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-5.png"
                                        alt="hosted-5"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 19}
                                onChange={handleChildChange(19)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Join a watch party theater as a guest
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Guests make the theater more fun with the chat comments in the sidebar.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-6.png"
                                        alt="hosted-6"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        When the theater is live, there are many ways guests can join. The host can share a direct link which will
                                        bring guests straight into the live theater.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-7.png"
                                        alt="hosted-7"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        A person who ‘follows’ the host’s profile on Scener will receive a Chrome notification with the invitation
                                        link to the hosted watch party. They can click the link to join the party.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        On the host’s profile page, there will be a ‘join party’ button for anyone to join when the host is live.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-9.png" alt="hosted-9" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 20}
                                onChange={handleChildChange(20)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Start a ‘watch party theater’
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Theaters have one host who can invite co-hosts to join them on camera. Four co-hosts or less is optimal for
                                        the best streaming experience, but up to nine co-hosts can join.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-10.png"
                                        alt="hosted-10"
                                    />
                                    <Typography component="p" variant="h5" paragraph className={classes.paragraph}>
                                        Theaters can be open to the general public or they can be password protected to allow a specific group of
                                        guests to join. There is no limit to how many guests can join. Just know that guests are limited to chat-only
                                        communication.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Theaters can be started instantly or be scheduled for a future date. To start a watch party theater, go to
                                        Scener.com and click the ‘Host a watch party’ button which is found in the top right corner of every page.
                                        This will launch the selection menu. Click the second option, ‘Theater’ to begin.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-11.png" alt="hosted-11" />
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-12.png" alt="hosted-12" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 21}
                                onChange={handleChildChange(21)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Schedule a ‘Watch Party theater’
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Scheduling a watch party theater allows people to share the event and plan to attend. Currently, there are
                                        three ways to schedule a theater.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        1. Click the ’Host a watch party’ button on the top right of every page. Select ‘Schedule for later’. Then
                                        input the party details.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-12a.png" alt="hosted_12a" />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        2. Click ‘Schedule a watch party theater’ found in the ‘Details’ section on each person’s personal profile.
                                        Then input the party information.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-12b.png" alt="hosted-12b" />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        3. Click ‘Edit profile’, click ‘Schedule’ tab and click ‘Schedule a live watch party’ button. Then input the
                                        party details
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-13.png" alt="hosted-13" />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        When filling out the Schedule fields there are some things to consider.
                                    </Typography>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                Pick a consistent date & time and host often to increase followers and guests.
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                Create a clear event name so guests know what they are showing up to. The event name could be a series
                                                name or the title of the show/movie that will be hosted.
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                Insert a URL with more information about the hosted series/event: a festival, school class, or
                                                community event. This URL field can also be used to link to a co-host profile.
                                            </Typography>
                                        </li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 22}
                                onChange={handleChildChange(22)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Set up camera and microphone
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Once a watch party is started, the audio and visual settings will appear. Click the ‘camera’ or ‘microphone’
                                        icons to turn each feature on or off. For first-time hosts, Google Chrome will ask for permission to access
                                        your camera and microphone.
                                    </Typography>
                                    <Typography paragraph component="div" variant="h5" className={classes.paragraph}>
                                        Fine tune the camera and microphone selection with the drop down menus. Most likely, the computer default
                                        preferences will already be pre-selected. Scener is compatible with Snap Camera but it must be selected in the
                                        camera dropdown menu and running on the computer to avoid getting a a blank yellow screen. Download{" "}
                                        <Link target="_new" href="https://snapcamera.snapchat.com">
                                            Snap Camera here.
                                        </Link>{" "}
                                        Be sure to read their instructions on how to get started.
                                    </Typography>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Headphones are strongly recommended when on camera and unmuted. Otherwise, everyone watching will hear an
                                        echo. You can also mute each participant individually to prevent this (but headphones are the way to go!).
                                    </Typography>
                                    <img className={classes.paragraph} src="/images/watch-party-tips/hosted-14.png" alt="hosted-14" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 23}
                                onChange={handleChildChange(23)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Select your streaming service
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Scener supports most major streaming services:
                                    </Typography>
                                    <ul className={classname(classes.listContainer, classes.spacerBottom)}>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                No account required: YouTube, Vimeo
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                Regular subscriptions required: Netflix, Disney +, Prime Video, HBO Max, Hotstar, Alamo On Demand,
                                                Shudder, YouTube
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                Premium Accounts (no ads): Hulu, Funimation
                                            </Typography>
                                        </li>
                                    </ul>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Remember, each guest needs their own streaming service account for most services, so picking a popular
                                        streaming service will ensure everyone can join the watch party.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If guests live in another country, they can still use Scener together as long as they have access to the same
                                        streaming service and show or movie content. Keep in mind, certain shows and movies might not be available in
                                        different countries. Streaming services manage their own rights for shows and movies across different
                                        countries, which Scener has no control over. Pro tip: Netflix Originals tend to be available in all
                                        territories.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-15.png" alt="hosted-15" />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 24}
                                onChange={handleChildChange(24)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Toggle live on
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        When a theater is started and the sidebar launches, the host isn’t live. To go live the ‘live’ toggle needs to
                                        be switched to ON. Otherwise, guests will not be able to join the party or even see that it exists. However,
                                        if the host has invited co-hosts, then the co-hosts can join the theater before the ‘Live’ toggle is switched
                                        on. This gives the host and their co-hosts the opportunity to discuss any last minute thoughts before going
                                        live to an audience.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-16.png"
                                        alt="hosted-16"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 25}
                                onChange={handleChildChange(25)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Pick a show
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The host who created the theater automatically has the remote, and can select any show or movie. If the host
                                        is live while selecting a show, guests will see the browsing screen until they select a show.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-17.png" alt="hosted-17" />
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Note for paid content: Some streaming services like, Disney+ and Amazon Prime offer movies for rent or
                                        purchase. To view a paid film, every watch party guest will have to rent or purchase the movie or show on
                                        their own streaming service account.
                                    </Typography>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Throughout a watch party, the host can switch shows and streaming services without limitation. However, the
                                        guests in the watch party all must have the same streaming services to watch together. Just because the host
                                        can switch between services, doesn’t mean every guest in the watch party can without having to purchase a
                                        subscription.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 26}
                                onChange={handleChildChange(26)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Invite co-hosts
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Once a host starts a watch party theater, they have the option to add co-hosts. Co-hosts can choose to be on
                                        camera or just audio - regardless of the main host settings. Once a co-host joins, the host always has the
                                        option to dismiss the co-host by clicking the ‘x’ in their video container.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        To invite a co-host, the host has to know the username of the co-host they wish to invite ahead of time. Once
                                        in theater, press the ‘add co-host’ button and enter the co-host username in the input field. Currently there
                                        is no search feature. The invited co-host has to already have a scener account. There is no way to invite
                                        people to scener from the ‘add co-host’ button.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-19.png"
                                        alt="hosted-19"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        There are two ways to invite a co-host; either before or during the watch party.
                                    </Typography>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                                The most popular way is inviting co-hosts to the watch party before the host goes live. This way the
                                                host and co-hosts can strategize before the general public joins their watch party.
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                                The host can also invite a guest during the Live watch party. If the guest is in theater, a popup will
                                                appear on the users screen over the sidebar which asks them to join as a co-host. If the user is not
                                                in theater, they will get a chrome notification with an active link. However, at anypoint they can go
                                                to the hosts profile and press ‘Join Party’ which will put them into the watch party as a co-host.
                                            </Typography>
                                        </li>
                                    </ul>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Each watch party theater is unique. When co-hosts are invited to a watch party theater they are only a co-host
                                        for that one party. If the host starts another theater and wants the same co-hosts they will have to re-invite
                                        them.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 27}
                                onChange={handleChildChange(27)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Invite guests
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Once a theater is live, the host can invite guests by copying the share URL in the sidebar and sharing it with
                                        their community.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-20.png"
                                        alt="hosted-20"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Guests who receive this link are first brought to the hosts profile. Once the guest clicks ‘join party’ they
                                        are brought into the theater.
                                    </Typography>
                                    <img className={classes.paragraphImage} src="/images/watch-party-tips/hosted-9.png" alt="hosted-9" />
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        The shareable URL is always: scener.com/USERNAME
                                    </Typography>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        Don’t forget if a person follows a profile they will receive chrome notifications when that host goes live.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 28}
                                onChange={handleChildChange(28)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Pinning a comment
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        Pinning comments can be helpful for giving guests a welcome message or instructions at the top of chat. The
                                        person who creates the watch party is the host and has the sole ability to pin comments. The host cannot pin
                                        comments from another guest, and passing the remote doesn’t allow other guests to pin comments.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-21.png"
                                        alt="hosted-21"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 29}
                                onChange={handleChildChange(29)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Chat (open/close)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        If chat isn’t being used or the messages are distracting, it can always be minimized. Just click the “chat ”
                                        button in the theater control bar and chat will collapse. To expand chat, just press the same area again.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-22.png"
                                        alt="hosted-22"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 30}
                                onChange={handleChildChange(30)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Remote
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph component="p" variant="h5" className={classes.paragraph}>
                                        The host will start out with the remote but they can pass it to a co-host (if present) at any time. Only one
                                        user can have the remote at a time. When a user has the remote, they can select the show and select the time
                                        placement within a show. They can even switch to a new streaming service and select a different show.
                                    </Typography>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The host or co-host can pass the remote by hovering over their video container and clicking the remote icon
                                        that appears. A popup will appear with all the host /co-hosts that can get the remote. If the host does not
                                        have any co-hosts there will not be anyone to pass the remote to.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-23.png"
                                        alt="hosted-23"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 31}
                                onChange={handleChildChange(31)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Moderation
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }} />
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 32}
                                onChange={handleChildChange(32)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Camera & mic buttons + settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The camera and microphone settings can always be changed in the theater, regardless of what was selected when
                                        starting the watch party. The camera and microphone can easily be turned on or off by clicking their icons in
                                        the control bar.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-24.png"
                                        alt="hosted-24"
                                    />
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        To select a different microphone or camera, click the settings icon and select the camera or microphone in the
                                        dropdown menu.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-25.png"
                                        alt="hosted-25"
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                elevation={0}
                                square
                                classes={{ root: classes.childAccordionRoot, expanded: classes.expanded }}
                                expanded={childExpanded === 33}
                                onChange={handleChildChange(33)}
                            >
                                <AccordionSummary
                                    classes={{
                                        root: classes.childAccordionSummaryRoot,
                                        content: classes.childAccordionSummaryContent,
                                        expanded: classes.expanded
                                    }}
                                >
                                    <Typography variant="h5" component="h5">
                                        Technical difficulties
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography component="p" variant="h5" className={classes.paragraph}>
                                        The most common technical difficulties are a camera or mic not working, a show not syncing, or chat not
                                        loading. The good news is most issues can be solved by pressing the ‘?’ icon in the theater control bar and
                                        reading through the ‘help menu’ popup:
                                    </Typography>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                For video and mic issues, click the ‘Re-sync Scener’ button
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                For streaming service issues click the ‘Re-launch show’ button
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography component="p" variant="h5" className={classes.paragraph}>
                                                For chat issues, click the ‘Reload chat’ button
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="h5" component="div" className={classes.paragraph}>
                                                For all other issues, read our{" "}
                                                <Link target="_new" href="https://community.scener.com/help/">
                                                    help section
                                                </Link>
                                            </Typography>
                                        </li>
                                    </ul>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/hosted-26.png"
                                        alt="hosted-26"
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <Box className={classes.dividerContainer}>
                <Divider component="div" />
            </Box>
        </Page>
    );
}


export function getServerSideProps(context) {
    return { props: { query: context.query } };
}


export default withAppState(WatchPartyTipsPage);
