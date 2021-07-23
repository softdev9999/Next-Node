import { useState } from "react";
import { Typography, makeStyles, TextField, DialogActions, Button, DialogTitle, DialogContent } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/SyncRounded";
import { reportUser } from "utils/API";
import NavPopup from "../NavPopup/NavPopup";

const ReportPopup = ({ user, visible, onDismiss }) => {
    const classes = useStyles();

    const [reason, setReason] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitForm = (ev) => {
        if (!reason) {
            setError("Please provide a detailed explanation");
            return false;
        }

        setError(null);
        let reportUserId = user.id;

        ev && ev.preventDefault();

        setLoading(true);
        reportUser(reportUserId, { text: reason })
            .then((res) => {
                setReason("");
                console.log(res);
                setLoading(false);
                onDismiss(res);
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    };

    return (
        <NavPopup
            open={visible}
            dialog
            onConfirm={submitForm}
            onDismiss={() => {
                setError(null);
                setReason("");
                onDismiss && onDismiss();
            }}
            disableDismissPassing
        >
            <DialogTitle disableTypography>
                <Typography variant="h3" align="center">
                    {user && "REPORT @" + user.username}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <div className={classes.main}>
                    {loading && (
                        <div>
                            <div style={{ transform: "scaleX(-1)" }}>
                                <SyncIcon style={{ color: "white", animation: "spin 3s infinite linear reverse" }} />
                            </div>
                        </div>
                    )}
                    <form style={{ width: "100%" }} onSubmit={submitForm}>
                        <TextField
                            fullWidth
                            multiline={true}
                            rows={5}
                            variant={"outlined"}
                            placeholder={"Please provide an explanation"}
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
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setError(null);
                        onDismiss();
                    }}
                >
                    CANCEL
                </Button>
                <Button variant="contained" color="secondary" onClick={submitForm} fullWidth>
                    SEND REPORT
                </Button>
            </DialogActions>
        </NavPopup>
    );
};

const useStyles = makeStyles((theme_) => ({
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
}));

export default ReportPopup;
