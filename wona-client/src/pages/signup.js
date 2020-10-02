import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
import Applogo from "../images/logo.png";
// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";

const styles = (theme) => ({ ...theme.custom });

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
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
    const { email, password, confirmPassword } = this.state;
    const newUser = { email, password, confirmPassword };
    this.props.signupUser(newUser, this.props.history);
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
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={Applogo} className={classes.logo} alt="logo" />
          <Typography variant="h4">Signup</Typography>
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
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={Boolean(errors.confirmPassword)}
            />
            {errors.message && (
              <Typography variant="body2" className={classes.loginErrorText}>
                {errors.message}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress size={20} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Already have an account? <Link to="/login">Login here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

Signup.propTypes = {
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
  withStyles(styles)(Signup)
);
