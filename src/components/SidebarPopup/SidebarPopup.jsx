import React, { useEffect, useState } from "react";
import { Button, Popover, Typography, FormControlLabel, Checkbox, makeStyles } from "@material-ui/core";
import * as localForage from "localforage";

const useStyles = makeStyles((theme) => ({
    modal: {
        backgroundColor: "rgba(0,0,0,0.8)"
    },
    paper: {
        position: "fixed",
        margin: "0px",
        width: "100%",
        marginTop: theme.functions.rems(60),
        backgroundColor: "transparent",
        borderRadius: theme.functions.rems(4)
    },
    main: {
        display: "flex",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#3A006E"
    },
    mainModal: {
        display: "flex",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#3A006E"
    },
    popHeader: {
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonGroup: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonFooter: {
        borderRadius: 0,
        width: "100%",
        height: 50,
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#3A006E"
    },
    buttonFooterCancel: {
        borderRadius: 0,
        width: "100%",
        height: 50,
        fontSize: "1rem",
        color: "rgba(255,255,255,0.5)",
        backgroundColor: "rgba(0, 0, 0, 0.2)"
    },
    menuButtonRd: {
        borderRadius: 70,
        padding: 10,
        backgroundColor: "red",
        color: "white",
        height: 70,
        width: 70,
        marginRight: 20,
        marginLeft: 20,
        fontSize: "10rem"
    },
    mrow: {
        backgroundColor: "rgba(180,50,255,0.4)",
        paddingTop: 15,
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingBottom: 70,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }
}));

const SidebarPopup = ({
    target,
    title,
    modal,
    confirmTitle,
    dismissTitle,
    visible,
    visibleId,
    askSave,
    onDismiss,
    onConfirm,
    children,
    disableBackdropClose,
    confirmDisabled,
    ...others
}) => {
    //const [roomCode, setRoomCode] = useState("");
    if (!target && typeof document !== "undefined") {
        target = document.body;
    }
    const classes = useStyles();
    const [localVisible, setLocalVisible] = useState(false);
    const [saveId, setSaveId] = useState(askSave ? false : true);

    useEffect(() => {
        if (visibleId) {
            localForage.getItem("popup-" + visibleId).then((cm) => {
                if (cm) {
                    setLocalVisible(false);
                } else {
                    if (saveId) {
                        localForage.setItem("popup-" + visibleId, true);
                    }
                    setLocalVisible(true);
                }
            });
        } else {
            setLocalVisible(true);
        }
    }, [visibleId, saveId]);
    //const [anchorEl, setAnchorEl] = useState(null);

    const localDismiss = () => {
        setLocalVisible(false);
    };

    return (
        <Popover
            classes={{ root: modal && classes.modal, paper: classes.paper }}
            open={!!(visible || (visibleId && localVisible))}
            anchorEl={target}
            onClose={() => !disableBackdropClose && onDismiss()}
            transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            container={() => (typeof document === "undefined" ? null : document.body)}
            {...others}
        >
            <div className={modal ? classes.mainModal : classes.main}>
                {title && (
                    <div className={classes.popHeader}>
                        <Typography variant={"body1"} align={"center"}>
                            {title}
                        </Typography>
                    </div>
                )}

                <div className={classes.mrow} style={{ paddingBottom: confirmTitle || dismissTitle ? 70 : 30 }}>
                    {children}
                    {askSave && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color={"primary"}
                                    style={{ backgroundColor: "transparent" }}
                                    onChange={(e) => {
                                        e && e.target && setSaveId(e.target.checked);
                                    }}
                                    name="skip"
                                />
                            }
                            label={askSave}
                        />
                    )}
                </div>

                <div className={classes.buttonGroup}>
                    {dismissTitle && (
                        <Button
                            color={"primary"}
                            className={classes.buttonFooterCancel}
                            variant={"contained"}
                            onClick={() => {
                                onDismiss && onDismiss();
                                visibleId && localDismiss();
                            }}
                        >
                            {dismissTitle}
                        </Button>
                    )}
                    {confirmTitle && (
                        <Button
                            classes={{ root: classes.buttonFooter }}
                            color={"primary"}
                            variant={"contained"}
                            onClick={() => {
                                onConfirm && onConfirm();
                                visibleId && localDismiss();
                            }}
                            disabled={confirmDisabled}
                        >
                            {confirmTitle}
                        </Button>
                    )}
                </div>
            </div>
        </Popover>
    );
};
export default SidebarPopup;
