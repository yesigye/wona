import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

// Material UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

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

class EditProfileButton extends Component {
  state = {
    firstName: "",
    lastName: "",
    open: false,
    finished: false,
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
  }

  // Event handlers
  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.user.credentials);
  };

  handleClose = () => this.setState({ open: false });

  handleCloseAlert = () => this.setState({ finished: false });

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    const { credentials: oldDetails } = this.props.user;
    const newDetails = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };
    if (
      newDetails.firstName === oldDetails.firstName &&
      newDetails.lastName === oldDetails.lastName
    ) {
      // Nothing has changed.
      return false;
    }

    this.props.editUserDetails(newDetails).then((res) => {
      this.setState({ finished: true });
    });
  };

  render() {
    const {
      classes,
      user: { loading },
      UI: { alerts },
    } = this.props;

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
          </DialogContent>
          {this.state.finished && alerts && (
            <Snackbar
              open={this.state.finished}
              autoHideDuration={3000}
              onClose={this.handleCloseAlert}
              message="hello"
            >
              <Alert variant="filled" severity={alerts.type}>
                {alerts.message}
              </Alert>
            </Snackbar>
          )}
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
  UI: state.UI,
});

EditProfileButton.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditProfileButton)
);
