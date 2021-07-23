import Head from "next/head";
import { Grid, Typography, Button } from "@material-ui/core";
import { useRouter } from "next/router";

import Page from "components/Page/Page";
import SplitCard from "components/SplitCard/SplitCard";
import PostInstallStars from "components/SplitCard/svg/PostInstall_Stars.svg";
import config from "../config";
import withAppState from "components/Page/withAppState";

function Custom404() {
    const getPageTitle = () => {
        return "Scener – Not found";
    };

    const router = useRouter();

    const foreground = <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-10%,-30%) scale(1)" }} />;
    const leftContent = (
        <Grid container spacing={2} alignItems="center" justify="flex-start" style={{ padding: "3rem", width: "100%", margin: 0 }}>
            <Grid item xs={12}>
                <img src={config.WORDMARK} style={{ height: "6rem", width: "auto" }} />
            </Grid>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={10}>
                <Typography variant={"h1"}>Uh oh. Page not found.</Typography>
            </Grid>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={10}>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "10rem" }}
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    Go Home
                </Button>
            </Grid>
            <Grid item xs={false} sm={2} />
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

    return (
        <Page>
            <Head>
                <title>{getPageTitle()} </title>
            </Head>
            <SplitCard foreground={foreground} leftContent={leftContent} leftWidth={10} rightContent={null} background={background} />
        </Page>
    );
}

export default withAppState(Custom404);
