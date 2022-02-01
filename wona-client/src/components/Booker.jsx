import React, { Component } from "react";
import propTypes from "prop-types";
// Day Js
import dayjs, { unix } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// Redux
import { connect } from "react-redux";
import {
  getDoctor,
  setAppointment,
  saveAppointment,
} from "../redux/actions/doctorActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Components
import Slots from "../components/Slots";
import SignupForm from "../components/SignupForm";
import MtnMomoButton from "../components/payment/mtnMomoButton";
// import CreditCardButton from "../components/payment/card/creditCardButton";
// Utility functions
import { getParams } from "../utils/urls";

/**
 * Doctor's view page
 *
 * @version 1.0.1
 * @author [ignatius yesigye](https://github.com/yesigye)
 */
export class Booker extends Component {
  constructor() {
    super();
    this.state = {
      doctor: {},
      expanded: "panel1",
      bookingDate: "",
      client: {},
      isUserSignedIn: false,
      currentStep: 1,
      errorDate: "",
    };
    dayjs.extend(relativeTime);
  }

  componentDidMount() {
    const { doctor, user } = this.props;
    const { date } = getParams(window.location.search);

    if (
      Object.keys(doctor).length > 0 &&
      this.props.doctorID === doctor.doctorId
    ) {
      // Doctor already in redux state.
      this.setState({ doctor: doctor });
    } else {
      this.props.getDoctor(this.props.doctorID);
    }

    this.props.setAppointment({
      redirect: window.location.pathname + window.location.search,
    });

    if (date) {
      this.props.setAppointment({ date, status: "pending" });
      this.setState({
        bookingDate: date,
        expanded: "panelUser",
        currentStep: 2,
      });
    }
    if (date && user.authenticated && user.credentials) {
      this.setState({
        client: this.formatBookUser(user.credentials),
        isUserSignedIn: user.authenticated,
        currentStep: 3,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isUserUpdated =
      !prevProps.appointment.hasOwnProperty("user") &&
      this.props.user.authenticated &&
      Object.keys(prevProps.user.credentials).length !==
        Object.keys(this.props.user.credentials).length;
    const isBookingDateUpdated =
      (!prevProps.appointment.hasOwnProperty("date") &&
        this.props.appointment.date) ||
      (prevProps.appointment.hasOwnProperty("date") &&
        prevProps.appointment.date !== this.props.appointment.date);
    const isDoctorUpdated =
      Object.keys(prevProps.doctor).length !==
      Object.keys(this.props.doctor).length;

    if (isDoctorUpdated) {
      this.props.setAppointment({
        doctorID: this.props.doctor.doctorId,
        doctor: {
          avatar: this.props.doctor.avatar,
          handle:
            this.props.doctor.firstName + " " + this.props.doctor.lastName,
          department: this.props.doctor.department,
        },
        location: this.props.doctor.location,
      });
    }

    // console.info(Object.keys(this.props.user.credentials).length < 0);
    if (isUserUpdated) {
      const user = this.formatBookUser(this.props.user.credentials);
      this.setState({
        isUserSignedIn: true,
        client: user,
      });
      this.props.setAppointment({ user });
    }

    if (isBookingDateUpdated) {
      this.setState({
        ...this.state,
        bookingDate: this.props.appointment.date,
      });
    }
  }

  formatBookUser = (credentials) => {
    if (!credentials.firstName || !credentials.firstName) return {};

    return {
      avatar: credentials.avatar,
      handle: credentials.firstName + " " + credentials.lastName,
    };
  };

  formatDate = (date) => {
    return date ? dayjs.unix(date).format("h:mma dddd, MMM D") : "";
  };

  /**
   * Handles completion of appointment payment
   * @param {string} isPaid whether paid was made or not
   */
  handlePayment = (isPaid) => {
    if (!isPaid) {
      return null;
    }

    this.props.setAppointment({
      status: "completed",
      payment: {
        amount: "30 UGX",
        method: "Mobile Money",
        provider: "MTN",
      },
    });
    this.props.saveAppointment(this.props.appointment);
  };

  /**
   * Handles change in appointment date
   * @param {string} date booked date
   */
  handleDateChange = (date) => {
    const unixDate = dayjs(date).unix();
    this.props.setAppointment({ date: unixDate, status: "pending" });
    this.props.history.push("?date=" + unixDate);
    this.setState({ errorDate: "" });
  };

  /**
   * Handles step changes
   * @param {number} step step in booking proccess to traverse to
   * @param {object} event click event object
   */
  toggleStep = (step, event) => {
    event.preventDefault();

    if (!this.state.bookingDate && (step == 2 || step == 3)) {
      // First book a date before traversing steps.
      this.setState({ errorDate: "Pick a date to continue" });
      return false;
    }
    this.setState({
      currentStep: step,
    });
  };

  render() {
    const { bookingDate, isUserSignedIn, client, currentStep, errorDate } =
      this.state;
    const { loading, user, doctor } = this.props;
    const redirect = `${this.props.location.pathname}${this.props.location.search}`;
    console.log(doctor);

    return (
      <div className="card border-0 shadow">
        <div className="card-header bg-white py-4">
          Book Doctor
          <div class="d-flex">
            <img
              alt=""
              src="/images/user.png"
              className="me-3 rounded-circle img-fluid bg-light"
              style={{ width: 35, height: 35 }}
            />
            <div class="d-flex flex-column">
              <h6 class="mb-1 font-weight-bold">
                Dr. {doctor.firstName} {doctor.lastName}, {doctor.department}
              </h6>
              <p class="mb-0 small text-muted">
                <FontAwesomeIcon
                  icon={["fas", "map-marker"]}
                  className="me-2 text-muted"
                />
                <span className="text-uppercase">
                  {doctor.location?.address}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div class="steps-form my-3 border-bottom">
            <ul
              class="nav steps-row setup-panel"
              id="docBookSteps"
              role="tablist"
            >
              <li class="steps-step" role="presentation">
                <button
                  className={
                    "btn btn-light btn-circle " +
                    (currentStep === 1 && "active")
                  }
                  onClick={(e) => this.toggleStep(1, e)}
                >
                  1
                </button>
                <p>Pick Date</p>
              </li>
              <li class="steps-step" role="presentation">
                <button
                  className={
                    "btn btn-light btn-circle " +
                    (currentStep === 2 && "active")
                  }
                  onClick={(e) => this.toggleStep(2, e)}
                >
                  2
                </button>
                <p>My Details</p>
              </li>
              <li class="steps-step" role="presentation">
                <button
                  className={
                    "btn btn-light btn-circle " +
                    (currentStep === 3 && "active")
                  }
                  onClick={(e) => this.toggleStep(3, e)}
                >
                  3
                </button>
                <p>Payment</p>
              </li>
            </ul>
          </div>

          <div class="tab-content" id="myTabContent">
            <div
              class={"tab-pane fade" + (currentStep === 1 && " show active")}
              id="bookDoc-date-tab"
              role="tabpanel"
            >
              {errorDate && (
                <div className="alert alert-danger">{errorDate}</div>
              )}
              <Slots
                doctor={doctor}
                Component="Backdrop"
                open={true}
                selectedDate={this.state.bookingDate}
                handleBooking={this.handleDateChange.bind(this)}
              />
              <button
                type="button"
                className={
                  "btn btn-primary w-100 mt-2" +
                  (this.state.bookingDate && " disabled")
                }
                onClick={(e) => this.toggleStep(2, e)}
              >
                Continue
              </button>
            </div>
            <div
              class={"tab-pane fade" + (currentStep === 2 && " show active")}
              id="bookDoc-profile-tab"
              role="tabpanel"
            >
              {!isUserSignedIn && !user.loading ? (
                <React.Fragment>
                  <h5 className="text-center mb-3">Sign up to Continue</h5>
                  <SignupForm redirect={redirect} />
                </React.Fragment>
              ) : (
                <div className="text-center">
                  <img
                    src={client.avatar}
                    className="d-inline-block rounded-circle mb-2"
                    style={{ width: 50, height: 50 }}
                  />
                  <div>{client.handle}</div>
                  <span className="text-muted">{user.credentials.email}</span>
                </div>
              )}
            </div>
            <div
              class={"tab-pane fade" + (currentStep === 3 && " show active")}
              id="bookDoc-pay-tab"
              role="tabpanel"
            >
              <div className="d-flex justify-content-between">
                <p className="text-muted">Select payment option</p>
                <h5 className="text-primary fw-bold mb-3">
                  USD{" "}
                  {"20".toLocaleString("en-us", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h5>
              </div>
              <div className="row">
                <div className="col">
                  <MtnMomoButton
                    loading={loading}
                    phone={doctor.phone}
                    onPaid={this.handlePayment.bind(this)}
                  />
                </div>
                <div className="col">
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="button-huge bg-danger"
                  >
                    AIRTEL
                  </a>
                </div>
                <div className="col">
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="button-huge bg-secondary"
                  >
                    CARD
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Booker.propTypes = {
  UI: propTypes.object.isRequired,
  getDoctor: propTypes.func.isRequired,
  setAppointment: propTypes.func.isRequired,
  saveAppointment: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  user: state.user,
  doctor: state.doctor.data,
  appointment: state.doctor.appointment,
  loading: state.doctor.loading,
  errors: state.doctor.errors,
});

export default connect(mapStateToProps, {
  getDoctor,
  setAppointment,
  saveAppointment,
})(Booker);
