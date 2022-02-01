import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

AuthRoute.propTypes = {
  user: PropTypes.object.isRequired,
};

export default connect((state) => ({
  user: state.user,
  authenticated: state.user.authenticated,
}))(AuthRoute);
