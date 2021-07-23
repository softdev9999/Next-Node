import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(6, 6, 6, 20),
        margin: 0,
        width: "100%"
    }
}));

const GetChromeCard = (/*{code}*/) => {
    const classes = useStyles();
    const leftContent = (
        <Grid container spacing={2} alignItems="center" justify="flex-start" className={classes.container}>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h1"}>Get the Chrome&nbsp;browser</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h4"}>For Scener to work, you must use the Chrome browser. Get Chrome, then go to scener.com.</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button variant="contained" color="secondary" fullWidth href={"https://google.com/chrome"} target="_blank">
                    Get Chrome
                </Button>
            </Grid>
        </Grid>
    );

    const background = (
        <div
            style={{
                backgroundImage: `url(/images/cards/PostInstall.jpg)`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
            }}
        />
    );

    const foreground = (
        <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-10%,-30%) scale(1)", width: "110%" }} />
    );

    return (
        <SplitCard
            foreground={foreground}
            leftContent={leftContent}
            rightContent={null}
            background={background}
            showHomeButton={false}
            leftWidth={9}
        />
    );
};

export default GetChromeCard;
