import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import './styles/main.css';

import AuthRedirect from './components/auth/AuthRedirect';
import GlobalHeader from './components/navigation/GlobalHeader';
import GlobalFooter from './components/navigation/GlobalFooter';
import IcebreakerPage from './components/pages/IcebreakerPage';
import MapPage from './components/pages/MapPage';
import PairingsPage from './components/pages/PairingsPage';
import ProfileEditPage from './components/pages/ProfileEditPage';
import ProfilePage from './components/pages/ProfilePage';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        context: "",
        user: null,
    };
    this.setContext = this.setContext.bind(this);

    // Log in as the default donor
    axios.get("/login/donor").then((response) => {
        console.log(response.data);
        this.setState({user: response.data});
    }).catch((err) => {
        console.log(err);
    });
  }

  setContext(val) {
      this.setState({context: val});
  }

  render() {
    return (
      <HashRouter>
        <GlobalHeader
            context={this.state.context}
        />
        <Switch>
            <Route
              path="/map"
              render={props => <MapPage {...props}
              setContext={this.setContext} />}
            />
            <Route
              path="/pairings"
              render={props => <PairingsPage {...props}
              setContext={this.setContext} />}
            />
            <Route
              path="/profile/edit"
              render={props => <ProfileEditPage {...props}
              setContext={this.setContext} />}
            />
            <Route
              path="/profile"
              render={props => <ProfilePage
                  {...props}
                  setContext={this.setContext}
                  user={this.state.user}
              />}

            />
            <Route
              path="/icebreaker"
              render={props => <IcebreakerPage {...props}
              setContext={this.setContext} />}
            />
            <Route
              path="/"
              render={props => <AuthRedirect {...props}
              setContext={this.setContext} />}
            />
        </Switch>
        <GlobalFooter />
      </HashRouter>
    );
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('meal-plan-underground-app'),
);
