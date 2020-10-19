import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
// Material UI
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
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

  // Localize Redux state errors
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) this.setState({ errors: nextProps.UI.errors });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password, firstName, lastName } = this.state;
    const newUser = { email, password, firstName, lastName };
    this.props.signupUser(newUser, this.props.history, this.props.redirect);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;

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
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
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
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
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
          helperText={errors.email}
          error={Boolean(errors.email)}
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
          helperText={errors.password}
          error={Boolean(errors.password)}
        />
        {errors.message && (
          <Typography variant="body2" className={classes.loginErrorText}>
            {errors.message}
          </Typography>
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
              {"Don't have an account? Sign Up"}
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
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { signupUser })(
  withStyles(styles)(SignupForm)
);