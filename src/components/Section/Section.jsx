import { Container, makeStyles, Grid, useTheme } from "@material-ui/core";
const useStyles = makeStyles((theme_) => ({
    section: {
        width: "100%",
        display: "flex",
        flexFlow: "column"
    },
    sectionInner: {}
}));

const Section = ({ children, tint, spacing = [5, 0], innerItemProps,disableGutters, ...others }) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <section
            className={classes.section}
            style={{
                padding: theme.spacing(...spacing),
                minHeight: "auto",
                backgroundColor: tint ? theme.functions.rgba(tint, 0.4) : null
            }}
            {...others}
        >
            <Container disableGutters={disableGutters}>
                <Grid container spacing={1} alignItems="center" justify="center" className={classes.sectionInner}>
                    <Grid item xs={12} {...innerItemProps}>
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
};

export default Section;
