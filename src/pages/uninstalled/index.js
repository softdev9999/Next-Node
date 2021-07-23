import Head from "next/head";
import Page from "components/Page/Page";
import SplitCard from "components/SplitCard/SplitCard";
import { useState } from "react";
import NavLink from "components/NavLink/NavLink";
import { RadioGroup, Grid, TextField, Typography, FormControlLabel, Radio, Button } from "@material-ui/core";
import ButtonWithFeedback from "components/ButtonWithFeedback/ButtonWithFeedback";
import FormStars from "components/SplitCard/svg/Forms_Stars.svg";
import { sendFeedback } from "utils/API";
import config from "../../config";
import withAppState from "components/Page/withAppState";
function UninstalledPage() {
    const [status, setStatus] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const categories = [
        { name: "default", label: "Just didn't need it anymore" },
        { name: "audio", label: "Problem with audio" },
        { name: "video", label: "Problem with video" },
        { name: "syncing", label: "Problem with syncing" },
        { name: "connection", label: "Problem with connection" },
        { name: "didntlike", label: "Didn't like it" },
        { name: "other", label: "Other" }
    ];
    const [category, setCategory] = useState("default");
    const [feedback, setFeedback] = useState("");
    const onSubmit = () => {
        console.log(category, feedback);
        setStatus("loading");

        console.log("send feedback");
        sendFeedback({
            category,
            description: feedback,
            uninstalled: true,
            userAgent: window.navigator.userAgent
        })
            .then(() => {
                setHasSubmitted(true);
                setStatus("success");
            })
            .catch(() => {
                setStatus("error");
            });
    };

    const leftContent = (
        <Grid container spacing={2} alignItems="center" justify="flex-end" style={{ width: "100%", margin: 0 }}>
            <Grid item xs={12}>
                <img src={config.WORDMARK} style={{ height: "6rem", width: "auto" }} />
            </Grid>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h1"}>Thanks for using Scener</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
                <Typography variant={"h3"}>
                    {hasSubmitted ? "Thanks for your feedback. You can always add Scener again!" : "If something went wrong we'd love to know."}
                </Typography>
            </Grid>
            {hasSubmitted && (
                <Grid item xs={12} sm={10}>
                    <NavLink passHref href="/start" as="/start">
                        <Button color="secondary" variant="contained">
                            Add Scener
                        </Button>
                    </NavLink>
                </Grid>
            )}
        </Grid>
    );

    const rightContent = !hasSubmitted && (
        <Grid container alignContent={"space-around"} style={{ height: "100%", padding: "2rem", width: "100%", margin: 0 }} justify="center">
            <Grid item xs={12}>
                <RadioGroup value={category} onChange={({ currentTarget: { value } }) => setCategory(value)}>
                    {categories.map((c) => {
                        return <FormControlLabel key={c.name} control={<Radio value={c.name} color="default" />} label={c.label} />;
                    })}
                </RadioGroup>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Please describe your problem"
                    rows={4}
                    multiline
                    variant="outlined"
                    value={feedback}
                    onChange={({ currentTarget: { value } }) => setFeedback(value)}
                />
            </Grid>
            <Grid item xs={12} container justify="center">
                <ButtonWithFeedback
                    color="secondary"
                    variant="contained"
                    onClick={onSubmit}
                    onTimeout={setStatus}
                    status={status}
                    successMessage={"Removed"}
                >
                    Remove Scener
                </ButtonWithFeedback>
            </Grid>
        </Grid>
    );

    const foreground = <FormStars style={{ position: "absolute", right: "-5%", top: "-5%", width: "15%" }} />;

    const background = (
        <div
            style={{
                backgroundImage: `url(/images/cards/Forms_Submitted.jpg)`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
            }}
        />
    );

    return (
        <Page hideFooter hideHeader>
            <Head>
                <title>Scener – Uninstall</title>
            </Head>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <SplitCard
                    showHomeButton={true}
                    leftContent={leftContent}
                    rightContent={rightContent}
                    background={background}
                    foreground={foreground}
                    leftWidth={hasSubmitted ? 12 : 6}
                    rightWidth={hasSubmitted ? 0 : 6}
                />
            </div>
        </Page>
    );
}

export default withAppState(UninstalledPage);
