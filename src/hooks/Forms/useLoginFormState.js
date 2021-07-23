import { useEffect, useState } from "react";
import { useApp } from "../Global/GlobalAppState";
export default function useLoginFormState({ onFinished }) {
    const {
        auth: { loginUser }
    } = useApp();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    const submitForm = (e) => {
        e && e.preventDefault();

        if (!validate()) {
            console.log("ERROR!");
            return;
        }
        setStatus("loading");

        loginUser({ username, password })
            .then((res) => {
                console.log(res);
                setStatus("success");
                onFinished(res);
            })
            .catch((err) => {
                console.log(err);

                setError(err.message);
                setStatus("error");
            });
    };

    const validate = () => {
        let valid = true;
        clearErrors();

        if (!password) {
            setPasswordError("Required");
            valid = false;
        }
        if (!username) {
            setUsernameError("Required");

            valid = false;
        }

        return valid;
    };

    const clearForm = () => {
        clearErrors();
        setPassword("");
        setUsername("");
    };

    const clearErrors = () => {
        setError(null);
        setPasswordError(null);
        setUsernameError(null);
    };
    return {
        error,
        status,
        setStatus,
        setError,
        password,
        setPassword,
        username,
        setUsername,
        usernameError,
        clearErrors,
        clearForm,
        submitForm,
        passwordError
    };
}
