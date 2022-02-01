import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import jwtDecode from "jwt-decode";

// Redux stuff
import { Provider } from "react-redux";
import store from "./redux/store";
import { userActionTypes } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Components
import AuthRoute from "./components/AuthRoute";
import Navbar from "./components/navbar";
import SideBar from "./components/SideBar";

// Pages
import home from "./pages/home";
import signin from "./pages/signin";
import signup from "./pages/signup";
import doctors from "./pages/doctors";
import doctor from "./pages/doctor";
// import profile from "./pages/profile";
// import account from "./pages/account";
// import dashboard from "./pages/dashboard";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
axios.defaults.baseURL =
  "https://us-central1-wona-39cfa.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  // Check for token expiration
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser("expired"));
    window.location.href = "/signin";
  } else {
    store.dispatch({ type: userActionTypes.SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

library.add(fas);

class App extends Component {
  render() {
    const {
      user: { credentials, authenticated },
    } = store.getState();

    console.log(authenticated);

    return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <div
            className={
              authenticated ? "container-fluid p-0" : "container" + " p-0"
            }
          >
            <div class="row m-0">
              {authenticated && (
                <div class="col-lg-1 mt-3 mt-lg-0 p-lg-0 d-flex align-items-stretch">
                  <SideBar />
                </div>
              )}
              <div className={authenticated ? "col-lg-11" : "col-12" + " mt-4"}>
                <Switch>
                  <Route exact path="/" component={home} />
                  <AuthRoute exact path="/signin" component={signin} />
                  <AuthRoute exact path="/signup" component={signup} />
                  <Route path="/doctors" component={doctors} />
                  <Route path="/doctor/:id" component={doctor} />
                  {/*
                    <Route exact path="/profile" component={profile} />
                    <Route exact path="/account" component={account} />
                    <Route exact path="/dashboard" component={dashboard} />
                  */}
                </Switch>
              </div>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
