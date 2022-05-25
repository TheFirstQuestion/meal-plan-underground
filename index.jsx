import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './styles/main.css';

import GlobalHeader from './components/navigation/GlobalHeader';
import GlobalFooter from './components/navigation/GlobalFooter';
import IcebreakerPage from './components/pages/IcebreakerPage';
import MapPage from './components/pages/MapPage';
import PairingsPage from './components/pages/PairingsPage';
import ProfileEditPage from './components/pages/ProfileEditPage';
import ProfilePage from './components/pages/ProfilePage';
import HomePage from './components/pages/HomePage';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        context: "",
        user: null,
        DINING_HALLS: [{}],
        matched: null,
    };
    this.setContext = this.setContext.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setDiningHalls = this.setDiningHalls.bind(this);
    this.setMatchedUser = this.setMatchedUser.bind(this);
  }

  setUser(u) {
      this.setState({user: u});
  }

  setContext(val) {
      this.setState({context: val});
  }

  setDiningHalls(val) {
      this.setState({DINING_HALLS: val});
  }

  setMatchedUser(val) {
    this.setState({matched: val});
  }

  render() {
    return (
      <HashRouter>
        <GlobalHeader
            context={this.state.context}
        />
        <Switch>
            {
                this.state.user ? (
                    <Route
                        path="/map"
                        render={props => <MapPage {...props}
                            setContext={this.setContext}
                            user={this.state.user}
                            DINING_HALLS={this.state.DINING_HALLS}
                            setMatched={this.setMatchedUser}
                         />}
                    />
                ):
                    <Redirect path="/map" to="/login" />
            }

            {
                this.state.user ? (
                    <Route
                        path="/pairings"
                        render={props => <PairingsPage {...props}
                            DINING_HALLS={this.state.DINING_HALLS}
                            user={this.state.user}
                            setContext={this.setContext}
                        />}
                    />
                ):
                    <Redirect path="/map" to="/login" />
            }

            {
                this.state.user ? (
                    <Route
                        path="/profile/edit"
                        render={props => <ProfileEditPage {...props}
                            setContext={this.setContext}
                        />}
                    />
                ):
                    <Redirect path="/map" to="/login" />
            }

            {
                this.state.user ? (
                    <Route
                      path="/profile"
                      render={props => <ProfilePage
                          {...props}
                          setContext={this.setContext}
                          user={this.state.user}
                      />}
                    />
                ):
                    <Redirect path="/profile" to="/login" />
            }

            {
                this.state.user ? (
                    <Route
                      path="/icebreaker"
                      render={props => <IcebreakerPage {...props}
                      setContext={this.setContext}
                      user={this.state.user}
                      matched={this.state.matched} />}
                    />
                ):
                    <Redirect path="/icebreaker" to="/login" />
            }

            {
                this.state.user ? (
                    <Redirect path="/" to="/map" />
                ):
                    <Route
                        path="/"
                        render={props => <HomePage
                            {...props}
                            setContext={this.setContext}
                            setUser={this.setUser}
                            setDiningHalls={this.setDiningHalls}
                        />}
                    />
            }

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
