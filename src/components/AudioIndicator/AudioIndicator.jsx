import { makeStyles, useTheme } from "@material-ui/core";

import MicIcon from "@material-ui/icons/MicRounded";
import MicOffIcon from "@material-ui/icons/MicOffRounded";

const useStyles = makeStyles((theme) => ({
    container: {
        flex: "0 0 80%",
        height: "100%",
        width: "80%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "space-around"
    },
    pip: {
        flex: "1 1 auto",
        borderRadius: 2000,
        width: "100%",
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5)
    },
    micContainer: {
        flex: "1 1 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    containerHorizontal: {
        flex: "0 1 100%",
        height: "100%",
        width: "100%",
        display: "flex",
        flexFlow: "row-reverse nowrap",
        alignItems: "center",
        justifyContent: "space-around"
    },
    pipHorizontal: {
        flex: "1 1 auto",
        borderRadius: 2000,
        height: "100%",
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));

const AudioIndicator = ({ audioLevel, audioEnabled, horizontal }) => {
    const classes = useStyles();
    const theme = useTheme();

    let pips = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#FFFF00", "#FFFF00", "#FF0000"];
    return !horizontal ? (
        <div className={classes.container}>
            {pips.map((p, i) => (
                <div
                    key={i}
                    className={classes.pip}
                    style={{
                        order: pips.length - i,
                        backgroundColor: Math.floor((Math.log(audioLevel * (audioEnabled ? 1 : 0)) + 1) * 10) > i ? p : theme.palette.primary.dark
                    }}
                />
            ))}
            <div className={classes.micContainer} style={{ order: 11 }}>
                {audioEnabled ? (
                    <MicIcon
                        style={{
                            fontSize: "3rem",
                            color: Math.floor((Math.log(audioLevel * (audioEnabled ? 1 : 0)) + 1) * 10) > 0 ? pips[0] : theme.palette.primary.dark
                        }}
                    />
                ) : (
                    <MicOffIcon
                        style={{
                            fontSize: "3rem",
                            color: theme.palette.grey[500]
                        }}
                    />
                )}
            </div>
        </div>
    ) : (
        <div className={classes.containerHorizontal}>
            {pips.map((p, i) => (
                <div
                    key={i}
                    className={classes.pipHorizontal}
                    style={{
                        order: pips.length - i,
                        backgroundColor: Math.floor((Math.log(audioLevel * (audioEnabled ? 1 : 0)) + 1) * 10) > i ? p : theme.palette.primary.dark
                    }}
                />
            ))}
        </div>
    );
};

export default AudioIndicator;
