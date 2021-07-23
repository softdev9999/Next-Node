import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import SuccessIcon from "@material-ui/icons/CheckCircleOutline";
import { useCallback } from "react";
const useStyles = makeStyles((theme) => ({
    progress: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        opacity: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    successButton: {
        backgroundColor: theme.palette.success.main,
        "&:hover": {
            backgroundColor: theme.palette.success.dark
        }
    },
    errorButton: {
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.dark
        }
    }
}));

const ButtonWithFeedback = ({
    children,
    style,
    color,
    startIcon,
    disabled,
    status,
    classes,
    successIcon,
    successMessage,
    errorIcon,
    errorMessage,
    waitingMessage,
    loadingMessage,
    timeout,
    onTimeout,
    ...props
}) => {
    const btnClasses = useStyles();

    const getClasses = useCallback(() => {
        if (status == "success") {
            return Object.assign({}, classes, { root: btnClasses.successButton });
        } else if (status == "error") {
            return Object.assign({}, classes, { root: btnClasses.errorButton });
        } else {
            return classes;
        }
    }, [classes, status, btnClasses]);

    const getStartIcon = useCallback(() => {
        if (status == "error") {
            return errorIcon;
        } else if (status == "success") {
            return successIcon;
        } else if (status == "waiting") {
            return errorIcon;
        } else if (status == "loading") {
            return <CircularProgress size="1em" color={color && color != "default" ? "inherit" : "primary"} />;
        } else {
            return startIcon;
        }
    }, [successIcon, startIcon, errorIcon, status]);

    const getTitle = useCallback(() => {
        if (status == "error") {
            return [errorMessage];
        } else if (status == "success") {
            return [successMessage];
        } else if (status == "waiting") {
              return [waitingMessage];
        } else if (status == "loading") {
            return [loadingMessage];
        } else {
            return children;
        }
    }, [successMessage, children, errorMessage, status]);

    useEffect(() => {
        if (status && timeout && (status != "loading" && status != "waiting")) {
            let t = setTimeout(() => onTimeout(null), timeout);
            return () => clearTimeout(t);
        }
    }, [status, timeout]);

    return (
        <Button
            {...props}
            classes={getClasses()}
            style={Object.assign({ position: "relative" }, style)}
            color={color}
            disabled={disabled || (status == "loading" || status == "waiting")}
            startIcon={getStartIcon()}
        >
            {getTitle()}
        </Button>
    );
};
ButtonWithFeedback.defaultProps = {
    successIcon: <SuccessIcon />,
    successMessage: "Success!",
    errorIcon: <ErrorIcon />,
    errorMessage: "Error",
    loadingMessage: "Loading...",
    waitingMessage: "Waiting...",
    timeout: 2000,
    onTimeout: () => {}
};
export default ButtonWithFeedback;
