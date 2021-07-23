import { Typography, makeStyles, Box, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

import ErrorIcon from "@material-ui/icons/Error";
const useStyles = makeStyles((theme) => ({
    viewfinderErrors: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        display: "flex",
        width: "100%",
        height: "100%",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,.7)",
        transition: theme.transitions.create(),
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // transform: "translate(-50%,-50%)",
        borderRadius: 0,
        zIndex: 1000,
        opacity: 1
    },
    dismiss: {
        position: "absolute",
        right: theme.spacing(0.5),
        top: theme.spacing(0.5),
        zIndex: 1001
    }
}));

function ViewfinderError({ error, onDismiss }) {
    const classes = useStyles();

    return (
        error && (
            <Box className={classes.viewfinderErrors}>
                <Box className={classes.dismiss}>
                    <IconButton onClick={onDismiss}>
                        <Close />
                    </IconButton>
                </Box>
                <ErrorIcon style={{ height: "6rem", width: "6rem", flex: "0 0 6rem" }} />
                <Typography align="center" variant="body1" style={{ flex: "0 1 100%" }}>
                    {error}
                </Typography>
            </Box>
        )
    );
}

export default ViewfinderError;
