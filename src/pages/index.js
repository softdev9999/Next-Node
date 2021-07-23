import Head from "next/head";
import classname from "classnames";
import Page from "components/Page/Page";

import Section from "components/Section/Section";
import { makeStyles, Typography, Grid, Button, Divider, Box, useMediaQuery, useTheme } from "@material-ui/core";
import LaptopVideo from "components/LaptopVideo/LaptopVideo";
import LaptopImage from "components/LaptopImage";
import GetScenerButton from "components/GetScenerButton/GetScenerButton";
import BGStars from "components/Page/svg/stars.svg";
import BGStarsSmall from "components/Page/svg/stars-mobile.svg";
import { Axios, Deadline, Forbes, TechCrunch, TheVerge, Variety } from "components/Icon/PressLogo";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";

const useStyles = makeStyles((theme) => ({
    headerContainer: {
        marginTop: theme.spacing(5)
    },
    contentContainer: {
        marginTop: theme.spacing(2)
    },
    boxContainer: {
        padding: theme.spacing(6, 4),
        background: theme.functions.rgba(theme.palette.common.black, 0.2),
        [theme.breakpoints.down("lg")]: {
            padding: theme.spacing(6, 2)
        }
    },
    boxContent: {},
    sectionContent: {
        maxWidth: theme.functions.rems(478),
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.down("xs")]: {
            maxWidth: "100vw"
        }
    },
    h1: {
        fontSize: theme.functions.rems(40),
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(44)
    },
    primary: {
        fontSize: theme.functions.rems(20),
        fontWeight: 800,
        letterSpacing: 0.35,
        lineHeight: theme.functions.rems(24),
        textTransform: "uppercase"
    },

    secondary: {
        fontSize: theme.functions.rems(40),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(42)
    },
    containedButton: {
        minWidth: theme.functions.rems(160)
    },
    outlinedButton: {
        minWidth: theme.functions.rems(160)
    },
    outlinedBackground: {
        "&:before": {
            background: "#1c0d42",
            backgroundClip: "padding-box"
        }
    },
    buttonLabel: {
        zIndex: 5,
        fontSize: theme.spacing(2)
    },
    paragraph: {
        fontSize: theme.spacing(2),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    paragraphPadder: {
        marginBottom: theme.spacing(4)
    },
    paragraphBottom: {
        marginBottom: theme.spacing(3)
    },
    dividerContainer: {
        marginBottom: theme.spacing(1)
    },
    divider: {
        background: theme.gradients.create(45, theme.functions.rgba("#8310fe", 0.5), theme.functions.rgba("#6008ff", 0.5))
    },
    borderDivider: {
        height: 1,
        marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.common.white
    },
    gutterBottom: {
        marginBottom: theme.spacing(1.6)
    },
    gutterTop: {
        marginTop: theme.spacing(5)
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        marginBottom: theme.spacing(6),
        height: "auto",
        maxWidth: theme.functions.rems(518),
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "flex-end",
        paddingTop: theme.spacing(5),
        alignItems: "flex-start",
        [theme.breakpoints.down("md")]: {
            justifyContent: "center",
            maxWidth: "100vw",
            paddingTop: theme.spacing(0)
        }
    },

    image: {
        boxShadow: "4px 4px 20px 0 rgba(0,0,0,0.25)",
        position: "relative",
        flex: "0 0 " + theme.functions.rems(336),
        width: theme.functions.rems(336),
        height: "auto",
        [theme.breakpoints.down("md")]: {
            position: "relative",
            flex: "0 0 " + theme.functions.rems(336)
        }
    },
    laptopImage: {
        position: "absolute",
        left: theme.spacing(-5),
        top: theme.spacing(0),
        width: theme.functions.rems(268),
        [theme.breakpoints.down("md")]: {
            position: "relative",
            left: "auto",
            top: "auto",
            height: "100%",
            flex: "0 0 " + theme.functions.rems(268),
            marginBottom: theme.spacing(3.5)
        }
    },
    backgroundStars: {
        position: "absolute",
        top: 0,
        left: "50%",
        maxHeight: "100%",
        transform: "translate(-50%, 0%)",
        overflow: "hidden",
        zIndex: -1,
        maxWidth: "100vw"
    }
}));

function Home() {
    const classes = useStyles();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <Page
            showActivityDrawer
            maxWidth="lg"
            backgroundLayer={
                <Box className={classes.backgroundStars}>
                    {isXs ? <BGStarsSmall width="414px" height="3923px" /> : <BGStars height="4050px" width="1564px" />}
                </Box>
            }
        >
            <Head>
                <title>Scener – Watch Netflix and more with friends</title>
                {createOpenGraphTags()}
            </Head>

            <Section disableGutters={!isXs}>
                <LaptopVideo style={{ width: "100%" }} />
                <Grid container justify="center" className={classes.headerContainer}>
                    <Grid item xs={12} sm={12} md={12}>
                        {isXs ? (
                            <Typography variant="h1" align="center" gutterBottom className={classes.h1}>
                                Welcome to&nbsp;the&nbsp;virtual movie&nbsp;theater
                            </Typography>
                        ) : (
                            <Typography variant="h1" align="center" gutterBottom className={classes.h1}>
                                Welcome to the virtual&nbsp;movie&nbsp;theater
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Grid container justify="center" className={classes.contentContainer}>
                    <Grid item xs={12} sm={12} md={12} lg={11}>
                        {isXs ? (
                            <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphPadder)}>
                                Host watch parties across the major streaming services, and connect with a&nbsp;vibrant&nbsp;community of TV and
                                movie&nbsp;fans&nbsp;like&nbsp;you.
                            </Typography>
                        ) : (
                            <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphPadder)}>
                                Host watch parties across the major streaming services, and <br />
                                connect with a vibrant community of TV and movie fans like you.
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} container justify="center" spacing={2}>
                        <Grid item xs={"auto"}>
                            <GetScenerButton classname={classes.containedButton} trackingSource="Home" />
                        </Grid>
                        <Grid item xs={"auto"}>
                            <Button
                                href={"/about"}
                                variant="outlined"
                                color="primary"
                                classes={{
                                    root: classname(classes.outlinedButton, classes.outlinedBackground)
                                }}
                            >
                                Learn more
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Section>
            {isXs && <Divider component="div" className={classes.divider} />}
            <Section>
                <Grid container spacing={2} justify="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Box className={classes.boxContainer}>
                            <Box className={classes.imageContainer}>
                                <LaptopImage src="/images/home/LiveHostLaptop.jpg" className={classes.laptopImage} />

                                <img className={classes.image} src="/images/home/LiveHost.jpg" />
                            </Box>
                            <Grid container justify="center" className={classes.boxContent} classes={{ root: classes.sectionContent }}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" align="center" className={classname(classes.primary, classes.gutterBottom)}>
                                        THE THEATER IS IN YOUR HANDS
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider component="div" className={classes.borderDivider} />
                                </Grid>
                                <Grid item xs={12}>
                                    {isXs ? (
                                        <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphBottom)}>
                                            Host a watch party for up to a million guests, or have a virtual&nbsp;movie&nbsp;night with friends. Hop
                                            on camera and take the lead while your show is synced for everyone.
                                        </Typography>
                                    ) : (
                                        <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphBottom)}>
                                            Host a watch party for up to a million guests, or have a virtual&nbsp;movie&nbsp;night with friends. Hop
                                            on camera and take&nbsp;the&nbsp;lead&nbsp;while&nbsp;your&nbsp;show is synced for everyone.
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} container justify="center" spacing={0}>
                                    <Button
                                        href={"/about"}
                                        variant="outlined"
                                        color="primary"
                                        classes={{
                                            root: classes.outlinedButton,
                                            label: classes.buttonLabel
                                        }}
                                    >
                                        Learn more
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Section>
            {isXs && <Divider component="div" className={classes.divider} />}

            <Section>
                <Grid container spacing={2} justify="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Box className={classes.boxContainer}>
                            <Box className={classes.imageContainer}>
                                <LaptopImage src="/images/home/PrivateParty2.jpg" className={classes.laptopImage} />

                                <img className={classes.image} src="/images/home/PrivateParty.jpg" />
                            </Box>

                            <Grid container justify="center" className={classes.boxContent} classes={{ root: classes.sectionContent }}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" align="center" className={classname(classes.primary, classes.gutterBottom)}>
                                        FIND YOUR MOVIE COMMUNITY
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider component="div" className={classes.borderDivider} />
                                </Grid>
                                <Grid item xs={12}>
                                    {isXs ? (
                                        <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphBottom)}>
                                            Connect with others who are as obsessed with your favorite movies as you are. Come together for watch
                                            parties, chat about your favorite shows and movies, and discover your next binge.
                                        </Typography>
                                    ) : (
                                        <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphBottom)}>
                                            Connect with others who are as obsessed with your favorite movies as you are. Come together for watch
                                            parties, chat about your favorite shows and movies, and discover your next binge.
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} container justify="center" spacing={0}>
                                    <GetScenerButton classname={classes.containedButton} trackingSource="Home" />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Section>
            {isXs && <Divider component="div" className={classes.divider} />}

            <Section>
                <Grid container spacing={2} justify="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Box p={4} className={classes.boxContainer}>
                            <Grid item>
                                <LaptopImage src={"/images/home/StreamingServices.jpg"} style={{ width: "100%" }} />
                            </Grid>
                            <Grid container justify="center" classes={{ root: classes.sectionContent }}>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        className={classname(classes.primary, classes.gutterBottom, classes.gutterTop)}
                                    >
                                        WATCH WHATEVER, TOGETHER
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider component="div" className={classes.borderDivider} />
                                </Grid>
                                <Grid item xs={12}>
                                    {isXs ? (
                                        <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphBottom)}>
                                            From Netflix to Disney+, Scener supports watch&nbsp;parties across the most streaming services globally.
                                            All your guests need is a subscription&nbsp;to the service you{"'"}re watching - we
                                            handle&nbsp;the&nbsp;rest.
                                        </Typography>
                                    ) : (
                                        <Typography paragraph align="center" className={classname(classes.paragraph, classes.paragraphBottom)}>
                                            From Netflix to Disney+, Scener supports watch parties across the most streaming services globally. All
                                            your guests need is a subscription to the service you{"'"}re watching - we handle the rest.
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} container justify="center" spacing={0}>
                                    <GetScenerButton classname={classes.containedButton} trackingSource="Home" />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Section>
            <Section>
                <Grid justify="center" container spacing={2} alignItems="center">
                    <Grid item xs={4} md={2}>
                        <Axios />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Deadline />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Forbes />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <TechCrunch />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <TheVerge />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Variety />
                    </Grid>
                </Grid>
            </Section>

            <Divider component="div" className={classes.divider} />
        </Page>
    );
}
export default withAppState(Home);
