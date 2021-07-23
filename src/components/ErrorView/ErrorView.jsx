import { withStyles, Typography, Button } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/HelpRounded";
const ErrorView = ({ style, classes, title, message, resolveButtonTitle, onResolve, helpButtonTitle, helpLink }) => {
    return (
        <div className={classes.errorContainer} style={style}>
            <Typography variant={"h6"} paragraph color="error" style={{ flex: "0 0 auto", letterSpacing: ".1em" }}>
                {title || "ERROR"}
            </Typography>
            <Typography variant={"body1"} paragraph style={{ flex: "0 0 auto" }}>
                {message || "Something went wrong."}
            </Typography>{" "}
            {resolveButtonTitle && (
                <Button variant="contained" onClick={onResolve} color="primary" style={{ marginBottom: ".5rem" }}>
                    {resolveButtonTitle}
                </Button>
            )}
            <Button href={helpLink || "https://scener.com/faq"} target={"_blank"} endIcon={<HelpIcon />}>
                {helpButtonTitle || "help"}
            </Button>
        </div>
    );
};

const styles = (theme) => ({
    errorContainer: {
        padding: theme.spacing(3),
        flex: "0 0 auto",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default withStyles(styles)(ErrorView);
