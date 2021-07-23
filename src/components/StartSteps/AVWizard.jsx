import classname from "classnames";
import { Box, Grid, Button, Typography, useTheme, makeStyles, useMediaQuery, Divider } from "@material-ui/core";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import SetupViewfinder from "../Viewfinder/SetupViewfinder";
import SetupAvControls from "../AvControls/SetupAVControls";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PreInstall_Stars.svg";
import { Headset } from "../Icon/Icon";

const useStyles = makeStyles((theme) => ({
    rightContent: {
        height: "100%",
        padding: theme.spacing(0, 6),
        width: "100%",
        margin: 0,
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0, 2)
        }
    },
    leftContent: {
        width: "100%",
        margin: 0
    },
    micIcon: {
        fontSize: "2rem",
        marginRight: "1rem"
    },
    foreground: {
        zIndex: 1
    },
    divider: {
        backgroundColor: theme.palette.common.white,
        marginBottom: "0.5rem",
        marginTop: "0.5rem"
    },
    outlinedButton: {
        borderColor: "#979797"
    }
}));

function AVWizard({ onFinished, autostart, finishedTitle = "JOIN" }) {
    const theme = useTheme();
    const classes = useStyles();
    const {
        mediaState: { audioEnabled, videoEnabled },
        permissions: { audio, video }
    } = useMedia();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const leftcontent = (
        <Grid container spacing={2} className={classes.leftContent} alignItems="center" justify="center">
            {isXs && (
                <Grid item xs={12}>
                    <Typography variant={"h1"} align="center">
                        Camera
                    </Typography>
                </Grid>
            )}
            <Grid item xs={12} sm={10} md={8}>
                <div style={{ marginTop: "1rem", flex: "0 0 100%", background: theme.palette.common.black }}>
                    <SetupViewfinder />
                </div>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <SetupAvControls autostart={autostart} />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <div style={{ flex: "0 0 100%", paddingBottom: "1rem" }}>
                    <Divider className={classes.divider} />
                    <Box display="flex" alignItems="center" marginTop="1rem">
                        <Headset className={classes.micIcon} />
                        <Typography align="center">If enabling microphone, use headphones</Typography>
                    </Box>
                </div>
            </Grid>

            {isXs && (
                <>
                    <Grid item xs={12}>
                        <Button
                            variant={audioEnabled || videoEnabled ? "contained" : "outlined"}
                            onClick={onFinished}
                            fullWidth
                            classes={{
                                outlined: classname({
                                    [classes.outlinedButton]: !audioEnabled || !videoEnabled
                                })
                            }}
                            color={((audioEnabled || videoEnabled) && "secondary") || "default"}
                        >
                            {audioEnabled || videoEnabled ? finishedTitle : "SKIP"}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"outlined"} href={"/help/permissions"} target="_blank" fullWidth color="primary">
                            HELP
                        </Button>
                    </Grid>
                </>
            )}
        </Grid>
    );
    const rightcontent = (
        <Grid xs={12} item className={classes.rightContent} container justify={"space-around"} alignItems="center" direction="column">
            {!isXs && <Grid item style={{ width: "100%", flex: "0 0 30%" }}></Grid>}
            <Grid item style={{ width: "100%" }} container justify={"center"} alignItems="center" spacing={3}>
                {!isXs && (
                    <Grid item xs={12}>
                        <Typography variant={"h1"} align="center">
                            Camera
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button
                        variant={audio || video ? "contained" : "outlined"}
                        onClick={onFinished}
                        fullWidth
                        classes={{
                            outlined: classname({
                                [classes.outlinedButton]: !audioEnabled || !videoEnabled
                            })
                        }}
                        color={((audio || video ) && "secondary") || "default"}
                    >
                        {audio || video ? finishedTitle : "SKIP"}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant={"outlined"} href={"/help/permissions"} target="_blank" fullWidth color="primary">
                        HELP
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );

    const background = (
        <div
            style={{
                background: theme.gradients.create(
                    135,
                    theme.functions.rgba(theme.palette.primary.dark, 0.8),
                    `${theme.functions.rgba(theme.palette.secondary.light, 0.8)} 100%`
                ),
                width: "100%",
                height: "100%"
            }}
        />
    );

    const foreground = (
        <PostInstallStars style={{ position: "absolute", left: "50%", top: "50%", width: "110%", transform: "translate(-50%,-120%)" }} />
    );

    return (
        <SplitCard
            classname={classes.foreground}
            leftContent={leftcontent}
            leftBackground={theme.palette.scener.midnight}
            rightContent={!isXs && rightcontent}
            rightBackground="transparent"
            background={background}
            foreground={foreground}
        />
    );
}

export default AVWizard;
