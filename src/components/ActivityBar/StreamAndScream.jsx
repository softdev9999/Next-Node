import ActivityBarSection from "./ActivityBarSection";
import { Grid, makeStyles, Typography, ButtonBase, Button, Box } from "@material-ui/core";
import FixedRatioBox from "../FixedRatioBox/FixedRatioBox";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundImage: `url(images/streamandscream-bg.jpg)`,
        backgroundSize: "contain",
        backgroundPosition: "top left",
        backgroundRepeat: "no-repeat",
        flexFlow: "row nowrap",
        alignItems: "stretch",
        justifyContent: "flex-end",
        padding: "5%"
    },
    rightContent: {
        flex: "0 0 40%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "space-around"
    },
    text: {
        fontSize: ".875rem",
        lineHeight: "1.1",
        fontWeight: "bold",
        color: theme.palette.scener.eclipse
        //   textShadow: ".1rem .1rem .2rem rgba(0,0,0,.3)"
    },
    button: {
        padding: theme.spacing(0.75, 2.25),
        backgroundColor: "rgba(255,255,255,.28)",
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(255,255,255,.40)",
            color: "white"
        }
    }
}));

const StreamAndScream = () => {
    const classes = useStyles();
    return (
        <ActivityBarSection title={"Featured"}>
            <Grid container spacing={0} style={{ padding: "1rem" }}>
                <Grid item xs={12}>
                    <FixedRatioBox xs={312 / 666}>
                        <ButtonBase className={classes.container} href="/streamandscream">
                            <Box className={classes.rightContent}>
                                <Typography align="right" className={classes.text}>
                                    Join us in celebrating the best of horror the whole month of October
                                </Typography>

                                <Button variant="contained" className={classes.button} disableElevation>
                                    Learn more
                                </Button>
                            </Box>
                        </ButtonBase>
                    </FixedRatioBox>
                </Grid>
            </Grid>
        </ActivityBarSection>
    );
};

export default StreamAndScream;
