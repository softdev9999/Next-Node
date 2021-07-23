import { useCurrentRoom } from "hooks/Room/Room";
import { makeStyles, DialogContent, DialogActions, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        padding: theme.spacing(1, 2)
    },
    dialogActions: {
        padding: theme.spacing(2, 3)
    },
    primary: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.41,
        lineHeight: theme.spacing(3)
    },
    button: {
        boxShadow: "none",
        minWidth: theme.spacing(13.5),
        minHeight: theme.spacing(5)
    },
    containedButton: {
        background: "#D81B3C",
        color: theme.palette.common.white,
        '&:hover,&:active,&:focus': {
            background: "#D81B3C",
            color: theme.palette.common.white,
        }
    },
    buttonLabel: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.4,
        lineHeight: theme.spacing(2)
    }
}));

const StopCoHostingConfirmation = ({ onDismiss }) => {
    const classes = useStyles();
    const { room } = useCurrentRoom();
    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <Typography align="center" variant="h4" gutterBottom className={classes.primary}>
                    Are you sure?
                </Typography>
                <Typography align="center" className={classes.primary}>@{room.owner.username} will have to <br />reinvite you to co-host.</Typography>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button
                    variant="contained"
                    color="secondary"
                    classes={{ root: classes.button, label: classes.buttonLabel }}
                    onClick={() => onDismiss(false)}
                >
                    CANCEL
                </Button>
                <Button
                    variant="contained"
                    classes={{ root: classes.button, contained: classes.containedButton, label: classes.buttonLabel }}
                    onClick={() => onDismiss(true)}
                    fullWidth
                >
                    STOP CO-HOSTING
                </Button>
            </DialogActions>
        </>
    );
};
export default StopCoHostingConfirmation;
