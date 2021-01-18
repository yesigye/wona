import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
// Redux stuff
import { connect } from "react-redux";
import {
  saveUserData,
  signupUser,
  getLoginErrors,
  isLoggingIn
} from "../redux/actions/userActions";
// Material UI
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// components
import Toast from "./Toast";
// Utility functions
import { getParams } from "../utils/urls";

const styles = (theme) => ({
  ...theme.custom,
  button: {
    ...theme.custom.button,
    display: "block",
    marginBottom: 20,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
});

class SignupForm extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      errors: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const oldErrors = prevProps.getLoginErrors(prevProps);
    const newErrors = this.props.getLoginErrors(this.props);
    let errorsChanged = (typeof oldErrors !== typeof newErrors);
    const oldUserData = prevProps.user.credentials;
    const newUserData = this.props.user.credentials;
    let userDataChanged = (oldUserData.length !== newUserData.length);

    if(typeof newErrors === "object" && typeof oldErrors === "object") {
      // Check for changes in error object properties
      for (const i in {...oldErrors, ...newErrors}) {
        const propsAdded = !oldErrors.hasOwnProperty(i);
        const propsRemoved = !newErrors.hasOwnProperty(i);
        const propValueChanged = (oldErrors.hasOwnProperty(i) && oldErrors[i] !== newErrors[i]);

        if(propValueChanged || propsAdded || propsRemoved) {
          errorsChanged = true;
        }
      }
    }
    if(errorsChanged) this.setState({ errors: newErrors });

    // Check for changes in error object properties
    if(!userDataChanged) {
      for (const i in newUserData) {
        if(
          !oldUserData.hasOwnProperty(i) ||
          (oldUserData.hasOwnProperty(i) && oldUserData[i] !== newUserData[i])
        ) {
          userDataChanged = true;
        }
      }
    }
    if (userDataChanged) {
      this.setState({ ...this.state, ...newUserData })
    }
    
    if(prevState.loading !== this.props.isLoggingIn()) {
      this.setState({ loading: this.props.isLoggingIn() })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password, firstName, lastName } = this.state;
    const newUser = { email, password, firstName, lastName };
    this.props.signupUser(newUser, this.props.history, this.props.redirect);
  };
  
  handleChange = (event) => {
    this.props.saveUserData({
      ...this.props.user.credentials,
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;

    const redirect = this.props.redirect === undefined ?
                    '/login' :
                    "/login?to=" + encodeURIComponent(this.props.redirect);

    return (
      <form noValidate onSubmit={this.handleSubmit} className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              autoComplete="firstName"
              className={classes.textField}
              onChange={this.handleChange}
              value={this.state.firstName}
              error={Boolean(errors?.firstName)}
              helperText={errors?.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              className={classes.textField}
              onChange={this.handleChange}
              value={this.state.lastName}
              error={Boolean(errors?.lastName)}
              helperText={errors?.lastName}
            />
          </Grid>
        </Grid>
        <TextField
          fullWidth
          required
          variant="outlined"
          id="email"
          name="email"
          type="email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange}
          className={classes.textField}
          helperText={errors?.email}
          error={Boolean(errors?.email)}
        />
        <TextField
          fullWidth
          required
          variant="outlined"
          id="password"
          name="password"
          type="password"
          label="Password"
          value={this.state.password}
          onChange={this.handleChange}
          className={classes.textField}
          helperText={errors?.password}
          error={Boolean(errors?.password)}
        />
        {errors?.message && (
          <Toast severity="error" message={errors?.message} />
        )}
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={loading}
        >
          Sign up
          {loading && (
            <CircularProgress size={20} className={classes.circularProgress} />
          )}
        </Button>
        <Grid container>
          <Grid item xs>
          </Grid>
          <Grid item>
            <Link href={redirect} variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
      </form>
    );
  }
}

SignupForm.propTypes = {
  classes: propTypes.object.isRequired,
  user: propTypes.object.isRequired,
  UI: propTypes.object.isRequired,
  signupUser: propTypes.func.isRequired,
  saveUserData: propTypes.func.isRequired,
  getLoginErrors: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, {
  saveUserData,
  signupUser,
  getLoginErrors,
  isLoggingIn
})(
  withStyles(styles)(SignupForm)
);
