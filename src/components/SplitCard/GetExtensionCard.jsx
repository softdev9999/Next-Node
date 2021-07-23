import { Grid, Typography, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import { useExtension } from "hooks/Extension/Extension";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(6, 6, 6, 20),
        margin: 0,
        width: "100%"
    }
}));
const GetExtensionCard = () => {
    const classes = useStyles();
    const { openChromeStore, installing } = useExtension();
    const leftContent = (
        <Grid container spacing={2} alignItems="center" justify="flex-start" className={classes.container}>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h1"}>Add Scener to Chrome</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h4"}>Scener is a free Chrome extension. Add&nbsp;it&nbsp;in&nbsp;two clicks.</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                <ButtonWithFeedback
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={openChromeStore}
                    status={installing ? "loading" : null}
                    loadingMessage={"waiting..."}
                >
                    Get Scener
                </ButtonWithFeedback>
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

export default GetExtensionCard;
