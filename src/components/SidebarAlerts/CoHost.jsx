import { useCurrentRoom } from "hooks/Room/Room";
import { makeStyles, DialogContent, DialogActions, Typography, Button } from "@material-ui/core";
import { useExtension } from "hooks/Extension/Extension";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        padding: theme.spacing(2, 5)
    },
    dialogActions: {
        padding: theme.spacing(2, 5)
    },
    primary: {
        fontSize: theme.spacing(1.9),
        fontWeight: 800,
        letterSpacing: 0.41,
        lineHeight: theme.spacing(3)
    },
    secondary: {
        fontSize: theme.spacing(1.8)
    },
    name: {
        fontWeight: 800,
        color: theme.palette.primary.main,
        fontSize: theme.spacing(1.9),
    },
    button: {
        boxShadow: "none",
        minWidth: theme.spacing(13.5),
        minHeight: theme.spacing(4)
    },
    containedButton: {
        background: theme.functions.rgba(theme.palette.common.white, 0.25),
        color: theme.palette.common.white,
        "&:hover,&:focus,&:active": {
            background: theme.functions.rgba(theme.palette.common.white, 0.25),
            color: theme.palette.common.white
        }
    },
    buttonLabel: {
        fontSize: theme.spacing(1.9),
        fontWeight: 800,
        letterSpacing: 0.4,
        lineHeight: theme.spacing(2)
    }
}));

const CoHostAlert = ({ onDismiss }) => {
    const classes = useStyles();
    const { room } = useCurrentRoom();
    const { sendMessage } = useExtension();

    const openSetupPopup = () => {
        sendMessage("openAvSetupPopup", "background", {});
    };
    const joinAsCohost = () => {
        openSetupPopup();
        onDismiss();
    };

    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h4" align="center" gutterBottom className={classes.primary}>
                    <Typography component="span" className={classes.name}>
                        @{room.owner.username}
                    </Typography>{" "}
                    invited you to co-host!
                </Typography>
                <Typography variant="body1" align="center" className={classes.secondary}>
                    You can join now, or click the {"'Join as "} <br/> {"Co-Host'"} button in the sidebar at any time.
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button
                    classes={{ root: classes.button, contained: classes.containedButton, label: classes.buttonLabel }}
                    variant="contained"
                    onClick={onDismiss}
                >
                    Dismiss
                </Button>
                <Button
                    classes={{ root: classes.button, label: classes.buttonLabel }}
                    variant="contained"
                    color="secondary"
                    onClick={joinAsCohost}
                    fullWidth
                >
                    Join as Co-Host
                </Button>
            </DialogActions>
        </>
    );
};
export default CoHostAlert;
