import Page from "components/Page/Page";
import Head from "next/head";
import SplitCard from "components/SplitCard/SplitCard";
import { Grid, Typography } from "@material-ui/core";
import { Scener } from "components/Icon/Icon";
import UnsubscribeStars from "components/SplitCard/svg/Unsubscribe_Stars.svg";
import { unsubscribe, resubscribe } from "utils/API";
import ButtonWithFeedback from "components/ButtonWithFeedback/ButtonWithFeedback";
import { useState } from "react";
import withAppState from "components/Page/withAppState";
function UnsubscribePage({ query, subscribed }) {
    const [status, setStatus] = useState();
    const [isSubscribed, setIsSubscribed] = useState(subscribed);
    const onSubmit = () => {
        console.log(query);
        setStatus("loading");

        if (query.code) {
            if (isSubscribed) {
                unsubscribe(query.code)
                    .then((res) => {
                        if (res.success) {
                            setIsSubscribed(false);
                            setStatus("success");
                        }
                    })
                    .catch(() => {
                        setStatus("error");
                    });
            } else {
                resubscribe(query.code)
                    .then((res) => {
                        if (res.success) {
                            setIsSubscribed(true);

                            setStatus("success");
                        }
                    })
                    .catch(() => {
                        setStatus("error");
                    });
            }
        } else {
            setStatus("error");
        }
    };

    const getTitle = () => {
        if (status == "loading") {
            if (isSubscribed) {
                return "Unsubscribing...";
            } else {
                return "Resubscribing...";
            }
        } else if (status == "success") {
            if (!isSubscribed) {
                return "Sorry to see you go!";
            } else {
                return "Welcome back!";
            }
        } else {
            if (isSubscribed) {
                return "Are you sure?";
            } else {
                return "Thank you";
            }
        }
    };

    const getMessage = () => {
        if (status == "loading") {
            return "Please wait...";
        } else if (status == "success") {
            if (!isSubscribed) {
                return "You will not receive new emails.";
            } else {
                return "You've resubscribed!";
            }
        } else {
            if (isSubscribed) {
                return "To unsubscribe and opt out of Scener emails about trending shows and live events, click the button below.";
            } else {
                return "Sorry to see you go. Click below to resubscribe.";
            }
        }
    };

    const leftContent = (
        <Grid container alignContent={"space-around"} style={{ height: "100%", width: "100%", margin: 0 }} justify="center">
            <Grid item xs={12} container justify="center">
                <Scener width="5rem" height="5rem" />
            </Grid>
            <Grid item xs={12} container justify="center">
                <Typography variant="h2" align="center">
                    {getTitle()}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} container justify="center">
                <Typography variant="body1" paragraph align="center">
                    {getMessage()}
                </Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
                <ButtonWithFeedback
                    color="secondary"
                    variant="contained"
                    onClick={onSubmit}
                    onTimeout={setStatus}
                    status={status}
                    successMessage={isSubscribed ? "Subscribed" : "Unsubscribed"}
                >
                    {isSubscribed ? "Unsubscribe" : "Resubscribe"}
                </ButtonWithFeedback>
            </Grid>
        </Grid>
    );

    const foreground = <UnsubscribeStars style={{ position: "absolute", left: 0, right: 0, top: 0 }} />;

    const background = (
        <div
            style={{
                backgroundImage: `url(/images/cards/Unsubscribe.jpg)`,
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
                <title>Scener – Unsubscribe</title>
            </Head>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <SplitCard leftContent={leftContent} rightContent={null} background={background} foreground={foreground} leftWidth={12} />
            </div>
        </Page>
    );
}

export async function getServerSideProps(context) {
    let subscribed = true;
    if (context.query.code) {
        const db = require("lib/db");
        try {
            let user = await db.query(`SELECT id, unsubscribed, emailHash FROM usersNew where emailHash=${db.escape(context.query.code)} LIMIT 1`);
            subscribed = !user.unsubscribed;
        } catch (e) {
            subscribed = true;
        }
        await db.end();
    }
    return {
        props: { query: context.query, subscribed }
    };
}

export default withAppState(UnsubscribePage);
