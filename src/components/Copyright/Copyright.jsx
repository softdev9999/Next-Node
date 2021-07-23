import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Link } from "@material-ui/core";
import NavLink from "../NavLink/NavLink";
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1, 2),
        margin: 0,
        width: "100%"
    }
}));

const Copyright = ({ embedded }) => {
    const classes = useStyles();
    return (
        <Grid container alignItems="center" justify={"center"} spacing={1} className={classes.container}>
            <Grid item>
                <Typography variant="body2">Copyright &copy; Scener, Inc. 2020 </Typography>
            </Grid>
            <Grid item container alignItems="center" justify={"center"} spacing={3}>
                <Grid item>
                    <Link target={embedded ? "_blank" : null} href="/help" variant="body2" color="textSecondary">
                        Help
                    </Link>
                </Grid>
                <Grid item>
                    <Link
                        href="https://www.dropbox.com/sh/qkie5dwqs8p0a27/AAD7Brcb7cIPbOitphKbyxAVa?dl=0"
                        variant="body2"
                        color="textSecondary"
                        target="_blank"
                    >
                        Press
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/terms" target={embedded ? "_blank" : null} variant="body2" color="textSecondary">
                        Terms
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/terms#privacy" target={embedded ? "_blank" : null} variant="body2" color="textSecondary">
                        Privacy
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Copyright;
