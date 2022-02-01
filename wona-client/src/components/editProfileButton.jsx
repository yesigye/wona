import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";
import { isLoading, getErrors, getNotifications } from "../redux/selectors";
import { userActionTypes } from "../redux/types";
// Material UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
// Components
import Toast from "./Toast";
// Utilities
import { isObjectDifferent } from "../utils/stateFunctions";
import { isDayjs } from "dayjs";

const styles = (theme) => {
  const customTheme = { ...theme.custom };
  customTheme.input = {
    margin: theme.spacing(1),
  };
  customTheme.errorText = {
    color: "#f44336",
    margin: "auto",
  };
  customTheme.progress = {
    position: "absolute",
    width: 20,
    height: 20,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    margin: "auto",
    color: "#fff",
  };

  return customTheme;
};

const initialAlerts = { notifications: "", errors: {} };

class EditProfileButton extends Component {
  state = {
    firstName: "",
    lastName: "",
    open: false,
    ...initialAlerts,
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      firstName: credentials.firstName ? credentials.firstName : "",
      lastName: credentials.lastName ? credentials.lastName : "",
    });
  };

  componentDidMount() {
    const { credentials } = this.props.user;
    this.mapUserDetailsToState(credentials);
    this.setState({ errors: {}, notifications: "" });
  }

  componentDidUpdate(prevProps) {
    if (isObjectDifferent(prevProps.notifications, this.props.notifications)) {
      this.setState({ notifications: this.props.notifications });
    }
    if (isObjectDifferent(prevProps.errors, this.props.errors)) {
      this.setState({ errors: this.props.errors });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.user.credentials);
  };

  handleClose = () => this.setState({ open: false, ...initialAlerts });

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    const { credentials } = this.props.user;
    const newDetails = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };
    if (
      newDetails.firstName === credentials.firstName &&
      newDetails.lastName === credentials.lastName
    ) {
      // Nothing has changed.
      return false;
    }

    this.props.editUserDetails(newDetails).then((res) => {
      console.log("done............ ", res);
    });
  };

  render() {
    const { classes, loading } = this.props;

    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleOpen}>
          Edit Profile
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Personal info</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Basic information about you. This is visible to other people using
              Our services
            </DialogContentText>
            <TextField
              name="firstName"
              autoFocus
              label="First name"
              type="text"
              defaultValue={this.state.firstName}
              onChange={this.handleChange}
              className={classes.input}
              fullWidth
            />
            <TextField
              name="lastName"
              label="Last name"
              type="text"
              defaultValue={this.state.lastName}
              onChange={this.handleChange}
              className={classes.input}
              fullWidth
            />
            {this.state.notifications && (
              <Toast
                placement="top"
                severity="success"
                message={this.state.notifications}
              />
            )}
            {this.state.errors?.message && (
              <Toast severity="error" message={this.state.errors.message} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  loading: isLoading(state, userActionTypes.SET_USER),
  errors: getErrors(state, userActionTypes.SET_USER),
  notifications: getNotifications(state, userActionTypes.SET_USER),
});

EditProfileButton.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditProfileButton)
);
