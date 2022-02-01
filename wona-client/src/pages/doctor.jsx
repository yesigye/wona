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
import Booker from "../components/Booker";
// Utility functions
import { getParams } from "../utils/urls";

/**
 * Doctor's view page
 *
 * @version 1.0.1
 * @author [ignatius yesigye](https://github.com/yesigye)
 */
export class doctor extends Component {
  constructor() {
    super();
    this.state = {
      doctor: {},
      expanded: "panel1",
      bookingDate: "",
      client: {},
      isUserSignedIn: false,
    };
    dayjs.extend(relativeTime);
  }

  componentDidMount() {
    // const { doctors, doctor } = this.props.data;
    const { id } = this.props.match.params;
    const { doctor, user } = this.props;
    const { date } = getParams(this.props.location.search);

    if (Object.keys(doctor).length > 0 && id === doctor.doctorId) {
      // Doctor already in redux state.
      this.setState({ doctor: doctor });
    } else {
      this.props.getDoctor(id);
    }

    this.props.setAppointment({
      redirect: this.props.location.pathname + this.props.location.search,
    });

    if (date) {
      this.props.setAppointment({ date, status: "pending" });
      this.setState({ bookingDate: date, expanded: "panelUser" });
    }
    if (user.authenticated && user.credentials) {
      this.setState({
        client: this.formatBookUser(user.credentials),
        isUserSignedIn: user.authenticated,
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
  };

  /**
   * Handles changes between accordion panel changes
   * @param {string} panel accordion panel to expand
   */
  handlePanelChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  render() {
    const { bookingDate, isUserSignedIn, client } = this.state;
    const { loading, user, doctor } = this.props;
    const redirect = `${this.props.location.pathname}${this.props.location.search}`;

    return (
      <div className="row mt-2">
        <div className="col-sm-12 col-md-7">
          <div className="card card-body border-0 shadow mt-2">
            <h5 className="pb-4 mb-4 border-bottom">Experience</h5>
            <p>{doctor?.bio}</p>
            <p>
              <span className="material-icons">smile</span>
              Specializes In
            </p>
            <ul>
              <p className="text-muted">
                {doctor.specialities?.map((speciality, i) => (
                  <li key={i}>{speciality}</li>
                ))}
              </p>
            </ul>
            <p variant="body1">
              <span className="material-icons">smile</span>
              Diseases Treated
            </p>
            <ul>
              <p className="text-muted">
                {doctor.diseases?.map((disease, i) => (
                  <li key={i}>{disease}</li>
                ))}
              </p>
            </ul>
            <p variant="body1">
              <span className="material-icons">smile</span>
              Training
            </p>
            <ul>
              <p className="text-muted">
                {doctor.qualifications?.map((qualification, i) => (
                  <li key={i}>
                    {qualification.honor} at {qualification.institute},{" "}
                    {qualification.year}
                  </li>
                ))}
              </p>
            </ul>
          </div>

          <div className="card card-body border-0 shadow mt-3">
            <div className="d-flex justify-content-between mb-3">
              <h5>All Ratings and Reviews</h5>
              <button className="btn btn-light text-primary">Top Rated</button>
            </div>
            <ul class="list-group list-group-flush">
              {[0, 1, 2, 3].map((item, i) => (
                <li class="list-group-item d-flex py-3" key={i}>
                  <img
                    alt=""
                    src="/images/user.png"
                    className="me-3 rounded-circle img-fluid bg-light"
                    style={{ width: 35, height: 35 }}
                  />
                  <div class="d-flex flex-column">
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <h6 class="mb-1 font-weight-bold">Trump</h6>
                        <span className="small text-muted">
                          Tue, 20 Mar 2020
                        </span>
                      </div>
                      <span>
                        <FontAwesomeIcon
                          icon={["fas", "star"]}
                          className="text-warning"
                        />
                        <FontAwesomeIcon
                          icon={["fas", "star"]}
                          className="text-warning"
                        />
                        <FontAwesomeIcon
                          icon={["fas", "star"]}
                          className="text-warning"
                        />
                      </span>
                    </div>
                    <p class="mb-0 text-muted">
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classNameical
                      Latin literature from 45 BC, making it over 2000 years
                      old.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card border-0 shadow mt-2">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title">Leave a rating</h5>
            </div>
            <form className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <label htmlFor="rate">Assign a Rating</label>
                <div className="btn-group" role="group">
                  {[0, 1, 2, 3].map((item, i) => (
                    <React.Fragment>
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={`btncheck${i}`}
                        autocomplete="off"
                      />
                      <label
                        className="btn btn-outline-warning"
                        for={`btncheck${i}`}
                      >
                        <FontAwesomeIcon icon={["fas", "star"]} />
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <label htmlFor="review">Your comment</label>
              <textarea rows="5" className="form-control my-2"></textarea>
              <button className="btn d-block w-100 btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        </div>
        <div className="col-sm-12 col-md-5">
          <div className="sticky-top pt-2">
            <Booker
              doctorID={this.props.match.params}
              location={this.props.location}
              history={this.props.history}
            />
          </div>
        </div>
      </div>
    );
  }
}

doctor.propTypes = {
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
})(doctor);
