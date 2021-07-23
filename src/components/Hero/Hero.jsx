import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Tooltip, LinearProgress } from "@material-ui/core";
import { useCallback, useMemo } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import ServiceIcon from "../Icon/ServiceIcon";

const useStyles = makeStyles((theme) => ({
    hero: {
        position: "relative",
        width: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundColor: "#000",
        marginBottom: "5rem"
    },
    contentImg: {
        position: "relative",
        width: "100%",
        height: "calc(100% - 3rem)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center"
    },
    heroInner: {
        width: "100%",
        height: "100%",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)"
    },
    large: {
        height: "10rem",
        width: "10rem",
        maxWidth: "32%",
        maxHeight: "80%",
        position: "absolute",
        top: "58%",
        zIndex: "2",
        left: "1rem",
        border: "0.3rem solid #000",
        boxShadow: "0px 0px 0.5rem 0.5rem rgba(0,0,0,0.3)"
    },
    heroLiveStatus: {},
    contentPlaying: {
        position: "absolute",
        top: "0rem",
        right: "0rem",
        height: "100%"
    },
    contentPortrait: {
        position: "absolute",
        right: "0rem",
        width: "21.5%",
        height: "100%"
    },
    contentLive: {
        position: "absolute",
        bottom: "-2rem",
        paddingLeft: "calc(19% + 5rem)",
        backgroundColor: theme.palette.primary.darkest,
        width: "100%",
        overflow: "hidden"
    },
    contentLiveMobile: {
        position: "absolute",
        bottom: "-0.5rem",
        paddingLeft: "calc(19% + 5rem)",
        backgroundColor: theme.palette.primary.darkest,
        width: "100%",
        overflow: "hidden"
    },
    timeProgress: {
        padding: "0.5rem",
        width: "100%",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    timeProgressMobile: {
        padding: "0.5rem",
        marginLeft: "-1.2rem",
        paddingLeft: "1.5rem",
        width: "100%",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    timeProgressBar: {
        width: "100%",
        height: "0.3rem",
        borderRadius: "1rem",
        backgroundColor: theme.palette.common.black,
        "& div": {
            backgroundColor: "red"
        }
    },
    service: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.3)",
        paddingTop: "0.2rem",
        textAlign: "center"
    }
}));

function Hero({ backgroundSrc, user, activity, children, style, mobile }) {
    const classes = useStyles();

    const getBackground = useCallback(() => {
        const defaultImageModifier = user ? (user.id % 3) + 1 : 1;
        return backgroundSrc
            ? backgroundSrc
            : user && user.bannerImageUrl
            ? user.bannerImageUrl
            : "/images/profilebanner-" + defaultImageModifier + ".jpg";
    }, [user, backgroundSrc]);

    const isLive = useMemo(() => user && activity && activity.live && activity.roomId, [activity, user]);
    const isLiveVideo = useMemo(() => user && activity && activity.liveVideo, [activity, user]);
    const currentTitle = useMemo(() => user && activity && activity.title, [activity, user]);
    const currentSubtitle = useMemo(() => user && activity && activity.subtitle, [activity, user]);

    const currentSeason = useMemo(() => user && activity && activity.seriesNumber, [activity, user]);
    const currentEp = useMemo(() => user && activity && activity.episodeNumber, [activity, user]);

    const currentImg = useMemo(() => user && activity && activity.img, [activity, user]);
    const currentService = useMemo(() => user && activity && activity.service, [activity, user]);
    const currentTimer = useMemo(() => user && activity && activity.timeline, [activity, user]);
    const currentDuration = useMemo(() => user && activity && activity.duration, [activity, user]);
    const currentPercent = useMemo(() => (currentDuration ? Math.round(((currentTimer || 0) / currentDuration) * 100) : 0), [activity, user]);

    return (
        <Grid
            container
            alignContent="center"
            justify="flex-start"
            direction="column"
            className={classes.hero}
            style={{ height: "100%", backgroundImage: `url(${getBackground()})`, ...style }}
        >
            <>
                {isLive ? (
                    <>
                        <Grid container className={classes.contentPlaying} alignContent="center" justify="center" direction="row" wrap="nowrap">
                            {currentTitle && !mobile && (
                                <Grid container className={classes.contentPortrait}>
                                    <Grid
                                        style={{ position: "relative", width: "100%", height: "100%" }}
                                        container
                                        justify="center"
                                        alignContent={"flex-end"}
                                        direction="row"
                                    >
                                        <Grid item className={classes.contentImg} style={{ backgroundImage: `url(${currentImg})` }}></Grid>

                                        <Grid item className={classes.service}>
                                            {currentService && <ServiceIcon name={currentService} height={"1rem"} centered shadow />}
                                        </Grid>

                                        {isLiveVideo ? (
                                            <Tooltip title={"Live Video"}>
                                                <div className={classes.timeProgress}>🔴 LIVE</div>
                                            </Tooltip>
                                        ) : currentPercent <= 100 ? (
                                            <Tooltip title={"currently at: " + currentPercent + "% watched"}>
                                                <div className={classes.timeProgress}>
                                                    <LinearProgress
                                                        className={classes.timeProgressBar}
                                                        variant="determinate"
                                                        value={currentPercent}
                                                    />
                                                </div>
                                            </Tooltip>
                                        ) : (
                                            <></>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <Grid
                            container
                            justify="space-between"
                            direction="column"
                            alignItems="center"
                            wrap="nowrap"
                            className={mobile ? classes.contentLiveMobile : classes.contentLive}
                        >
                            <Grid container wrap="nowrap" direction="row" alignItems="center" style={{ padding: "0.3rem 1rem 0.3rem 0rem" }}>
                                <Grid item>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            backgroundColor: "red",
                                            color: "#fff",
                                            paddingLeft: "1rem",
                                            paddingRight: "1rem",
                                            borderRadius: "1rem",
                                            marginRight: "1rem",
                                            fontSize: "0.7rem"
                                        }}
                                    >
                                        LIVE
                                    </Typography>
                                </Grid>
                                <Grid item style={{ width: "calc(100% - 4rem)" }}>
                                    <Grid container alignContent="center" alignItems="center" justify="flex-end" direction="row" wrap="nowrap">
                                        <Typography align="center" noWrap variant="body2">
                                            {currentTitle}
                                            {(currentSubtitle || currentSeason || currentEp) && "\u00A0\u00A0 | \u00A0"}
                                            {currentSeason ? "\u00A0S" + currentSeason : ""}
                                            {currentEp ? "\u00A0E" + currentEp : ""}
                                            {currentSubtitle ? "\u00A0" + currentSubtitle : ""}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {mobile && currentTitle && (
                                <Grid container wrap="nowrap">
                                    {isLiveVideo ? (
                                        <Typography variant="body2" style={{ width: "100%" }}>
                                            🔴 LIVE Video
                                        </Typography>
                                    ) : currentPercent <= 100 ? (
                                        <div className={classes.timeProgressMobile}>
                                            <LinearProgress className={classes.timeProgressBar} variant="determinate" value={currentPercent} />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <Grid item className={classes.service}>
                                        {currentService && <ServiceIcon name={currentService} height={"0.85rem"} centered shadow />}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </>
                ) : null}

                <UserAvatar alt={user && user.username} className={classes.large} user={user} disableLink />
            </>
            {children ? <div className={classes.heroInner}>{children}</div> : null}
        </Grid>
    );
}

export default Hero;
