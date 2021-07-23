import { withStyles, Typography, Button, Grid, Divider } from "@material-ui/core";
import InfoIcon from '@material-ui/icons/Info';

const BetaWarning = ({ mode, classes }) => {

    return (
      mode == "full" ?
      <Grid container justify="center" className={classes.beta}>
          <Grid item>
              <Typography variant="h3" align="center" gutterBottom>
                  Welcome to Scener Beta!
              </Typography>
              <Divider light style={{marginTop: "1rem", marginBottom: "1rem"}}/>
              <Typography variant="h6" align="center" gutterBottom>
                You’ve been selected for exclusive, early access to an upcoming version of Scener!
                This new version was created to make sharing and discovering shows with your friends easier than ever.
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                We would love your feedback on how well the new features work. Please report any issues or bugs using the button below:
              </Typography>
              <Divider light style={{marginTop: "1rem", marginBottom: "1rem"}}/>

              <Typography align="center" gutterBottom>
                <Button variant={"contained"} color={"primary"} onClick={() => window.open("https://www.surveymonkey.com/r/ScenerBeta", "_blank")}>
                    Report a Beta Issue
                </Button>
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                You can switch to the old version of Scener <a href="https://scener.com">here</a>.
              </Typography>

          </Grid>
        </Grid> :
        <Grid container justify="flex-start" className={classes.betaSummary}>

          <Grid item>
            <Typography variant="h3" align="center" gutterBottom>
                <InfoIcon /> Watch Parties with Beta
            </Typography>
              <Typography variant="h6" align="left" gutterBottom>
                While using Scener Beta, you will only be able to host or join watch parties with other Beta users.
                Inviting friends to a watch party will grant them access to Scener Beta.
              </Typography>
          </Grid>
      </Grid>
    );
};

const styles = (theme) => ({
    beta: {
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        borderRadius: "1rem",
        border: "1px solid",
        borderColor: theme.palette.primary.main,
        background: theme.gradients.create("0", theme.palette.primary.darkest, theme.palette.primary.dark),
    },
    betaSummary: {
        marginTop: theme.spacing(3),
        width: "100%",
        padding: theme.spacing(2),
        borderColor: theme.palette.primary.main,
        background: "rgba(0,0,0,0.5)",
    }
});

export default withStyles(styles)(BetaWarning);
