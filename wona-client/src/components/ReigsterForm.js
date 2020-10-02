import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
// Material UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.custom,
  button: {
    ...theme.custom.button,
    display: "block",
    marginBottom: 20,
  },
});

class RegisterForm extends Component {
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
    console.log(this.props.history);
    event.preventDefault();
    // this.setState({ loading: true });
    // const { email, password, confirmPassword } = this.state;
    // const newUser = { email, password, confirmPassword };
    // this.props.signupUser(newUser, this.props.history);
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
      <form noValidate onSubmit={this.handleSubmit} className={classes.form}>
        <TextField
          fullWidth
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
        <TextField
          fullWidth
          variant="outlined"
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
          fullWidth
          size="large"
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
        <Typography align="right">
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </form>
    );
  }
}

RegisterForm.propTypes = {
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
  withStyles(styles)(RegisterForm)
);
