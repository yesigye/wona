import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";

// Material UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const styles = (theme) => ({
  ...theme.custom,
  input: {
    margin: theme.spacing(1),
  },
  errorText: {
    color: "#f44336",
    margin: "auto",
  },
  payMtn: {
    ...theme.custom.payBlock,
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#e0a800",
      borderColor: "#d39e00",
      boxShadow: "none",
    },
  },
});

class MtnMomoPayButton extends Component {
  state = {
    phone: "",
    lastName: "",
    open: false,
    finished: false,
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      phone: credentials.phone ? credentials.phone : "",
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
    console.log("process payment");
    this.props.onPaid(true);
  };

  render() {
    const {
      classes,
      user: { loading },
      UI: { alerts },
    } = this.props;

    return (
      <div>
        <Button fullWidth className={classes.payMtn} onClick={this.handleOpen}>
          <Typography variant="body1">MTN</Typography>
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="momo-pay-form"
        >
          <DialogTitle id="momo-pay-form">Authorize Payment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please ensure you have your phone on you with sufficient balance
              in your account. We'll send you a prompt, please enter your pin to
              authorize payment.
            </DialogContentText>
            <TextField
              variant="outlined"
              name="phone"
              autoFocus
              label="MTN Phone Number"
              type="phone"
              defaultValue={this.state.phone}
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
            <Button
              variant="contained"
              onClick={this.handleClose}
              color="default"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={this.handleSubmit}
              color="primary"
              disabled={loading}
            >
              {loading && (
                <CircularProgress className="progress-center" size={20} />
              )}
              Send prompt
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

MtnMomoPayButton.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(MtnMomoPayButton)
);
