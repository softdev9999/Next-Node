import { DialogContent, DialogActions, Typography, Button, DialogTitle, Grid } from "@material-ui/core";
import { useExtension } from "hooks/Extension/Extension";
import UpdateIcon from "@material-ui/icons/Update";

const UpdateExtension = ({ onDismiss, hideDismiss }) => {
    const { needsUpdate } = useExtension();
    return (
        <>
            <DialogTitle disableTypography>
                <Typography align="center" variant="h3">
                    {needsUpdate ? "UPDATE TO CONTINUE" : "UPDATE SCENER"}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container alignItems="center" justify="center" spacing={1}>
                    <Grid item>
                        <UpdateIcon style={{ fontSize: 70 }} />
                    </Grid>
                    <Grid item xs={12}>
                        {needsUpdate ? (
                            <Typography variant={"h6"} align={"center"}>
                                Scener must be updated to continue
                            </Typography>
                        ) : (
                            <Typography variant={"h6"} align={"center"}>
                                New Scener Update Available
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h6"} align={"center"}>
                            Quit and reopen your Chrome browser to update
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            {!hideDismiss && (
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => onDismiss(false)} fullWidth>
                        OK
                    </Button>
                </DialogActions>
            )}
        </>
    );
};
export default UpdateExtension;
