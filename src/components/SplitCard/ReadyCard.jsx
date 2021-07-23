import { Grid, Typography, makeStyles, Button } from "@material-ui/core";
import { useRouter } from "next/router";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(6, 6, 6, 20),
        margin: 0,
        width: "100%"
    }
}));
const ReadyCard = () => {
    const router = useRouter();
    const classes = useStyles();
    const leftContent = (
        <Grid container spacing={2} alignItems="center" justify="flex-start" className={classes.container}>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h1"}>
                    Ready
                    <br /> to watch?
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h4"}>Host your own watch party or enter a theater code to join.</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
                <Button variant="contained" color="secondary" fullWidth onClick={() => router.push("/host")}>
                    Host a watch party
                </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Button variant="outlined" color="secondary" fullWidth onClick={() => router.push("/join")}>
                    Have a code?
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

export default ReadyCard;
