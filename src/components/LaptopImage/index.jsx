import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import classnames from "classnames";
const useStyles = makeStyles({
    container: {
        backgroundImage: "url(/images/home/laptop-blank.png)",
        backgroundSize: "100% auto",
        backgroundPosition: "center 0",
        backgroundRepeat: "no-repeat",
        width: "auto",
        margin: "auto"
    },
    image: {
        position: "relative",
        width: "78%",
        height: "100%",
        marginTop: "3.5%",
        marginBottom: "6%"
    }
});

const LaptopImage = ({ style, src, className }) => {
    const classes = useStyles();
    return (
        <Grid style={style} className={classnames(classes.container, className)} container justify="center">
            <img src={src} className={classes.image} />
        </Grid>
    );
};

LaptopImage.propTypes = {
    style: PropTypes.instanceOf(Object),
    src: PropTypes.string
};

LaptopImage.defaultProps = {
    style: {},
    src: ""
};

export default LaptopImage;
