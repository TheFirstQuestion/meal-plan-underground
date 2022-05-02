import React from 'react';
import { Typography, Divider } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import './LoginRegister.css';
import axios from 'axios';


class LoginRegister extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login_name: "",
            password: "",
            redirect: false,
            error: "",
            register_name: "",
            password1: "",
            password2: "",
            first_name: "",
            last_name: "",
            occupation: "",
            location: "",
            description: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.logInSubmit = this.logInSubmit.bind(this);
        this.registerSubmit = this.registerSubmit.bind(this);
        this.setLoggedInUser = props.setLoggedInUser.bind(this);

        // Clear context, in case we just logged out
        this.props.setContext("");
    }

    handleChange(event) {
        // via https://stackoverflow.com/a/34194243
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    logInSubmit(event) {
        // Stop DOM from generating a POST
        event.preventDefault();
        axios.post("/admin/login", {login_name: this.state.login_name, password: this.state.password}).then((response) => {
            this.props.setLoggedInUser(response.data);
            this.setState({redirect: true});
        }).catch((err) => {
            console.log(err);
            this.setState({error: "Incorrect login attempt! Please try again."});
        });
    }

    registerSubmit(event) {
        // Stop DOM from generating a POST
        event.preventDefault();

        // Check to make sure the required fields are filled in
        if (!this.state.register_name || !this.state.first_name || !this.state.last_name || !this.state.password1) {
            this.setState({error: "Please ensure all fields are filled out."});
            return;
        }

        // Check that passwords match
        if (this.state.password1 !== this.state.password2) {
            this.setState({error: "To avoid error, confirm your password is the same in both fields."});
            return;
        }

        axios.post("/user", {
            login_name: this.state.register_name,
            password: this.state.password1,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            occupation: this.state.occupation,
            location: this.state.location,
            description: this.state.description,
        }).then((response) => {
            // console.log(response.status + " " + response.statusText);
            if (response.status !== 200) {
                console.log(response.statusText);
            }
            // Clear the input fields
            this.setState({
                error: "Account successfully created! Please log in.",
                register_name: "",
                password1: "",
                password2: "",
                first_name: "",
                last_name: "",
                occupation: "",
                location: "",
                description: ""
            });
        }).catch((err) => {
            console.log(err);
            this.setState({error: "Your login name is in use by another user. Try again with a new login name!"});
        });
    }

    renderError() {
        if (this.state.error) {
            return (
                <Typography variant="h6" color="inherit">{this.state.error}</Typography>
            );
        }
        return (<></>);
    }

    // When there's a user logged in, we want to redirect
    renderRedirect() {
        if (this.state.redirect) {
            const path = "/users/" + this.props.user._id;
            return (<Redirect path="/login" to={path} />);
        }
        return (<></>);
    }

    render() {
        return (
            <>
            <form name="login" onSubmit={this.logInSubmit}>
            {this.renderRedirect()}
                <label htmlFor="login_name">
                    Login Name: <input type="text" name="login_name" id="login_name" value={this.state.login_name} onChange={this.handleChange} />
                </label>
                <label htmlFor="password">
                    Password: <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Log Me In!" />
            </form>

            <Divider />
            {this.renderError()}
            <Divider />

            <form name="register" onSubmit={this.registerSubmit}>
                <label htmlFor="register_name">
                    Login Name: <input type="text" name="register_name" id="register_name" value={this.state.register_name} onChange={this.handleChange} />
                </label>
                <label htmlFor="password1">
                    Password: <input type="password" name="password1" id="password1" value={this.state.password1} onChange={this.handleChange} />
                </label>
                <label htmlFor="password2">
                    Confirm Password: <input type="password" name="password2" id="password2" value={this.state.password2} onChange={this.handleChange} />
                </label>
                <label htmlFor="first_name">
                    First Name: <input type="text" name="first_name" id="first_name" value={this.state.first_name} onChange={this.handleChange} />
                </label>
                <label htmlFor="last_name">
                    Last Name: <input type="text" name="last_name" id="last_name" value={this.state.last_name} onChange={this.handleChange} />
                </label>
                <label htmlFor="location">
                    Location: <input type="text" name="location" id="location" value={this.state.location} onChange={this.handleChange} />
                </label>
                <label htmlFor="occupation">
                    Occupation: <input type="text" name="occupation" id="occupation" value={this.state.occupation} onChange={this.handleChange} />
                </label>
                <label htmlFor="description">
                    Description: <input type="text" name="description" id="description" value={this.state.description} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Register Me!" />
            </form>
            </>
        );
    }
}

export default LoginRegister;
