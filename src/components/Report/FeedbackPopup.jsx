import { useState } from "react";
import { Typography, withStyles, TextField, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@material-ui/core";
import { sendFeedback } from "utils/API";
import NavPopup from "../NavPopup/NavPopup";

const FeedbackPopup = ({ classes, helpMode, visible, onDismiss }) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitForm = (e) => {
        setError(null);

        console.log({ e });
        e && e.preventDefault();

        setLoading(true);
        sendFeedback({
            category: "default",
            description: reason,
            uninstalled: false,
            userAgent: window.navigator.userAgent
        })
            .then(() => {
                setLoading(false);
                setReason("");
                onDismiss();
            })
            .catch((err) => {
                err && err.message ? setError(err.message) : setError("Error submitting feedback. Please try again later.");
                setLoading(false);
            });
    };

    return (
        <NavPopup
            dialog
            open={visible}
            onDismiss={() => {
                setError(null);
                onDismiss();
            }}
        >
            <>
                <DialogTitle disableTypography>
                    <Typography variant="h3" align="center">
                        {helpMode ? "REPORT ISSUE" : "SEND FEEDBACK"}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.main}>
                        {loading && (
                            <div>
                                <CircularProgress size={20} />
                            </div>
                        )}
                        <div className={classes.error}>
                            {error && (
                                <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                                    {error}
                                </Typography>
                            )}
                        </div>
                        <Typography variant={"h4"} align={"center"}>
                            {helpMode ? "Having an issue? We're here to help" : "We'd love to hear your thoughts!"}
                        </Typography>
                        <form style={{ width: "100%" }} onSubmit={submitForm}>
                            <TextField
                                fullWidth
                                multiline={true}
                                rows={8}
                                variant={"outlined"}
                                placeholder={"Please provide some feedback"}
                                autoFocus={true}
                                error={!!error}
                                helperText={error}
                                value={reason}
                                onChange={({ target: { value } }) => {
                                    setReason(value);
                                }}
                                id="reason-input"
                                margin={"dense"}
                                required
                                onKeyPress={({ key }) => {
                                    if (key == "Enter") {
                                        submitForm();
                                    }
                                }}
                            />
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            setError(null);
                            onDismiss();
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button color="secondary" variant="contained" onClick={submitForm} fullWidth>
                        SEND
                    </Button>
                </DialogActions>
            </>
        </NavPopup>
    );
};

const styles = () => ({
    main: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    error: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    }
});

export default withStyles(styles)(FeedbackPopup);
