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
        lineHeight: theme.functions.rems(24),
        marginBottom: "1rem"
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

function BuildAudiencePage() {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const isTablet = useMediaQuery(theme.breakpoints.between(500, 720));
    const isLaptop = useMediaQuery(theme.breakpoints.between(720, 976));
    const [expanded, setExpanded] = useState("accordion1");
    const [childExpanded, setChildExpanded] = useState(false);
    const getPageTitle = () => {
        return "Scener – Build an Audience";
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
              <Grid item xs={12} md={(isLaptop && 12) || 3}>
                  <Box >
                      <Typography variant="h1" component="h1" className={classes.primary}>
                          Grow your audience
                      </Typography>
                      <Typography variant="h5" className={classes.secondary}>
                          Learn how to find and build a dedicated audience for your watch parties, and keep them coming back for more
                      </Typography>
                  </Box>
              </Grid>

                <Grid item xs={12} md={(isLaptop && 12) || 9} className={classes.rightContainer}>
                    <Accordion
                        expanded={expanded === "profile"}
                        onChange={handleChange("profile")}
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
                                Build out your profile
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
                                        Profile elements
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      First things first, make sure your profile is complete including a profile photo, banner image, bio, about section,
                                      and schedule of upcoming Watch Parties.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      People enjoy engaging with profiles that seem robust, so building out your profile is the first step in getting them to
                                      come back for more.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      <ol>
                                        <li>Profile banner: give viewers the chance to get to know your interests a little bit.</li>
                                        <li>Profile photo: make sure it's a well lit, non pixelated photo.</li>
                                        <li>Bio: write a brief intro to let people know more about you.</li>
                                        <li>Watch party description: give people a better understanding of the type of watch parties you host.</li>
                                        <li>Scheduled events: create a robust list of events, meeting every week at the same time,
                                          to build a habit forming pattern with your viewers.</li>
                                    </ol>
                                    </Typography>
                                    <div className={classes.imageContainer}>
                                        <img src="/images/build-an-audience/profile.jpg" alt="getting started" />
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === "brand"}
                        onChange={handleChange("brand")}
                        square
                        elevation={0}
                        classes={{ root: classes.accordionRoot, expanded: classes.expanded }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            classes={{ root: classes.accordionSummaryRoot, expandIcon: classes.expandIcon }}
                        >
                            <Typography variant="h5" component="h5" className={classes.primaryTitle}>
                                Brand yourself
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
                                        Start your brand
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      Create a personal brand that helps people recognize your hosted shows, while also growing your audience.
                                      To make your brand stand out you must focus on what to watch, how to present yourself visually and how to convey your personality. However, when laying the groundwork, be true to yourself!

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
                                        Content theme and genre
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography paragraph className={classes.paragraph}>
                                      Develop a theme that guides what you stream during your Watch Parties. Do you only show the classics? Anime? Marvel? New releases? Oscar nominees? People are more likely to follow hosts if they know what kind of content they’ll see,
                                      so staying consistent with what you’re watching with your guests increases your chances of gaining followers.
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        Pro tip: Pick content you want to watch and are comfortable reacting to in front of your audience.
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
                                        Content length
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      Does your audience have time for a movie or a show? A movie might be a longer watch experience but your audience gets to experience the whole story in one session with you. However, when hosting episodes of shows you have the opportunity to set a recurring schedule. Of course there's nothing stopping you from binging a whole season of a show with your audience in one session.

                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      Pro tip: No matter what length of content you choose the most important thing to focus on is the frequency in which you engage with your audience.
                                    </Typography>
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
                                        Streaming services
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      Choose your streaming services based on your theme and genre. For example, if your theme is “Disney Princesses” you
                                      might want to choose Disney+ as your go-to platform. You don’t have to stick to the same streaming service for every
                                      Watch Party, but choosing a mix of the ones most people subscribe allows the most guests to attend.

                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      Niche audiences may subscribe to smaller streaming services, so depending on your theme and movie genres,
                                      you may want to choose less-prominent platforms to attract a different followership.

                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      Pro tip: Be sure to explore each streaming platform before you start the Watch Party to make sure the film you want to view is available!

                                    </Typography>
                                    <div className={classes.imageContainer}>
                                        <img src="/images/build-an-audience/services.jpg" alt="streaming services" />
                                    </div>
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
                                        Profile images
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                  <Typography paragraph className={classes.paragraph}>
                                      On your profile, the user image should show your face so your audience can recognize you and the banner image should show more of your brand.
                                      Your banner image could contain your brand colors, a logo, or other creative illustrations/artwork.
                                  </Typography>
                                  <Typography paragraph className={classes.paragraph}>
                                      When creating images for your profile use the sizes below:
                                  </Typography>
                                    <ul className={classes.listContainer}>
                                        <li>
                                            <Typography className={classes.paragraph}>User profile image upload size: 300x300</Typography>
                                        </li>
                                        <li>
                                            <Typography className={classes.paragraph}>Profile banner image upload size:  1500x600</Typography>
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
                                        Host clothing
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      When picking out your outfit to host, you can wear something casual or you can bring energy to
                                      your watch party by dressing in character for the show/movie.

                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Lighting
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      To have a well lit watch party, leave the light on in your room or buy a cheap ring light with a usb plug for your computer.
                                      This helps take away any shadows on your face cast by an overhead light.
                                      Don't rely on just the light coming from your computer screen. Your face will be poorly lit and your audience numbers will shrink.
                                    </Typography>
                                    <div className={classes.imageContainer}>
                                        <img src="/images/build-an-audience/lighting.jpg" alt="lighting" />
                                    </div>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Video background
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      The last element of your visual branding is the video background.
                                      Get creative! Your room is a place to show off what you are about.
                                      Do you have a collection of something, a particular color scheme, or artwork?
                                      Keep in mind your face should take up most of the video container so people can see you.
                                      Snap Camera works inside scener and adds an additional layer of expression.

                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Persona
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      While hosting will you be funny, sarcastic, informational? Pick a style and test it out --
                                      don’t be afraid to get creative. Once you find a style that comes naturally and your audience enjoys it… stick with it!

                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      Above all-- remember to have fun! Scener’s goal is for your and your followers to enjoy watching your favorite films together,
                                      so don’t take yourself too seriously. When you’re having a good time, people will sense that energy, and be more
                                      entertained as well.

                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                      Pro tip: When hosting always introduce yourself and your channel. Tell your audience who you are and what
                                      content you picked to watch and why.

                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === "traffic"}
                        onChange={handleChange("traffic")}
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
                                Generate incoming traffic
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Be consistent
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      People follow hosts because they enjoy attending their Watch Parties on a regular basis.
                                      Building a set schedule that others can rely on—even if it’s just once per month—gives your audience something to look forward to.
                                      Think about it, if an account only hosts a party randomly every few months, why would you want to follow with it?
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Check out Other Hosts’ for Inspiration
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                    If you get stuck, check out other hosts’ profiles and watch parties for inspiration. What do you like about how they host?
                                    Do they have a fun sign off or wear a certain style of clothing that fits their style or genre? How do they interact with their viewers?
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Consider Inviting Co-hosts
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      When there’s a conversation between people it can make watching more interesting. Think about who could bring an interesting perspective to your theater.
                                      Plus invite co-hosts that have their own following to increase your following.
                                    </Typography>
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Become a verified user
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      Becoming a verified user tells your audience you are who you say you are.
                                      Becoming a verified user will give you the potential to be highlighted on Scener’s homepage which can give you a lot of traffic.
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
                                    <Typography variant="h5" component="h5" className={classes.secondaryTitle}>
                                        Share on different social channels
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails classes={{ root: classes.childAccordionDetailsRoot }}>
                                    <Typography className={classes.paragraph}>
                                      Invite your social media followers on other platforms to attend your Watch Parties and follow you on Scener.

Share your theater code or URL on your other social channels to gain attendees.

You can even link your social accounts to your Scener profile so your followers can engage with you elsewhere.

                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            <Box className={classes.dividerContainer}>
                <Divider />
            </Box>
        </Page>
    );
}

export default withAppState(BuildAudiencePage);
