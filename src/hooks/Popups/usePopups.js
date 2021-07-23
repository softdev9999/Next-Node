import { useState } from "react";

const usePopups = () => {
    const [open, setOpen] = useState({});

    const showPopup = (name, show, options) => {
     //   console.trace(name, show, options, open);
        if (!show) {
            if (open.name == name || !open.name) {
                setOpen({});
            }
        } else {
            setOpen({ name, options });
        }
    };

    return {
        account: {
            open: open.name == "account",
            show: (isOpen, options) => showPopup("account", isOpen, options),
            options: open.options
        },
        confirmation: {
            open: open.name == "confirmation",
            show: (isOpen, options) => showPopup("confirmation", isOpen, options),
            options: open.options
        },
        hosting: {
            open: open.name == "hosting",
            show: (isOpen, options) => showPopup("hosting", isOpen, options),
            options: open.options
        },
        addScener: {
            open: open.name == "addScener",
            show: (isOpen, options) => showPopup("addScener", isOpen, options),
            options: open.options
        },
        editProfile: {
            open: open.name == "editProfile",
            show: (isOpen, options) => showPopup("editProfile", isOpen, options),
            options: open.options
        },
        deleteAccount: {
            open: open.name == "deleteAccount",
            show: (isOpen, options) => showPopup("deleteAccount", isOpen, options),
            options: open.options
        },
        sidebarHelp: {
            open: open.name == "sidebarHelp",
            show: (isOpen, options) => showPopup("sidebarHelp", isOpen, options),
            options: open.options
        },
        feedback: {
            open: open.name == "feedback",
            show: (isOpen, options) => showPopup("feedback", isOpen, options),
            options: open.options
        },
        sidebarAlert: {
            open: open.name == "sidebarAlert",
            show: (isOpen, options) => showPopup("sidebarAlert", isOpen, options),
            options: open.options
        },
        addEvent: {
            open: open.name == "addEvent",
            show: (isOpen, options) => showPopup("addEvent", isOpen, options),
            options: open.options
        },
        error: {
            open: open.name == "error",
            show: (isOpen, options) => showPopup("error", isOpen, options),
            options: open.options
        }
    };
};

export default usePopups;
