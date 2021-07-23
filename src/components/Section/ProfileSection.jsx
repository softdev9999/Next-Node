import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme_) => ({
    section: {
        display: "flex",
        alignContent: "flex-start",
        paddingRight: "1rem",
        paddingBottom: "1rem"
    },
    sectionGrid: {
        backgroundColor: "rgba(255,0,255, 0.2)",
        padding: "1rem",
        borderRadius: "1rem"
    },
    sectionImage: {
        width: "100%",
        maxHeight: "20rem",
        objectFit: "contain",
        borderRadius: "1rem"
    },
    sectionDetail: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    }
}));

function ProfileSection({ data, sectionTitle, width }) {
    const classes = useStyles();

    return (
        <div className={classes.section}>
            {data && (
                <Grid
                    className={classes.sectionGrid}
                    style={{ width: width ? width : "30rem" }}
                    container
                    spacing={1}
                    alignContent="center"
                    justify="flex-start"
                    direction="column"
                    wrap="wrap"
                >
                    {sectionTitle && (
                        <Grid item className={classes.sectionDetail}>
                            <Typography variant="h6" align="center">
                                {sectionTitle}
                            </Typography>
                        </Grid>
                    )}
                    {data.description && (
                        <Grid item className={classes.sectionDetail}>
                            <Typography>{data.description}</Typography>
                        </Grid>
                    )}
                    {data.image && (
                        <Grid item>
                            <img src={data.image} className={classes.sectionImage} />
                        </Grid>
                    )}
                    {data.title && (
                        <Grid item className={classes.sectionDetail}>
                            <Typography variant="h6" align="center">
                                {data.title}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </div>
    );
}

export default ProfileSection;
