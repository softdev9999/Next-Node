import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Section from "../Section/Section";
import { Typography, Grid } from "@material-ui/core";
import GetScenerButton from "../GetScenerButton/GetScenerButton";
const useStyles = makeStyles((theme_) => ({}));

const GetScenerSection = () => {
    const classes_ = useStyles();
    return (
        <Section>
            <Grid container spacing={3} alignContent="center" justify="center" direction="row" wrap="wrap">
                <Grid item xs={12} md={12}>
                    <Typography variant="h3" gutterBottom align="center">
                        Get it for free, now.
                    </Typography>
                    <Typography variant="body1" align="center">
                        Available on the Chrome Web Store for your laptop or desktop.
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom>
                        Works on Macs, Windows PCs and Chromebooks.
                    </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                    <GetScenerButton getTitle={"GET IT NOW"} startTitle={"START WATCHING    "} defaultColor="default" />
                </Grid>
            </Grid>
        </Section>
    );
};
export default GetScenerSection;
