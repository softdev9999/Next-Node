import { useEffect, useRef, useState } from "react";
import { useApp } from "../Global/GlobalAppState";
import debounce from "lodash/debounce";
import { request, sendPhoneVerify, getPhoneVerify } from "utils/API";
import moment from "moment-timezone";
import { normalizePhone, validatePhone } from "utils/phone";
import Cookies from "js-cookie";
export default function useCreateAccountFormState({ onFinished }) {
    const {
        auth: { createNewUser }
    } = useApp();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const usernameUnique = useRef({}).current;
    const [displayName, setDisplayName] = useState("");
    const [displayNameError, setDisplayNameError] = useState(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const emailUnique = useRef({}).current;

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(null);
    const phoneUnique = useRef({}).current;

    const [phoneVerifyCheck, setPhoneVerifyCheck] = useState(null);
    const [verifyPhone, setVerifyPhone] = useState("");
    const [verifyPhoneError, setVerifyPhoneError] = useState(null);

    const [currentChecks, setCurrentChecks] = useState(0);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [showPassword, setShowPassword_] = useState(false);

    const [birthday, setBirthday] = useState("");
    const [birthdayError, setBirthdayError] = useState(null);

    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const [step, setStep] = useState(0);
    useEffect(() => {
        let emailFromCookie = Cookies.get("email");
        if (emailFromCookie) {
            emailUnique[emailFromCookie] = true;
            setEmail(emailFromCookie);
        }
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    const submitForm = (e) => {
        console.log({ e });
        e && e.preventDefault();

        if (!validate()) {
            console.log("ERROR!");
            return;
        }

        if (step == 0) {
            setStep(1);
            return;
        }

        /*if (step == 0) {
            let phoneNormalized = normalizePhone(phone);

            sendPhoneVerify(phoneNormalized).then((res) => {
                if (res && res.status) {
                    setStep(1);
                } else {
                    setPhoneError("Could not verify phone number. Please try again later.");
                }
            });

            return;
        } else if (step == 1) {
            let phoneNormalized = normalizePhone(phone);

            getPhoneVerify(phoneNormalized, verifyPhone).then((res) => {
                if (res && res.status && res.status == "approved") {
                    setStep(2);
                } else {
                    setVerifyPhoneError("Invalid verification code. Please check and try again.");
                }
            });

            return;
        }*/

        setStatus("loading");

        let ageBirthday = "";

        if (birthday && birthday > 0) {
            ageBirthday = moment().subtract(birthday, "years").unix();
            //console.log("** DATE IS **", ageBirthday);
        }

        createNewUser({ username, email, phone, password, birthday: ageBirthday, displayName })
            .then((res) => {
                console.log(res);
                setStatus("success");
                setTimeout(() => {
                    onFinished(res);
                }, 1000);
            })
            .catch((err) => {
                onError(err);

                setStatus("error");
            });
    };

    const onError = (err) => {
        let updateFn = setError;
        let goToStep = 1;
        console.log(err);
        if (err.details && err.details.field) {
            switch (err.details.field) {
                case "username": {
                    goToStep = 1;
                    updateFn = setUsernameError;
                    break;
                }
                case "password": {
                    goToStep = 1;
                    updateFn = setPasswordError;
                    break;
                }
                case "displayName": {
                    goToStep = 0;
                    updateFn = setDisplayNameError;
                    break;
                }
                case "birthday": {
                    goToStep = 0;
                    updateFn = setBirthdayError;
                    break;
                }
                case "email": {
                    goToStep = 0;
                    updateFn = setEmailError;
                    break;
                }
                case "phone": {
                    goToStep = 0;
                    updateFn = setPhoneError;
                    break;
                }
                default: {
                    goToStep = 0;
                    break;
                }
            }
        }
        setStep(goToStep);
        if (err) {
            let errMsg = err ? (err.message ? err.message : err) : "An error occurred";
            updateFn(errMsg);
        } else {
            updateFn("Sorry, something's gone wrong.");
        }
    };

    const validate = () => {
        let valid = true;

        clearErrors();
        let goToStep = 1;

        if (!displayName) {
            setDisplayNameError("Name is required.");
            goToStep = Math.min(0, goToStep);
            valid = false;
        }
        if (!email || !validateField({ email })) {
            setEmailError("Invalid email.");
            goToStep = Math.min(0, goToStep);
            valid = false;
        }
        /*if (!phone || !validateField({ phone })) {
            setPhoneError("Invalid phone number.");
            goToStep = Math.min(0, goToStep);
            valid = false;
        }*/

        if (!birthday || validateField({ birthday })) {
            console.log("*** BIRTDAY IS ***", birthday);
            setBirthdayError("Enter a valid age.");
            goToStep = Math.min(0, goToStep);
            valid = false;
        }

        /*if (valid && step == 1) {
            if (!verifyPhone) {
                setVerifyPhoneError("Please enter the verification code.");
                valid = false;
            }
        }*/

        if (valid && step == 1) {
            if (!password || !validateField({ password })) {
                setPasswordError("Password must be at least 8 characters long.");
                goToStep = Math.min(1, goToStep);
                valid = false;
            }
            if (!username || !validateField({ username })) {
                setUsernameError('Username must be at least 4 characters long and only contain letters, numbers, "_", or ".".');
                goToStep = Math.min(1, goToStep);
                valid = false;
            }
        }

        console.log(goToStep);
        if (goToStep < 1) {
            setStep(goToStep);
        }
        return valid;
    };

    const validateField = (field) => {
        if (field.username) {
            return field.username && field.username.length >= 3 && field.username.match(/^[a-zA-Z0-9_.]{3,20}$/gi);
        }
        if (field.email) {
            return field.email && field.email.match(/^.+@([\w-]+\.)+[\w-]{2,6}$/gi);
        }
        if (field.phone) {
            return validatePhone(field.phone);
        }
        if (field.password) {
            return field.password && field.password.length >= 8;
        }
        if (field.birthday) {
            return field.birthday < 13 || field.birthday > 120;
        }
        return true;
    };

    useEffect(() => {
        setUsernameError(null);

        if (username && username.length >= 4 && validateField({ username })) {
            checkUsername();
        }
    }, [username]);

    useEffect(() => {
        setEmailError(null);

        if (email && email.length >= 4 && validateField({ email })) {
            checkEmail();
        }
    }, [email]);

    useEffect(() => {
        setPhoneError(null);

        if (phone && phone.length >= 8 && validateField({ phone })) {
            checkPhone();
        }
    }, [phone]);

    const checkUsername = debounce(
        () => {
            if (typeof usernameUnique[username] === "undefined") {
                usernameUnique[username] = "loading";
                setCurrentChecks((cc) => cc + 1);

                request("/users/check?username=" + username)
                    .then((res) => {
                        if (typeof res.unique !== "undefined") {
                            usernameUnique[res.username] = res.unique;

                            return;
                        } else {
                            usernameUnique[username] = null;
                            return;
                        }
                    })
                    .then(() => {
                        setCurrentChecks((cc) => cc - 1);
                        return;
                    })
                    .catch(() => {
                        setCurrentChecks((cc) => cc - 1);
                        usernameUnique[username] = null;

                        return;
                    });
            }
        },
        1500,
        { leading: false }
    );

    const checkEmail = debounce(
        () => {
            if (typeof emailUnique[email] === "undefined") {
                emailUnique[email] = "loading";
                setCurrentChecks((cc) => cc + 1);

                request("/users/check?email=" + email)
                    .then((res) => {
                        if (typeof res.unique !== "undefined") {
                            emailUnique[email] = res.unique;
                            if (!res.unique) {
                                setEmailError("Email already in use.");
                                setStep(0);
                            }

                            return true;
                        } else {
                            emailUnique[email] = null;
                            return true;
                        }
                    })
                    .then(() => {
                        setCurrentChecks((cc) => cc - 1);
                        return;
                    })
                    .catch(() => {
                        setCurrentChecks((cc) => cc - 1);
                        emailUnique[email] = null;

                        return;
                    });
            }
        },
        1500,
        { leading: false }
    );

    const checkPhone = debounce(
        () => {
            if (typeof phoneUnique[phone] === "undefined") {
                phoneUnique[phone] = "loading";
                setCurrentChecks((cc) => cc + 1);

                request("/users/check?phone=" + encodeURIComponent(normalizePhone(phone)))
                    .then((res) => {
                        if (typeof res.unique !== "undefined") {
                            phoneUnique[phone] = res.unique;
                            if (!res.unique) {
                                setPhoneError("Phone number already in use.");
                                setStep(0);
                            }

                            return true;
                        } else {
                            phoneUnique[phone] = null;
                            return true;
                        }
                    })
                    .then(() => {
                        setCurrentChecks((cc) => cc - 1);
                        return;
                    })
                    .catch(() => {
                        setCurrentChecks((cc) => cc - 1);
                        phoneUnique[phone] = null;

                        return;
                    });
            }
        },
        1500,
        { leading: false }
    );

    const clearForm = () => {
        clearErrors();
        setPassword("");
        setUsername("");
        setEmail("");
        setPhone("");
        setDisplayName("");
        setBirthday("");
        setStep(0);
    };

    const clearErrors = () => {
        setError(null);
        setEmailError(null);
        setPhoneError(null);
        setPasswordError(null);
        setDisplayNameError(null);
        setUsernameError(null);
        setBirthdayError(null);
        //   setUsernameUnique(null);
        // setEmailUnique(null);
    };

    return {
        step,
        setStep,
        clearForm,
        clearErrors,
        username,
        usernameUnique,
        usernameError,
        setUsername,
        displayName,
        displayNameError,
        setDisplayName,
        setBirthday,
        birthday,
        birthdayError,
        setEmail,
        email,
        emailUnique,
        emailError,
        setPhone,
        phone,
        phoneUnique,
        phoneError,
        setVerifyPhone,
        verifyPhone,
        verifyPhoneError,
        password,
        passwordError,
        setPassword,
        submitForm,
        error,
        status,
        setStatus,
        currentChecks,
        showPassword
    };
}
