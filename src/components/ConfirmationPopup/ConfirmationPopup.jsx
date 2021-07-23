import React from "react";
//import { makeStyles } from "@material-ui/core/styles";
import { DialogTitle, Typography, DialogContent, DialogActions, Button } from "@material-ui/core";
//const useStyles = makeStyles((theme) => ({}));

const ConfirmationPopup = ({ title = "Are you sure?", message, onDismiss }) => {
    //const classes = useStyles();
    return (
        <>
            {title && (
                <DialogTitle disableTypography>
                    <Typography variant="h3">{title}</Typography>
                </DialogTitle>
            )}
            {message && (
                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={() => onDismiss(false)} variant="outlined" color="default">
                    Cancel
                </Button>
                <Button onClick={() => onDismiss(true)} variant="contained" color="secondary">
                    OK
                </Button>
            </DialogActions>
        </>
    );
};

export default ConfirmationPopup;
