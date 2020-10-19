import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from '@material-ui/lab/Alert';

// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

// Utility functions
import { getParams } from "../utils/urls";

const styles = (theme) => ({
  ...theme.custom,
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url("/images/appointment.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
    theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(6, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  // Localize Redux state errors
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) this.setState({ errors: nextProps.UI.errors });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const urlParams = getParams(
      this.props.location.pathname + this.props.location.search
    );
    this.props.loginUser({ email, password }, this.props.history, urlParams.to);
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

    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={1} square>
          <div className={classes.paper}>
            <span className="logo"></span>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email Address"
                variant="outlined"
                value={this.state.email}
                onChange={this.handleChange}
                className={classes.textField}
                helperText={errors.email}
                error={Boolean(errors.email)}
                required
                fullWidth
                autoFocus
                />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                value={this.state.password}
                onChange={this.handleChange}
                className={classes.textField}
                helperText={errors.password}
                error={Boolean(errors.password)}
                fullWidth
                required
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {errors.message && (
                <Alert severity="error">{errors.message}</Alert>
              )}
              {errors.login && (
                <Typography variant="body2" className={classes.loginErrorText}>
                  {errors.login}
                </Typography>
              )}
              <Button
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
                fullWidth
              >
                Sign in
                {loading && (
                  <CircularProgress size={20} className={classes.circularProgress} />
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <MLink href="#" variant="body2">
                    Forgot password?
                  </MLink>
                </Grid>
                <Grid item>
                  <MLink href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </MLink>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: propTypes.object.isRequired,
  loginUser: propTypes.func.isRequired,
  user: propTypes.object.isRequired,
  UI: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Login));
