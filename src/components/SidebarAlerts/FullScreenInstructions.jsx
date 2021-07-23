import { DialogContent, DialogActions, Typography, Button, DialogTitle, Grid } from "@material-ui/core";
import { isMac } from "utils/Browser";
import { useContentState } from "hooks/ContentState/ContentState";
const FullScreenInstructions = ({ onDismiss }) => {
    const { currentServiceFormatted } = useContentState();
    return (
        <>
            <DialogTitle disableTypography>
                <Typography align="center" variant="h3">
                    FULLSCREEN INSTRUCTIONS
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container alignItems="center" justify="center" spacing={1}>
                    {isMac() ? (
                        <>
                            <Grid item xs={12} sm={11}>
                                <img src={"/images/Scener-FS-mac.gif"} style={{ width: "100%" }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={"body2"}>
                                    1. Place <b>{currentServiceFormatted}</b> video in full screen
                                </Typography>
                                <Typography variant={"body2"}>2. Press [Control] + [Up] for Mission Control</Typography>
                                <Typography variant={"body2"}>
                                    3. Drag the Scener window up to <b>{currentServiceFormatted || "the video"}</b>{" "}
                                </Typography>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} sm={12}>
                                <Typography variant={"body2"}>
                                    1. Place <b>{currentServiceFormatted}</b> video in full screen
                                </Typography>
                                <Typography variant={"body2"}>2. Press the [ALT] + [TAB] keys</Typography>
                                <Typography variant={"body2"}>3. Select the Scener window</Typography>
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => onDismiss(false)}>
                    OK
                </Button>
            </DialogActions>
        </>
    );
};
export default FullScreenInstructions;
