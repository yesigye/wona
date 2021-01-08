import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import jwtDecode from "jwt-decode";

// Redux stuff
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Material UI themeing
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import themeConfig from "./utils/theme";

// Components
import AuthRoute from "./components/AuthRoute";
import Navbar from "./components/navbar";

// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import doctors from "./pages/doctors";
import doctor from "./pages/doctor";
import profile from "./pages/profile";
import account from "./pages/account";
import dashboard from "./pages/dashboard";

import axios from "axios";
axios.defaults.baseURL =
  "https://us-central1-wona-39cfa.cloudfunctions.net/api";

const theme = createMuiTheme(themeConfig);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  // Check for token expiration
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser("expired"));
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <Route path="/doctor/:id" component={doctor} />
                <Route path="/doctors" component={doctors} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
                <Route exact path="/profile" component={profile} />
                <Route exact path="/account" component={account} />

                <Route exact path="/dashboard" component={dashboard} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
