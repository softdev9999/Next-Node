import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useCurrentRoom } from "hooks/Room/Room";
import { Box, Typography, TextField, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import { updateRole } from "utils/API";


const useStyles = makeStyles((theme) => ({
    boxContainer: {
        padding: theme.spacing(4)
    },
    dialogTitle: {
        paddingBottom: 0
    },
    title: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.41,
        lineHeight: theme.spacing(2)
    },
    primary: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.41,
        lineHeight: theme.spacing(3)
    },
    dialogContent: {
        padding: theme.spacing(1, 5)
    },
    dialogActions: {
        padding: theme.spacing(0.5, 5, 2)
    },
    button: {
        boxShadow: "none",
        minHeight: theme.spacing(4),
        borderRadius: theme.spacing(2)
    },
    outlinedButton: {
        borderWidth: theme.functions.rems(1)
    },
    containedButton: {
        background: theme.palette.secondary.main,
        "&:hover,&:focus,&:active": {
            background: theme.palette.secondary.main
        }
    },
    buttonLabel: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.4,
        lineHeight: theme.spacing(2)
    },
    outlinedInput: {
        background: theme.functions.rgba(theme.palette.common.white, 0.1),
        height: theme.spacing(5),
        borderRadius: 0
    },
    notchedOutline: {
        border: "none"
    }
}));

const AddCohostPopup = ({ onDismiss }) => {
    const classes = useStyles();

    const {
        room: {
            id: roomId,
            type: roomType,
            member: { role }
        },
        chat
    } = useCurrentRoom();

    const [pendingGuest, setPendingGuest] = useState("");
    const [addGuestSuccess, setAddGuestSuccess] = useState(null);
    const [addGuestError, setAddGuestError] = useState(null);
    const guestTimeout = useRef(null);
    const addGuest = (id) => {
        if (id && id.length && roomType == "public" && role == "owner") {
            setAddGuestError(null);
            setAddGuestSuccess(null);
            clearTimeout(guestTimeout.current);

            updateRole(roomId, id, "host").then((res) => {
                if (res && res.userId) {
                    setAddGuestSuccess(id);
                    chat.sendData({ eventName: "updatedRole", userId: res.userId });
                    guestTimeout.current = setTimeout(() => {
                        onDismiss();
                        guestTimeout.current = setTimeout(() => {
                            setPendingGuest("");
                            setAddGuestError(null);
                            setAddGuestSuccess(null);
                        }, 1000);
                    }, 2500);
                } else {
                    setAddGuestError("Could not add co-host.");
                }
            });
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(guestTimeout.current);
        };
    }, []);

    return (
        <>
            <DialogTitle disableTypography className={classes.dialogTitle}>
                <Typography align="center" variant="h5" className={classes.title}>
                    Add a co-host
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {addGuestSuccess ? (
                    <Box className={classes.boxContainer}>
                        <Typography align="center" variant="h6" className={classes.primary}>
                            @{pendingGuest} has been added as a co-host
                        </Typography>
                    </Box>
                ) : (
                    <TextField
                        fullWidth
                        autoFocus
                        size="small"
                        margin="dense"
                        variant="outlined"
                        placeholder="enter a username"
                        error={!!addGuestError}
                        helperText={addGuestError}
                        value={pendingGuest}
                        InputProps={{
                            classes: {
                                root: classes.outlinedInput,
                                notchedOutline: classes.notchedOutline
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key == "Enter") {
                                addGuest(pendingGuest);
                                e.preventDefault();
                            }
                        }}
                        onChange={({ target: { value } }) => {
                            setPendingGuest(value);
                        }}
                    />
                )}
            </DialogContent>
            {!addGuestSuccess && (
                <DialogActions className={classes.dialogActions}>
                    <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        classes={{
                            root: classes.button,
                            outlined: classes.outlinedButton,
                            label: classes.buttonLabel
                        }}
                        onClick={() => {
                            clearTimeout(guestTimeout.current);
                            setAddGuestSuccess(null);
                            setAddGuestError(null);
                            setPendingGuest("");
                            onDismiss(false);
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        fullWidth
                        classes={{
                            root: classes.button,
                            contained: classes.containedButton,
                            label: classes.buttonLabel
                        }}
                        onClick={() => {
                            addGuest(pendingGuest);
                        }}
                    >
                        ADD
                    </Button>
                </DialogActions>
            )}
        </>
    );
};

export default AddCohostPopup;
