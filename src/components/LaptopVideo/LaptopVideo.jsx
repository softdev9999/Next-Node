import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
const useStyles = makeStyles((theme_) => ({
    laptop: {
        backgroundImage: "url(/images/home/laptop-blank.png)",
        backgroundSize: "100% auto",
        backgroundPosition: "center 0",
        backgroundRepeat: "no-repeat",
        width: "auto",
        margin: "auto"
    },
    laptopVideo: {
        position: "relative",
        width: "78%",
        height: "100%",
        marginTop: "3.5%",
        marginBottom: "6%"
    }
}));

const LaptopVideo = ({ style }) => {
    const classes = useStyles();
    return (
        <Grid style={style} className={classes.laptop} container justify="center">
            <video
                className={classes.laptopVideo}
                src="https://scener-web.s3-us-west-2.amazonaws.com/carousel-v5.mp4"
                poster="https://scener-web.s3-us-west-2.amazonaws.com/carousel-0420.jpg"
                playsInline
                autoPlay
                loop
                muted
            ></video>
        </Grid>
    );
};

export default LaptopVideo;
