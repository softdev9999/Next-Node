import { useState } from "react";
import Head from "next/head";
import NavLink from "next/link";
import Page from "components/Page/Page";
import withAppState from "components/Page/withAppState";
import NavPopup from "components/NavPopup/NavPopup";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
import { useMediaQuery, useTheme, makeStyles, Grid, Typography, Box, Button, Link, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
        [theme.breakpoints.down("sm")]: {
            paddingLeft: 0,
            paddingRight: 0
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: 0,
            paddingRight: 0
        }
    },
    container: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {
            paddingLeft: 0,
            paddingRight: 0
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        }
    },
    bannerContainer: {
        display: "flex",
        alignItems: "stretch",
        minHeight: theme.functions.rems(553),
        height: "100%",
        width: "100%",
        backgroundImage: "url(/images/about/about-banner.png)",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        [theme.breakpoints.between(720, 976)]: {
            minHeight: theme.functions.rems(443),
            marginTop: theme.functions.rems(25)
        },
        [theme.breakpoints.down("sm")]: {
            background: "none",
            minHeight: "auto",
            marginTop: theme.spacing(4)
        },
        [theme.breakpoints.down("xs")]: {
            background: "none",
            minHeight: "auto",
            marginTop: theme.spacing(4)
        }
    },
    gridContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    itemContainer: {
        height: "100%",
        [theme.breakpoints.between(720, 976)]: {
            height: "auto"
        },
        [theme.breakpoints.down("sm")]: {
            height: "auto",
            marginTop: theme.functions.rems(50),
            backgroundRepeat: "no-repeat",
            backgroundImage: "url(/images/about/about-banner-mobile.png)"
        },
        [theme.breakpoints.down("xs")]: {
            height: "auto",
            marginTop: theme.functions.rems(50),
            backgroundRepeat: "no-repeat",
            backgroundImage: "url(/images/about/about-banner-mobile.png)"
        }
    },
    sectionContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "stretch",
        justifyContent: "space-between",
        margin: theme.spacing(6, 0, 12),
        [theme.breakpoints.between(720, 976)]: {
            flexFlow: "row wrap",
            marginBottom: theme.spacing(6)
        },
        [theme.breakpoints.down("sm")]: {
            flexFlow: "column nowrap",
            marginBottom: theme.spacing(6)
        },
        [theme.breakpoints.down("xs")]: {
            flexFlow: "column nowrap",
            marginBottom: theme.spacing(6)
        }
    },
    boxContainer: {
        display: "flex",
        flexDirection: "column",
        flex: "0 0 24%",
        minHeight: theme.functions.rems(648),
        height: "100%",
        borderRadius: theme.functions.rems(8),
        padding: theme.spacing(3, 2, 5),
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.05),
        [theme.breakpoints.between(720, 976)]: {
            flex: "0 0 50%",
            height: "auto",
            minHeight: "auto",
            marginBottom: theme.functions.rems(20)
        },
        [theme.breakpoints.down("sm")]: {
            marginBottom: theme.functions.rems(20),
            flex: "auto",
            minHeight: "auto",
            maxWidth: "100%",
            height: "auto"
        },
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.functions.rems(20),
            flex: "auto",
            minHeight: "auto",
            maxWidth: "100%",
            height: "auto"
        }
    },
    leftContent: {
        paddingLeft: theme.functions.rems(118),
        [theme.breakpoints.between(720, 976)]: {
            paddingLeft: theme.functions.rems(16)
        },
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.functions.rems(20)
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.functions.rems(35)
        }
    },
    bannerBackground: {
        maxWidth: theme.functions.rems(480),
        minWidth: theme.functions.rems(480),
        width: "100%",
        height: "calc(100% - 10px)",
        transform: "rotate(-2deg)",
        backgroundImage: "url(/images/about/couchpals-transparent.png)",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        [theme.breakpoints.between(720, 976)]: {
            height: theme.functions.rems(278),
            maxWidth: theme.functions.rems(283),
            minWidth: theme.functions.rems(283)
        }
    },
    imageContainer: {
        maxHeight: theme.functions.rems(278),
        minHeight: theme.functions.rems(278),
        width: "100%",
        height: "100%",
        display: "flex",
        "& img": {
          objectFit: "contain"
        }
    },
    contentContainer: {
        padding: theme.spacing(3, 3, 0),
        flexGrow: 1,
        flexBasis: "100%",
        display: "flex",
        flexDirection: "column"
    },
    descriptionContainer: {
        flexGrow: 1,
        flexBasis: "100%"
    },
    dividerContainer: {
        margin: theme.spacing(12, 0, 4),
        [theme.breakpoints.between(720, 976)]: {
            marginTop: theme.spacing(7)
        }
    },
    buttonContainer: {
        marginTop: theme.spacing(3),
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(4)
        }
    },
    paragraph: {
        fontWeight: 400
    },
    paragraphTitle: {
        fontWeight: "bold",
        lineHeight: theme.functions.rems(44),
        marginBottom: theme.functions.rems(3)
    },
    description: {
        fontWeight: 400
    },
    gutterBottom: {
        marginBottom: theme.spacing(3)
    },
    buttonLink: {
        color: theme.palette.secondary.main,
        fontWeight: "bold",
        letterSpacing: 0,
        "&:hover": {
            textDecoration: "none"
        }
    },
    button: {
        minHeight: theme.functions.rems(39),
        border: "none",
        boxShadow: "none",
        [theme.breakpoints.down("xs")]: {
            width: theme.functions.rems(240)
        },
        "&:hover": {
            border: "none"
        },
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: theme.spacing(6),
            background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        "&:before": {
            content: "''",
            background: "rgba(9, 6, 31, 0.8)",
            backgroundClip: "padding-box",
            border: "solid 2px transparent",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            borderRadius: theme.spacing(6)
        },
        "& > span": {
            zIndex: 5,
            fontSize: theme.functions.rems(16),
            fontWeight: 800,
            letterSpacing: 0.4
        }
    },
    dialogPaper: {
        padding: theme.spacing(2, 4, 4),
        borderRadius: 0,
        background: theme.gradients.create(21.02, "#1F0150 0%", "#09061F 100%")
    },
    headerContainer: {
        marginBottom: theme.functions.rems(20)
    },
    headerTitle: {
        fontWeight: "bold",
        lineHeight: theme.functions.rems(44)
    },
    videoContainer: {},
    video: {
        maxWidth: "100%",
        maxHeight: "100%",
        minHeight: "100%",
        minWidth: "100%"
    }
}));

function AboutPage() {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const isTablet = useMediaQuery(theme.breakpoints.between(500, 720));
    const isLaptop = useMediaQuery(theme.breakpoints.between(720, 976));
    const [open, setOpen] = useState(false);
    const getPageTitle = () => {
        return "Scener – About";
    };
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Page fullWidth={!(isTablet || isLaptop)} halfWidth={isTablet || isLaptop} containerClassName={classes.mainContainer}>
            <Head>
                <title>{getPageTitle()} </title>
                {createOpenGraphTags({ title: getPageTitle() })}
            </Head>
            <div className={classes.container}>
                <div className={classes.bannerContainer}>
                    <Grid container className={classes.gridContainer} wrap={(isMobile || isTablet || isLaptop) ? "wrap" : "nowrap"}>
                      {(isMobile || isTablet || isLaptop) && <Grid item >
                          <img style={{width: "100%"}} src="/images/about/couchpals-transparent.png" />
                      </Grid>}
                        <Grid item xs={12} md={6}>
                            <Box className={classes.leftContent}>
                                <Typography component="h1" variant="h1" className={classes.gutterBottom}>
                                    Virtual movie night: watch parties with Scener
                                </Typography>
                                <Typography variant="h5" className={classes.paragraph}>
                                    Scener is the best way to watch shows and movies with others. Whether you’re looking to hang out privately with
                                    friends, or connect with fans in your virtual theater, Scener is the only way to watch premium entertainment from
                                    the major services in perfect sync with people around the world.
                                </Typography>
                            </Box>
                        </Grid>
                        {(!isMobile && !isTablet && !isLaptop) && <Grid item className={classes.itemContainer}>
                            <img style={{width: "100%"}} src="/images/about/couchpals-transparent.png" />
                        </Grid>}
                    </Grid>
                </div>
                <div className={classes.sectionContainer}>
                    <Box className={classes.boxContainer}>
                        <div className={classes.imageContainer}>
                            <img src="/images/about/alien-headphones-transparent.png" alt="the basics" />
                        </div>
                        <div className={classes.contentContainer}>
                            <div className={classes.descriptionContainer}>
                                <Typography component="h2" variant="h2" className={classes.paragraphTitle}>
                                    The basics
                                </Typography>
                                <Typography variant="h5" component="p" className={classes.description}>
                                    Scener syncs shows or movies with everyone in your watch party. Video, audio, and text chat allow you to share and
                                    interact in real time. It’s like being in a virtual movie theater!
                                </Typography>
                            </div>
                            <div className={classes.buttonContainer}>
                                <Button fullWidth variant="outlined" className={classes.button} onClick={handleClick}>
                                    Watch video
                                </Button>
                            </div>
                        </div>
                    </Box>
                    <Box className={classes.boxContainer}>
                        <div className={classes.imageContainer}>
                            <img src="/images/about/alien-couch-rocket-transparent.png" alt="getting started" />
                        </div>
                        <div className={classes.contentContainer}>
                            <div className={classes.descriptionContainer}>
                                <Typography component="h2" variant="h2" className={classes.paragraphTitle}>
                                    Getting started
                                </Typography>
                                <Typography variant="h5" component="p" className={classes.description}>
                                    To get started with Scener, you need a laptop or desktop computer with Google Chrome and the free{" "}
                                    <Link
                                        href="https://chrome.google.com/webstore/detail/scener-%E2%80%93-virtual-movie-th/lkhjgdkpibcepflmlgahofcmeagjmecc"
                                        target="_new"
                                    >
                                        Scener Chrome Extension.
                                    </Link>{" "}
                                    You can then invite friends to a private room or join a public theater to watch content, with a subscription, from
                                    almost any major streaming platforms. We support over 10 streaming platforms including Netflix, YouTube, Disney+
                                    and Prime Video.
                                </Typography>
                            </div>
                            <div className={classes.buttonContainer}>
                                <NavLink href="/faq" passHref>
                                    <Button fullWidth variant="outlined" className={classes.button}>
                                        Learn more
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                    </Box>
                    <Box className={classes.boxContainer}>
                        <div className={classes.imageContainer}>
                            <img src="/images/about/popcorn-laptop-transparent.png" alt="watch parties" />
                        </div>
                        <div className={classes.contentContainer}>
                            <div className={classes.descriptionContainer}>
                                <Typography component="h2" variant="h2" className={classes.paragraphTitle}>
                                    Watch parties
                                </Typography>
                                <Typography variant="h5" component="p" className={classes.description}>
                                    You can be the host of a watch party in a room or a theater. Unlimited guests can join a theater, but only the
                                    host and co-hosts that they choose can be on camera. Rooms are invite-only, and up to 10 guests can be on camera.
                                </Typography>
                            </div>
                            <div className={classes.buttonContainer}>
                                <NavLink href="/watch-party-tips" passHref>
                                    <Button fullWidth variant="outlined" className={classes.button}>
                                        Watch party tips
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                    </Box>
                    <Box className={classes.boxContainer}>
                        <div className={classes.imageContainer}>
                            <img src="/images/about/live-audience-transparent.png" alt="perfect host" />
                        </div>
                        <div className={classes.contentContainer}>
                            <div className={classes.descriptionContainer}>
                                <Typography component="h2" variant="h2" className={classes.paragraphTitle}>
                                    Perfect host
                                </Typography>
                                <Typography variant="h5" component="p" className={classes.description}>
                                    Hosting a watch party while watching your favorite movie or show is a lot of fun! That said, there are a few tips
                                    and tricks that can enhance the experience for you and your guests: wear headphones to prevent echo, check
                                    lighting and internet speed, share scheduled parties ahead of time, use a streaming service most people have
                                    access to, and interact with your guests.
                                </Typography>
                            </div>
                            <div className={classes.buttonContainer}>
                              <NavLink href="/build-an-audience" passHref>
                                <Button fullWidth variant="outlined" className={classes.button}>
                                    Hosting tips
                                </Button>
                              </NavLink>
                            </div>
                        </div>
                    </Box>

                </div>
                <Grid container justify="center">
                    <Grid item xs={12} md={(isLaptop && 8) || 12}>
                        <Typography component="div" align="center" variant="h5" className={classes.paragraph}>
                            For more information, read our{" "}
                            <NavLink href="/faq" passHref>
                                <Link className={classes.buttonLink}>FAQ</Link>
                            </NavLink>
                            . If you are having trouble using Scener, send us an e-mail at{" "}
                            <Link href="mailto:support@scener.com" className={classes.buttonLink}>
                                support@scener.com.
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.dividerContainer}>
                    <Grid item xs={12} md={12}>
                        <Divider />
                    </Grid>
                </Grid>
            </div>
            <NavPopup
                open={open}
                dialog
                fullScreen={false}
                classes={{
                    paper: classes.dialogPaper
                }}
                maxWidth="lg"
                onDismiss={handleClose}
            >
                <>
                    <div className={classes.headerContainer}>
                        <Typography component="h2" variant="h2" className={classes.headerTitle}>
                            Watch together with Scener
                        </Typography>
                    </div>
                    <div className={classes.videoContainer}>
                        <video autoPlay controls className={classes.video} src="https://scener-media-prod.s3-us-west-2.amazonaws.com/video/host-a-watch-party-with-scener2.mp4" />
                    </div>
                </>
            </NavPopup>
        </Page>
    );
}

export default withAppState(AboutPage);
