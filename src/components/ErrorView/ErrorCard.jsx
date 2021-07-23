import React from "react";
import { useEffect, useState } from "react";

import { Grid, Typography, Button } from "@material-ui/core";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import config from "../../config";

const ErrorCard = () => {
  const [reloadTimer, setReloadTimer] = useState(30);

  useEffect(() => {
      let t = setInterval(() => {
          if (reloadTimer < 1) {
            window.location.reload();
          }
          setReloadTimer(reloadTimer - 1);
      }, 500);
      return () => clearInterval(t);
  }, []);

    const leftContent = (
        <Grid container alignItems="center" justify="flex-start" style={{ padding: "1.5rem", margin: 0, width: "100%" }}>
            <Grid item xs={12}>
                <img src={config.WORDMARK} style={{ height: "6rem", width: "auto", maxWidth: "100vw" }} />
            </Grid>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={10}>
                <Typography variant={"h1"}>Oops! Something went{"\u00A0"}wrong.</Typography>
            </Grid>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={10}>
                <Typography variant={"h4"} style={{marginTop: "1rem"}}>Sorry about that.</Typography>
                <Typography align="center" style={{opacity: "0.6", marginTop: "1.5rem", marginBottom: "0.5rem", width: "100%"}} variant={"body2"}>Click reload to try again.</Typography>
            </Grid>
            <Grid item xs={false} sm={2} />

            <Grid item xs={12} sm={10}>
              <Button
                      variant="contained"
                      color={"secondary"}
                      fullWidth={true}
                      style={{width: "100%"}}
                      onClick={() => window.location.reload() }
                  >
                       <Typography variant={"h3"}>Reload / Try Again</Typography>
                  </Button>

            </Grid>
            <Grid container justify="center" style={{marginTop: "3rem"}}>
              <Grid item>
                <Typography variant={"h4"} style={{fontWeight: "900"}}>Need help? Let us know at support@scener.com</Typography>
              </Grid>
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

    return <SplitCard showHomeButton={false} foreground={foreground} leftContent={leftContent} rightContent={<Typography style={{fontSize: "10rem"}}>👻</Typography>} background={background} />;
};

export default ErrorCard;
