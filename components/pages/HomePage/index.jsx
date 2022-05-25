import React, { useEffect, useState, useCallback } from 'react';
import { Typography, TextField, Button, Modal, Select, MenuItem, InputLabel, } from '@material-ui/core';
import './index.css';
import axios from 'axios';

const validator = require("email-validator");

export default function HomePage({...props}) {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [major, setMajor] = useState("");
    const [biography, setBiography] = useState("");
    const [isDonor, setIsDonor] = useState(true);
    const [hasLoginError, setHasLoginError] = useState(false);
    const [hasRegisterError, setHasRegisterError] = useState(false);
    const [hasInvalidEmail, setHasInvalidEmail] = useState(false);

    const getDiningHalls = () => {
        axios.get("/list/dining_halls").then((response) => {
            props.setDiningHalls(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    const login = useCallback(() => {
        email.trim();
        const emailPrefix = email.replace('@stanford.edu', '');
        axios.post("/login", {
            emailPrefix,
            password,
        })
        .then((response) => {
            props.setUser(response.data);
            getDiningHalls();
        })
        .catch((err) => {
            console.error(err);
            setHasLoginError(true);
        });
    }, [email, password]);

    const register = useCallback(() => {
        if (!email || !password || !firstName || !lastName || !major || !biography) {
            setHasRegisterError(true);
            return;
        }

        setHasRegisterError(false);
        email.trim();

        const isStanfordEmail = email.endsWith('@stanford.edu');
        const isValidEmail = validator.validate(email);
        if (!isStanfordEmail || !isValidEmail) {
            setHasInvalidEmail(true);
            return;
        }

        setHasInvalidEmail(false);
        const emailPrefix = email.replace('@stanford.edu', '');

        axios.post("/register", {
            emailPrefix,
            password,
            first_name: firstName,
            last_name: lastName,
            isDonor,
            major,
            biography,
        })
        .then((response) => {
            props.setUser(response.data);
            getDiningHalls();
        })
        .catch((err) => {
            console.error(err);
            setHasRegisterError(true);
        });
    }, [
        email,
        password,
        firstName,
        lastName,
        isDonor,
        major,
        biography,
    ]);

    const toggleRegisterModal = useCallback(() => {
        setShowRegisterModal(!showRegisterModal)
    }, [showRegisterModal]);

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    }, [email]);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
    }, [password]);

    const handleFirstNameChange = useCallback((e) => {
        setFirstName(e.target.value);
    }, [firstName]);

    const handleLastNameChange = useCallback((e) => {
        setLastName(e.target.value);
    }, [lastName]);

    const handleMajorChange = useCallback((e) => {
        setMajor(e.target.value);
    }, [major]);

    const handleBiographyChange = useCallback((e) => {
        setBiography(e.target.value);
    }, [biography]);

    const handleIsDonorChange = useCallback((e) => {
        setIsDonor(e.target.value);
    }, [isDonor]);

    useEffect(() => {
        props.setContext("Meal Plan Underground");
    }, []);

    return (
        <>
            <div className="homepage-container">
                <div className='logo-container'>
                    <img src="../../../static/images/logo.png" />
                </div>
                <div className="login-container">
                    <TextField
                        className="login-input email-input"
                        id="outlined-basic"
                        label="Stanford Email"
                        variant="outlined"
                        onChange={handleEmailChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <TextField
                        className="login-input password-input"
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={handlePasswordChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <Button
                        className="login-btn"
                        variant="contained"
                        disableElevation
                        onClick={login}
                        style={{
                            marginBottom: '15px'
                        }}
                    >
                        Login
                    </Button>
                    {hasLoginError && (
                        <Typography
                            variant="body1"
                            className="login-error-body"
                            style={{
                                marginBottom: '5px',
                            }}
                        >
                            Error logging in. Please try agian.
                        </Typography>
                    )}
                    <Typography variant="body1" className="login-body">
                        Not a member? <span className="register-text" onClick={toggleRegisterModal}>Register</span>.
                    </Typography>
                </div>
            </div>

            <Modal
                open={showRegisterModal}
                onClose={toggleRegisterModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '30px',
                }}
            >
                <div className="register-container">
                    <TextField
                        className="register-input fname-input"
                        id="outlined-basic"
                        label="First Name"
                        variant="outlined"
                        onChange={handleFirstNameChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <TextField
                        className="register-input lname-input"
                        id="outlined-basic"
                        label="Last Name"
                        variant="outlined"
                        onChange={handleLastNameChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <TextField
                        className="register-input major-input"
                        id="outlined-basic"
                        label="Major"
                        variant="outlined"
                        onChange={handleMajorChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <TextField
                        className="register-input bio-input"
                        id="outlined-multiline-static"
                        label="Bio"
                        variant="outlined"
                        onChange={handleBiographyChange}
                        rows={4}
                        required
                        multiline
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <TextField
                        className="register-input email-input"
                        id="outlined-basic"
                        label="Stanford Email"
                        error={hasInvalidEmail}
                        helperText={hasInvalidEmail ? "Must be a valid @stanford.edu address." : ""}
                        variant="outlined"
                        onChange={handleEmailChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <TextField
                        className="register-input password-input"
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={handlePasswordChange}
                        required
                        style={{
                            marginBottom: '20px'
                        }}
                    />
                    <InputLabel style={{ marginBottom: '10px' }}>
                        Do you plan to give meal swipes or recieve meal swipes?
                    </InputLabel>
                    <Select
                        value={isDonor}
                        onChange={handleIsDonorChange}
                        style={{
                            width: '100%',
                            marginBottom: '25px',
                        }}
                    >
                        <MenuItem value={true}>I plan to give meal swipes.</MenuItem>
                        <MenuItem value={false}>I plan to recieve meal swipes.</MenuItem>
                    </Select>
                    <Button
                        className="register-btn"
                        variant="contained"
                        disableElevation
                        onClick={register}
                    >
                        Register
                    </Button>
                    {hasRegisterError && (
                        <Typography
                            variant="body1"
                            className="register-error-body"
                            style={{
                                marginTop: '5px',
                            }}
                        >
                            Error registering. Please populate all fields.
                        </Typography>
                    )}
                </div>
            </Modal>
        </>
    );
}
