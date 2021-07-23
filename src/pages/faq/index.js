import React, { useState } from "react";
import classname from "classnames";
import Head from "next/head";
import Page from "components/Page/Page";
import BGStars from "components/Page/svg/bg-stars.svg";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
import {
    useMediaQuery,
    useTheme,
    makeStyles,
    Grid,
    Divider,
    Box,
    Link,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
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
            "& > h5": {
                color: theme.palette.common.black
            }
        }
    },
    childAccordionDetailsRoot: {
        flexDirection: "column",
        paddingTop: theme.spacing(2),
        color: theme.palette.common.black,
        background: theme.functions.rgba(theme.palette.common.white, 0.8)
    },
    primary: {
        fontSize: theme.functions.rems(40),
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(44),
        marginBottom: theme.functions.rems(20),
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(36),
            lineHeight: theme.functions.rems(40)
        }
    },
    secondary: {
        fontSize: theme.functions.rems(16),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24),
        fontWeight: 400,
        paddingRight: theme.functions.rems(75),
        [theme.breakpoints.down("xs")]: {
            paddingRight: theme.functions.rems(18)
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingRight: 0
        }
    },
    paragraph: {
        fontSize: theme.functions.rems(16),
        color: theme.palette.common.black,
        fontWeight: "bold",
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    paragraphText: {
        fontWeight: 400,
        letterSpacing: 0
    },
    primaryTitle: {
        fontSize: theme.functions.rems(24),
        fontWeight: "bold",
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24),
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(20)
        }
    },
    secondaryTitle: {
        [theme.breakpoints.down("xs")]: {
            lineHeight: theme.functions.rems(20)
        },

    },
    secondaryBold: {
        fontWeight: 600,
        [theme.breakpoints.down("xs")]: {
            fontWeight: 400
        }
    },
    linkButton: {
        color: theme.palette.secondary.main
    },
    topContainer: {
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(4, 2, 0)
        },
        [theme.breakpoints.between(500, 720)]: {
            padding: theme.spacing(4, 2, 0)
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingTop: theme.spacing(4)
        }
    },
    topBoxContainer: {
        paddingLeft: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(3)
        },
        [theme.breakpoints.between(500, 720)]: {
            paddingRight: theme.spacing(3)
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingLeft: 0,
        }
    },
    bottomContainer: {
        marginTop: theme.spacing(14),
        marginBottom: theme.spacing(20),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0, 2),
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(8)
        },
        [theme.breakpoints.between(500, 720)]: {
            padding: theme.spacing(0, 2),
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(8)
        },
        [theme.breakpoints.between(720, 976)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(8)
        }
    },
    boxContainer: {
        padding: theme.spacing(4),
        minHeight: theme.functions.rems(228),
        background: theme.gradients.create(
            140.18,
            `${theme.functions.rgba("#390354", 0.35)} 0%`,
            `${theme.functions.rgba(theme.palette.secondary.light, 0.35)} 100%`
        ),
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(4)
        },
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(4)
        },
        [theme.breakpoints.between(720, 976)]: {
            marginTop: theme.spacing(4)
        }
    },
    leftBoxContainer: {
        paddingLeft: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.functions.rems(45)
        },
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.functions.rems(45)
        },
        [theme.breakpoints.between(720, 976)]: {
            paddingLeft: 0,
        }
    },
    paragraphContainer: {
        display: "flex",
        marginBottom: theme.functions.rems(8)
    },
    bullet: {
        width: theme.functions.rems(5),
        height: theme.functions.rems(5),
        background: "#D8D8D8",
        borderRadius: "100%",
        marginTop: theme.functions.rems(6),
        marginRight: theme.functions.rems(8)
    },
    expandIcon: {
        fontSize: theme.spacing(4),
        marginRight: 0
    },
    gutterBottom: {
        marginBottom: 0,
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(5)
        },
        [theme.breakpoints.down("sm")]: {
            marginBottom: theme.spacing(5)
        },
        [theme.breakpoints.between(720, 976)]: {
            marginBottom: theme.spacing(5)
        }
    },
    dividerContainer: {
        marginBottom: theme.spacing(4),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0, 3)
        },
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0, 3)
        }
    },
    backgroundStars: {
        position: "absolute",
        top: "2%",
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
            transform: "translate(-25%, 25%)",
        }
    },
    listContainer: {
        margin: 0,
        marginBottom: theme.spacing(2),
        color: theme.palette.common.black,
        listStyle: "square"
    },
    paragraphImage: {
        marginTop: theme.functions.rems(12),
        marginBottom: theme.functions.rems(12)
    },
    paragraphImageHalf: {
        maxWidth: "50%"
    },
    expanded: {}
}));

function FaqPage() {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const isTablet = useMediaQuery(theme.breakpoints.between(500, 720));
    const isLaptop = useMediaQuery(theme.breakpoints.between(720, 976));
    const [expanded, setExpanded] = useState("accordion1");
    const [childExpanded, setChildExpanded] = useState(false);
    const getPageTitle = () => {
        return "Scener – FAQ";
    };

    const handleChange = (accordion) => (event, isExpanded) => {
        setExpanded(isExpanded ? accordion : false);
        window.scrollTo(0, 0);
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
            <Grid container className={classes.topContainer}>
                <Grid item xs={12} sm={12} md={(isLaptop && 12) || 4}>
                    <Box className={classes.topBoxContainer}>
                        <Typography component="h1" variant="h1" className={classes.primary}>
                            Help? Questions? {isMobile && <br />}We’re here.
                        </Typography>
                        <Typography variant="body1" className={classname(classes.secondary, classes.gutterBottom)}>
                            Thank you for using Scener! Scener lets you sync your viewing and socialize with others while using the same streaming
                            services you know and love.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={(isLaptop && 12) || 8}>
                    <Accordion
                        expanded={expanded === "accordion1"}
                        onChange={handleChange("accordion1")}
                        square
                        elevation={0}
                        classes={{ root: classes.accordionRoot, expanded: classes.expanded }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            classes={{
                                root: classes.accordionSummaryRoot,
                                expandIcon: classes.expandIcon,
                                content: classes.accordionSummaryContent,
                                expanded: classes.expanded
                            }}
                        >
                            <Typography variant="h3" component="h3" className={classes.primaryTitle}>
                                General questions
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Is Scener free?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        Yes, hosting and joining watch parties on Scener is free. Sometimes hosts may require a ticket or a specific
                                        movie rental from a partner service to participate.
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Which browsers are compatible {isMobile && <br />} with Scener?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph} paragraph>
                                        Google Chrome must be used to host or view watch parties on all laptop or desktop computers. You must also
                                        install the{" "}
                                        <Link
                                            href="https://chrome.google.com/webstore/detail/scener-%E2%80%93-virtual-movie-th/lkhjgdkpibcepflmlgahofcmeagjmecc"
                                            target="_new"
                                        >
                                            Scener Google Chrome Extension.
                                        </Link>
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        On mobile and tablet devices you can use any browser to view a live host in a theater but can not host or
                                        co-host. To view the streaming content you must synchronize it on a secondary device like a TV.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        How do I get Scener?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        On a laptop or desktop computer, you can get the{" "}
                                        <Link
                                            href="https://chrome.google.com/webstore/detail/scener-%E2%80%93-virtual-movie-th/lkhjgdkpibcepflmlgahofcmeagjmecc"
                                            target="_new"
                                        >
                                            Scener Google Chrome Extension
                                        </Link>{" "}
                                        for free from the Chrome Web Store. This is also accessible by visiting ‘Get Scener’ on our webpage.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        What streaming services do you support?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>Scener supports most major streaming services:</Typography>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography className={classes.paragraph}>No account required: YouTube, Vimeo</Typography>
                                        </li>
                                        <li>
                                            <Typography className={classes.paragraph}>
                                                Regular subscriptions required: Netflix, Disney +, Prime Video, HBO Max, Hotstar, Alamo On Demand,
                                                Shudder, Youtube
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography className={classes.paragraph}>Premium Accounts (no ads): Hulu, Funimation</Typography>
                                        </li>
                                    </ul>
                                    <Typography paragraph className={classes.paragraph}>
                                        Remember, each guest needs their own streaming service account for most services, so picking a popular
                                        streaming service will ensure everyone can join the watch party.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        If guests live in another country, they can still use Scener together as long as they have access to the same
                                        streaming service and show or movie content. Keep in mind, certain shows and movies might not be available in
                                        different countries. Streaming services manage their own rights for shows and movies across different
                                        countries, which Scener has no control over. Pro tip: Netflix Originals tend to be available in all
                                        territories.
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        What equipment do I need?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph className={classes.paragraph}>
                                        All you need is a laptop or desktop computer (Windows, Mac, or Chromebook) and a broadband internet connection
                                        to host a watch party with chat on Scener. A webcam is required for video and headphones are strongly
                                        recommended to avoid echo if you use audio.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        To join a watch party, you need either a computer with broadband or a mobile device with a fast (LTE, 5G or
                                        Wifi-based) internet connection. If you join a public watch party from a mobile device, you will need a second
                                        device, such as a connected TV or computer, to pull up the show or movie being watched and synchronize it
                                        manually.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Does everyone need their own streaming account to watch together?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        For services that require a subscription, yes. For example, everyone will need access to their own Netflix
                                        account (or HBO Max, Disney+, Hulu Premium, etc.) to watch. If you are already signed in on Chrome, you should
                                        not need to sign in again.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Can I host a watch party with a movie rental or other piece of paid content?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        Yes. You can use a service like Prime Video or YouTube to rent a movie or show and watch it in a room or
                                        theater. To see the video, everyone in the room or theater will need to rent the title being watched. Services
                                        that charge a premium fee to access some titles early, such as Disney+, are also compatible with Scener if all
                                        viewers have purchased that package.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        How many people can watch together?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        In a room, up to 10 people can watch together and optionally turn on their camera. In a theater an unlimited
                                        number of guests can join and participate in chat. You can add up to nine co-hosts on camera.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        How do I host a watch party?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        To host, you must be on a laptop or desktop computer, logged into your account, and have the Scener Chrome
                                        Extension installed. Then simply click the “Host a watch party” button. The next screen will have two watch
                                        party options: room or theater. A room is an invite-only experience, that allows up to 10 guests on camera or
                                        microphone at once. A theater allows you to host an event with unlimited guests in chat but only you and your
                                        co-hosts can be on camera.{" "}
                                        <Link href="https://design.scener.com/watch-party-tips" target="_new">
                                            Get started with Watch Parties
                                        </Link>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        How do I invite my friends?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography variant="h5" component="h5" paragraph>
                                        Inviting friends to a theater:
                                    </Typography>
                                    <Typography paragraph className={classes.paragraph}>
                                        Once a Theater is live, the host can invite guests by copying the share URL in the sidebar and sharing it with
                                        their community. An unlimited number of guests can chat in the theater sidebar.
                                    </Typography>
                                    <Typography paragraph className={classes.paragraph}>
                                        When a watch party theater is started, the host has the option to add co-hosts. Co-hosts can choose to be on
                                        camera or just audio.
                                    </Typography>
                                    <Typography variant="h5" component="h5" paragraph>
                                        Inviting friends to a room:
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        After creating a room, Scener generates a unique 16-character code for that event. Copy the code to share it
                                        with guests, OR click the ‘Copy Invite Link’ in the Watch Party sidebar and share the URL directly. Like other
                                        video platforms, once the link is created, the same group of guests can join it again and again.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Who has control of the movie/show?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        Only the person holding the remote can control pause/play functions to ensure the smoothest, most harmonious
                                        sync experience, The Host can pass the remote to whomever they want by clicking on the remote icon and
                                        clicking on a friend’s name.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === "accordion2"}
                        onChange={handleChange("accordion2")}
                        square
                        elevation={0}
                        classes={{ root: classes.accordionRoot, expanded: classes.expanded }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            classes={{ root: classes.accordionSummaryRoot, expandIcon: classes.expandIcon }}
                        >
                            <Typography variant="h5" component="h5" className={classes.primaryTitle}>
                                Theater Issues
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        I hear an echo!
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        Everyone must wear headphones with Scener if your microphones are turned on – otherwise you will hear the
                                        other person’s delayed movie audio. Either grab some headphones or mute your audio and you’ll say goodbye to
                                        that echo!
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        My camera or microphone won’t turn on
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph className={classes.paragraph}>
                                        First, quit Chrome (by pressing command+Q or ctrl+Q) and retry. Sometimes Chrome loses your webcam.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        Second, you may have accidentally denied access to Scener for your camera or mic. Do this: type
                                        “chrome://settings” into your browser toolbar above. Then search for “camera” and select ‘Site Settings’. Find
                                        ‘scener.com’ and choose ‘Reset settings’. Then try to join a theater again.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        My camera or microphone isn’t working in the watch party
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        First, press the ‘?’ icon in the theater control bar. Then select ‘My microphone and/or camera are not
                                        working’. Next, click the ‘Re-Sync Scener’ button. Now your issue should be solved.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-11.png"
                                        atl="watch_11"
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Something seems out-of-sync, what do I do?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        First, press the ‘?’ icon in the theater control bar. Then select ‘My video isn’t syncing with others.’ Next,
                                        click the ‘Re-Launch Show’ button. Now your issue should be solved.
                                    </Typography>
                                    <img
                                        className={classname(classes.paragraphImage, classes.paragraphImageHalf)}
                                        src="/images/watch-party-tips/watch-11.png"
                                        atl="watch_11"
                                    />
                                    <Typography className={classes.paragraph}>
                                        It’s normal for someone in a theater to be one or two seconds out of sync from others. If your show is playing
                                        but is more than a few seconds out of sync, try closing the streaming content browser window. It will
                                        automatically re-open and attempt to re-sync.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        How do I use full screen?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography className={classes.paragraph}>On Mac:</Typography>
                                            <ul>
                                                <li>
                                                    <Typography className={classes.paragraph}>Click full screen in your Netflix window</Typography>
                                                </li>
                                                <li>
                                                    <Typography className={classes.paragraph}>Press the [Control] + [Up] keys</Typography>
                                                </li>
                                                <li>
                                                    <Typography paragraph className={classes.paragraph}>
                                                        You’ll see your Netflix window at the top of your screen. Click and drag your Scener sidebar
                                                        into the Netflix window.
                                                    </Typography>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Typography className={classes.paragraph}>On Windows:</Typography>
                                            <ul>
                                                <li>
                                                    <Typography className={classes.paragraph}>Click full screen in your Netflix window</Typography>
                                                </li>
                                                <li>
                                                    <Typography className={classes.paragraph}>Press [Alt] + [Tab] and select Scener</Typography>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Issues with VPNs or Firewalls
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                        Scener requires certain open ports in order to communicate with others in the theater. If Scener is not
                                        working correctly, try disabling your VPN or Firewall (don’t forget to turn it back on afterward).
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <Grid container className={classes.bottomContainer}>
                <Grid item xs={12} md={(isLaptop && 12) || 4}>
                    <Box className={classes.leftBoxContainer}>
                        <Typography component="h1" variant="h1" className={classes.primary}>
                            Still stuck?
                        </Typography>
                        <Typography variant="body1" className={classname(classes.secondary, classes.secondaryBold)}>
                            If you were unable to find a solution please contact us at{" "}
                            <Link href="mailto:support@scener.com" className={classes.linkButton}>
                                support@scener.com
                            </Link>{" "}
                            with some information about what went wrong. Some helpful details to include would be:
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={(isLaptop && 12) || 8}>
                    <Box className={classes.boxContainer}>
                        <Box className={classes.paragraphContainer}>
                            <Box component="span" className={classes.bullet} />
                            <Typography className={classes.paragraphText}>Operating system</Typography>
                        </Box>
                        <Box className={classes.paragraphContainer}>
                            <Box component="span" className={classes.bullet} />
                            <Typography className={classes.paragraphText}>What version of Chrome are you using?</Typography>
                        </Box>
                        <Box className={classes.paragraphContainer}>
                            <Box component="span" className={classes.bullet} />
                            <Typography className={classes.paragraphText}>
                                What streaming service were you {isMobile && <br />} trying to use.
                            </Typography>
                        </Box>
                        <Box className={classes.paragraphContainer}>
                            <Box component="span" className={classes.bullet} />
                            <Typography className={classes.paragraphText}>Chrome extensions or VPNs you are using</Typography>
                        </Box>
                        <Box className={classes.paragraphContainer}>
                            <Box component="span" className={classes.bullet} />
                            <Typography className={classes.paragraphText}>Screenshots of the page you are experiencing issues in.</Typography>
                        </Box>
                        <Box className={classes.paragraphContainer}>
                            <Box component="span" className={classes.bullet} />
                            <Typography className={classes.paragraphText}>The steps leading up to the issue.</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box className={classes.dividerContainer}>
                <Divider />
            </Box>
        </Page>
    );
}

export default withAppState(FaqPage);
