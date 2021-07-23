const { Grid, Typography, makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
    titleContainer: {
        background: theme.functions.rgba(theme.palette.common.white, 0.1),
        padding: theme.spacing(1.5, 3)
    }
}));

const ActivityBarSection = ({ title, children, hide }) => {
    const classes = useStyles();
    return !hide ? (
        <Grid container item spacing={0} xs={12} style={{ margin: 0 }}>
            <Grid item xs={12} className={classes.titleContainer}>
                <Typography variant="h3" align="left">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    ) : null;
};

export default ActivityBarSection;
