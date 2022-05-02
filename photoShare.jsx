import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';
import './styles/main.css';
import axios from 'axios';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/LoginRegister/LoginRegister';
import Favorites from './components/favorites/favorites';


class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        context: "",
        user: null,
    };
    this.setContext = this.setContext.bind(this);
    this.getLoggedInUser = this.getLoggedInUser.bind(this);
    this.setLoggedInUser = this.setLoggedInUser.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  setContext(val) {
      this.setState({context: val});
  }

  setLoggedInUser(data) {
      this.setState({user: data});
  }

  getLoggedInUser() {
      return this.state.user;
  }

  logOut() {
      axios("#/admin/logout").then(() => {
        this.setState({user: undefined});
    }).catch((err) => console.log("didn't log out :/ " + err));
  }

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar context={this.state.context} login_name={this.state.login_name} user={this.state.user} logout={this.logOut} />
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            { this.state.user ? (
                <UserList
                    LOGGED_IN_USER={this.state.user}
                />
            ):
                <></>
            }
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
                {
                    this.state.user ? (
                            <Route path="/users/:userId"
                            render={props => <UserDetail {...props} setContext={this.setContext} />}
                        />
                    ):
                        <Redirect path="/users/:userId" to="/login" />
                }
                {
                    this.state.user ? (
                        <Route path="/photos/:userId"
                          render={props => (
                              <UserPhotos {...props}
                                setContext={this.setContext}
                                user={this.state.user}
                           />
                        )}
                        />
                    ):
                        <Redirect path="/photos/:userId" to="/login" />
                }
                {
                    this.state.user ? (
                        <Route path="/favorites/:userId"
                          render={props => (
                              <Favorites {...props}
                                setContext={this.setContext}
                                user={this.state.user}
                           />
                        )}
                        />
                    ):
                        <Redirect path="/favorites/:userId" to="/login" />
                }
                <Route path="/login"
                    render={props => (
                        <LoginRegister {...props}
                            setLoggedInUser={this.setLoggedInUser}
                            user={this.state.user}
                            setContext={this.setContext}
                        />
                    )}
                />

            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
