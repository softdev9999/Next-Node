import { useState, useEffect } from "react";
import Login from "../AccountScreens/Login";
import CreateAccount from "../AccountScreens/CreateAccount";
import ForgotPassword from "../AccountScreens/ForgotPassword";
import FinishedAccountCreation from "../AccountScreens/FinishedAccountCreation";
import { useRouter } from "next/router";
import { useApp } from "hooks/Global/GlobalAppState";
const AccountPopup = ({ skipFinish, onDismiss, onFinished, initialView = "signup", singleView = false, message, dialog }) => {
    const {
        auth: { user }
    } = useApp();
    const [currentView, setCurrentView] = useState(initialView);
    const router = useRouter();

    useEffect(() => {
        console.log(initialView);
        if (initialView) {
            setCurrentView(initialView);
        }
    }, [initialView]);

    const onComplete = (choice) => {
        switch (choice) {
            case "host": {
                router.push("/host", "/host");

                break;
            }
            case "profile":
            default: {
                router.push("/[username]", "/" + user.username);
                onDismiss();
                break;
            }
        }
    };

    switch (currentView) {
        case "login": {
            return (
                <Login
                    message={message}
                    hideCancel
                    onFinished={(u) => (onFinished ? onFinished(u) : onDismiss())}
                    onSignUpClicked={() => setCurrentView("signup")}
                    onForgotPasswordClicked={() => setCurrentView("forgot")}
                />
            );
        }
        case "signup": {
            return (
                <CreateAccount
                    message={message}
                    hideCancel
                    onFinished={(u) => (onFinished ? onFinished(u) : !skipFinish ? setCurrentView("finished") : onDismiss())}
                    onLoginClicked={() => setCurrentView("login")}
                />
            );
        }
        case "forgot": {
            return (
                <ForgotPassword
                    title={"Forgot password?"}
                    hideCancel
                    onLoginClicked={() => setCurrentView("login")}
                    onFinished={onDismiss}
                    showBackButton={!singleView}
                />
            );
        }
        case "finished": {
            return <FinishedAccountCreation dialog={dialog} onFinished={onComplete} />;
        }
    }
};

export default AccountPopup;
