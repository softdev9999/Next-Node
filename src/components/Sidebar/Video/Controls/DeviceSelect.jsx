import { useEffect } from "react";
import {
    Select,
    MenuItem,
    Popover,
    withStyles,
    DialogContent,
    DialogTitle,
    InputLabel,
    Grow,
    IconButton,
    FormGroup,
    InputBase,
    Typography,
    Button,
    Divider
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import VideocamIcon from "@material-ui/icons/VideocamRounded";
import MicIcon from "@material-ui/icons/MicRounded";
import CloseIcon from "@material-ui/icons/CloseRounded";
//import HeadphoneIcon from "@material-ui/icons/Headset";
import { useMedia } from "hooks/UserMedia/MediaProvider";
//import SpeakerIcon from "@material-ui/icons/Speaker";
const IconComponent = (props) => {
    return (
        <IconButton {...props}>
            <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
    );
};
function DeviceSelect({ visible, onDismiss, anchorEl, classes }) {
    const {
        devices: {
            audioDevice,
            selectAudioDevice,
            videoDevice,
            selectVideoDevice,
            availableDevices,
            //  selectOutputDevice,
            // outputDevice,
            loadAvailableDevices
        }
    } = useMedia();

    useEffect(() => {
        if (visible) {
            loadAvailableDevices();
        }
    }, [visible]);

    const videoUnavailable = !availableDevices || !availableDevices.video.length;
    const audioUnavailable = !availableDevices || !availableDevices.audio.length;
    //const outputUnavailable = !availableDevices || !availableDevices.output.length;

    return (
        <Popover
            anchorEl={anchorEl}
            open={visible}
            onClose={onDismiss}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            TransitionComponent={Grow}
            BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,.8)" } }}
            PaperProps={{ classes: { root: classes.popoverPaper } }}
        >
            <IconButton className={classes.closeButton} onClick={onDismiss}>
                <CloseIcon />
            </IconButton>
            <DialogTitle disableTypography className={classes.dialogTitle}>
                Settings
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <FormGroup className={classes.formgroup}>
                    <InputLabel component="div" className={classes.inputLabel}>
                        <div className={classes.iconContainer}>
                            <VideocamIcon className={classes.labelIcon} />
                        </div>
                        Camera
                    </InputLabel>
                    <Select
                        disabled={videoUnavailable}
                        classes={{
                            select: classes.select,
                            selectMenu: classes.selectMenu,
                            icon: classes.icon
                        }}
                        value={videoDevice ? videoDevice.deviceId : ""}
                        onChange={({ target: { value } }) => selectVideoDevice(value)}
                        input={<InputBase fullWidth classes={{ root: classes.inputbase }} />}
                        MenuProps={{
                            classes: {
                                paper: classes.paper
                            },
                            elevation: 0,
                            anchorReference: null,
                            anchorOrigin: { vertical: "bottom", horizontal: "center" },
                            transformOrigin: { vertical: "top", horizontal: "center" }
                        }}
                        inputProps={{
                            name: "video"
                        }}
                        IconComponent={IconComponent}
                    >
                        {!videoUnavailable &&
                            availableDevices.video.map((d) => (
                                <MenuItem key={d.deviceId} value={d.deviceId}>
                                    {d.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormGroup>
                <FormGroup className={classes.formgroup}>
                    <InputLabel component="div" className={classes.inputLabel}>
                        <div className={classes.iconContainer}>
                            <MicIcon className={classes.labelIcon} />
                        </div>
                        Microphone
                    </InputLabel>
                    <Select
                        disabled={!availableDevices || !availableDevices.audio.length}
                        classes={{
                            select: classes.select,
                            selectMenu: classes.selectMenu,
                            icon: classes.icon
                        }}
                        value={audioDevice ? audioDevice.deviceId : ""}
                        onChange={({ target: { value } }) => selectAudioDevice(value)}
                        input={<InputBase fullWidth classes={{ root: classes.inputbase }} />}
                        MenuProps={{
                            classes: {
                                paper: classes.paper
                            },
                            elevation: 0,
                            anchorReference: null,
                            anchorOrigin: { vertical: "bottom", horizontal: "center" },
                            transformOrigin: { vertical: "top", horizontal: "center" }
                        }}
                        inputProps={{
                            name: "audio",
                            id: "audio-select"
                        }}
                        IconComponent={IconComponent}
                    >
                        {!audioUnavailable &&
                            availableDevices.audio.map((d) => (
                                <MenuItem key={d.deviceId} value={d.deviceId}>
                                    {d.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormGroup>
                <Divider />
                <FormGroup className={classes.formgroup} style={{ marginTop: "1rem" }}>
                    <Typography align="center" paragraph>
                        Problems with your camera or mic?
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => window.location.reload()}>
                        Reload
                    </Button>
                </FormGroup>
                {/*   <FormGroup>
                    <InputLabel component="div" className={classes.inputLabel}>
                        <div className={classes.iconContainer}>
                            <HeadphoneIcon className={classes.labelIcon} />
                        </div>
                        Output (Choose Headphones!)
                    </InputLabel>
                    <Select
                        disabled={outputUnavailable}
                        classes={{
                            classes:{
                                paper: classes.paper
                            },
                            select: classes.select,
                            selectMenu: classes.selectMenu,
                            icon: classes.icon
                        }}
                        value={outputDevice ? outputDevice.deviceId : ""}
                        onChange={({ target: { value } }) => selectOutputDevice(value)}
                        inputProps={{
                            name: "output",
                            id: "output-select"
                        }}
                        input={<InputBase fullWidth classes={{ root: classes.inputbase }} />}
                        MenuProps={{
                            elevation: 0,
                            anchorReference: null,
                            anchorOrigin: { vertical: "bottom", horizontal: "center" },
                            transformOrigin: { vertical: "top", horizontal: "center" }
                        }}
                        IconComponent={IconComponent}
                    >
                        {!outputUnavailable &&
                            availableDevices.output.map((d) => (
                                <MenuItem key={d.deviceId} value={d.deviceId}>
                                    {d.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormGroup> */}
            </DialogContent>
        </Popover>
    );
}

const styles = (theme) => ({
    popoverPaper: {
        minWidth: "calc(100% - 32px)",
        backgroundImage: theme.gradients.create("56.18", `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 100%`)
    },
    paper: {
        backgroundImage: theme.gradients.create("56.18", `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 100%`)
    },
    dialogTitle: {
        fontSize: theme.spacing(3),
        fontWeight: 800,
        textAlign: "center",
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    dialogContent: {
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: theme.spacing(4, 2, 8)
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0
    },
    buttonIcon: {
        fontSize: "1.5rem"
    },
    headphoneIconContainer: {
        flex: "0 0 3rem",
        height: "3rem",
        width: "3rem",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center"
    },
    formgroup: {
        flexWrap: "unset",
        marginBottom: theme.spacing(3)
    },
    inputLabel: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.common.white,
        fontWeight: 800,
        fontSize: theme.spacing(2),
        letterSpacing: 0.5,
        lineHeight: theme.spacing(3.6),
        paddingLeft: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    iconContainer: {
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(1.5)
    },
    labelIcon: {
        fontSize: theme.spacing(3.5)
    },
    inputbase: {
        backgroundColor: "rgba(255,255,255,0.1)"
    },
    select: {
        paddingLeft: theme.spacing(1.5),
        paddingRight: `${theme.spacing(6)}!important`
    },
    selectMenu: {
        lineHeight: theme.spacing(3.6),
        fontSize: theme.spacing(2),
        letterSpacing: 0.29
    },
    icon: {
        padding: 0,
        top: "auto",
        height: "100%",
        background: "rgba(255,255,255,0.3)",
        borderRadius: 0,
        width: theme.spacing(5)
    }
});

export default withStyles(styles)(DeviceSelect);
