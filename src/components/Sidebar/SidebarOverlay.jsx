import { Backdrop, Button, Grid, Portal, Typography } from "@material-ui/core";

function SidebarOverlay({ visible, title, message, button, onButtonClick }) {
    return (
        <Portal>
            <Backdrop open={visible} style={{ background: "rgba(0,0,0,.8)", zIndex: 10000 }}>
                <div>
                    <Grid container spacing={3}>
                        {title && (
                            <Grid item xs={12}>
                                <Typography variant="h3" align="center">
                                    {title}
                                </Typography>
                            </Grid>
                        )}
                        {message && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" align="center">
                                    {message}
                                </Typography>
                            </Grid>
                        )}
                        {button && onButtonClick && (
                            <Grid item xs={12}>
                                <Button fullWidth variant="outlined" color="primary" onClick={onButtonClick}>
                                    {button}
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </Backdrop>
        </Portal>
    );
}
export default SidebarOverlay;
