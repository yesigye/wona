import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";
import { isLoading, getErrors } from "../../redux/selectors";
import { doctorActionTypes } from "../../redux/types";
// UI
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
// Utilities
import { isObjectDifferent } from "../../utils/stateFunctions";

class MtnMomoPayButton extends Component {
  state = {
    phone: "",
    lastName: "",
    openModal: false,
    openAlert: false,
    finished: false,
    errors: {},
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (isObjectDifferent(prevProps.errors, this.props.errors)) {
      const { errors } = this.props;
      this.setState({ errors });
      if (Object.keys(errors).length && errors.message) {
        this.setState({ openAlert: true });
      }
    }
  }

  // Event handlers
  toggleModal = () => this.setState({ openModal: !this.state.openModal });
  toggleAlert = () => this.setState({ openAlert: !this.state.openAlert });

  handleCloseAlert = () => this.setState({ finished: false });

  handleTextFeildValueChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    console.log("process payment");
    this.props.onPaid(true);
  };

  render() {
    const { loading } = this.props;
    const { openModal, openAlert, errors, paid } = this.state;

    return (
      <React.Fragment>
        <a
          className="button-huge bg-warning text-dark"
          onClick={this.toggleModal}
        >
          MTN
        </a>
        <Modal show={openModal} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Authorize Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Please ensure you have your phone on you with sufficient balance
              in your account. We'll send you a prompt, please enter your pin to
              authorize payment.
            </p>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. 07729876543"
              onChange={this.handleTextFeildValueChange}
            />
            {openAlert && (
              <Alert variant="danger" onClose={this.toggleAlert} dismissible>
                {errors.message}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button
              type="button"
              className="btn btn-warning"
              onClick={this.handleSubmit}
              color="primary"
              disabled={loading}
            >
              {loading && (
                <Spinner className="center" animation="border" role="status" />
              )}
              Send prompt
            </button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: isLoading(state, doctorActionTypes.SAVE_APPOINTMENT),
  errors: getErrors(state, doctorActionTypes.SAVE_APPOINTMENT),
});

MtnMomoPayButton.propTypes = {
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { editUserDetails })(MtnMomoPayButton);
