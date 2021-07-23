import { useState } from "react";
import { Typography, withStyles } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/SyncRounded";
import Popup from "../Popup/Popup";
import { createReminder } from "utils/API";

import dynamic from "next/dynamic";
const MuiPhoneNumber = dynamic(import("material-ui-phone-number"), { ssr: false }); // this plugin doesnt support SSR
//import MuiPhoneNumber from "material-ui-phone-number";

const ReminderPopup = ({ classes, eventHost, event, visible, onDismiss, target, ...others }) => {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    //createReminder = (fields) => { phone, code, time, userId, message, hostId
    const handleOnChange = (value) => {
        setPhone(value);
    };

    const submitForm = (e) => {
        setError(null);
        let normalizedPhone = "+" + phone.replace(/\D/g, "");

        console.log({ e });
        e && e.preventDefault();

        if (normalizedPhone.length < 10) {
            setError("Please enter a valid phone number");
            return false;
        }

        setLoading(true);
        createReminder({ phone: normalizedPhone, code: eventHost.username, time: event.startTime, message: event.description, hostId: eventHost.id })
            .then((res) => {
                console.log(res);
                setLoading(false);

                onDismiss(res);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    return (
        <Popup
            modal={false}
            target={target}
            visible={visible}
            onConfirm={submitForm}
            onDismiss={() => {
                setError(null);
                onDismiss();
            }}
            title={"SET REMINDER"}
            confirmTitle={"REMIND ME"}
            dismissTitle={"CANCEL"}
            confirmDisabled={loading}
            {...others}
        >
            <div className={classes.main}>
                {loading && (
                    <div>
                        <div style={{ transform: "scaleX(-1)" }}>
                            <SyncIcon style={{ color: "white", animation: "spin 3s infinite linear reverse" }} />
                        </div>
                    </div>
                )}
                <div className={classes.error}>
                    {error && (
                        <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                            {error}
                        </Typography>
                    )}
                </div>
                <form style={{ width: "20rem", textAlign: "center" }} onSubmit={submitForm}>
                    <Typography variant={"body2"} align={"center"} style={{ width: "100%", padding: "1rem", marginBottom: "1rem" }}>
                        Enter your phone number, and we{"'"}ll send you a reminder text when the event is ready to start!
                    </Typography>
                    <MuiPhoneNumber autoFocus={true} defaultCountry={"us"} value={phone} onChange={handleOnChange} />
                </form>
                <Typography variant={"caption"} align={"center"} style={{ marginTop: "0.5rem", width: "100%", color: "rgba(255,255,255,0.7)" }}>
                    We{"'"}ll <i>never</i> spam or share your number
                </Typography>
            </div>
        </Popup>
    );
};

const styles = () => ({
    main: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    error: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    }
});

export default withStyles(styles)(ReminderPopup);
