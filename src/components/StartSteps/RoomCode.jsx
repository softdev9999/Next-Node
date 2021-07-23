import React from "react";
import { Grid, Button, DialogContent, DialogActions, TextField, Typography, makeStyles } from "@material-ui/core";
import { useState } from "react";
import { getRoom } from "utils/API";
import { useRouter } from "next/router";
import { useExtension } from "hooks/Extension/Extension";

const useStyles = makeStyles((theme_) => ({
    content: {
        //  margin: theme.spacing(5, 6, 0, 6)
    },
    actions: {
        //    margin: theme.spacing(0, 6, 5, 6)
    }
}));

const RoomCode = ({ onDismiss }) => {
    const router = useRouter();
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [code, setCode] = useState("");
    const { isExtensionInstalled } = useExtension();

    const checkCode = () => {
        if (!code) {
            setError("Invalid code.");
            return;
        }
        setError(null);
        getRoom(code)
            .then((d) => {
                if (d && d.id) {
                    console.log(d);

                    if (d.username) {
                        router.push("/[username]", "/" + d.username);
                        onDismiss();
                    } else {
                        router.push("/join/[roomCode]", "/join/" + code);
                        onDismiss();
                    }
                } else {
                    throw "error";
                }
            })
            .catch((e) => {
                console.error(e);
                if (e) {
                    setError(e.message);
                } else {
                    setError("Invalid or expired code.");
                }
            });
    };

    return (
        <>
            <DialogContent classes={{ root: classes.content }}>
                <Grid item container xs={12} spacing={0} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h3" align="center" gutterBottom>
                            Have a theater code?
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            value={code}
                            onChange={({ currentTarget: { value } }) =>
                                setCode(
                                    value
                                        .toUpperCase()
                                        .replace(/https:\/\/.+?\/(?:join\/)?([A-Z0-9-]+?)/gi, "$1")
                                        .trim()
                                )
                            }
                            error={!!error}
                            helperText={error}
                            variant="outlined"
                            margin={"normal"}
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                            fullWidth
                            autoFocus={isExtensionInstalled}
                            inputProps={{ style: { textAlign: "center", fontWeight: "700" } }}
                            onKeyPress={({ key }) => {
                                if (key == "Enter") {
                                    checkCode();
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions classes={{ root: classes.actions }}>
                <Grid container spacing={0} alignItems="center" justify="flex-end" direction="row">
                    <Grid item xs={12} sm={12} md={6}>
                        <Button color="secondary" fullWidth variant="contained" onClick={checkCode}>
                            Join
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    );
};

export default RoomCode;
