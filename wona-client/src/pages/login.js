import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
import Applogo from "../images/logo.png";
import Link from "react-router-dom/Link";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const styles = (theme) => ({ ...theme.custom });

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
    this.props.loginUser({ email, password }, this.props.history);
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
    console.log(this.props.UI);
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={Applogo} className={classes.logo} alt="logo" />
          <Typography variant="h4">Login</Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              fullWidth
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
            {errors.login && (
              <Typography variant="body2" className={classes.loginErrorText}>
                {errors.login}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress size={20} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Don't have an account? <Link to="/signup">Signup here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
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
