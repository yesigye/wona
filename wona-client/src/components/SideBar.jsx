import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
// Redux stuff
import { connect } from "react-redux";
// Components
import Profile from "./Profile";
// import Toast from "./Toast";

export class SideBar extends Component {
  state = { pendingAppointmentAlert: "" };

  handleRedirect = () => {
    window.location.href = this.props.appointment.redirect;
  };

  componentDidUpdate(prevProps) {
    const isUrlChanged =
      this.props.location.pathname !== prevProps.location.pathname;
    const isPageExempt =
      this.props.location.pathname.split("/")[1] === "doctor" ||
      this.props.location.pathname.split("/")[1] === "login" ||
      this.props.location.pathname.split("/")[1] === "signup";

    if (isUrlChanged && isPageExempt && this.state.pendingAppointmentAlert) {
      this.setState({ ...this.state, pendingAppointmentAlert: "" });
    }

    if (isUrlChanged && !isPageExempt) {
      const isAppointmentPending =
        this.props.appointment &&
        this.props.appointment.hasOwnProperty("status") &&
        this.props.appointment.status === "pending";

      if (isAppointmentPending) {
        const { avatar, handle, department } = this.props.appointment.doctor;
        this.setState({
          ...this.state,
          pendingAppointmentAlert: (
            <div className={this.props.classes.alert}>
              <div className="alert alert-warning alert-top">
                <div container spacing={1}>
                  <div item xs={1}>
                    <img
                      alt={handle}
                      src={avatar}
                      className={this.props.classes.alertImg}
                    />
                  </div>
                  <div item xs={10}>
                    You have not completed booking an appointment with
                    <br />
                    {handle}, {department}
                    <br />
                    <button
                      className="btn btn-secondary"
                      onClick={this.handleRedirect}
                    >
                      complete now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ),
        });
      }
    }
  }

  render() {
    const {
      user: { credentials, authenticated },
    } = this.props;

    return (
      <React.Fragment>
        <div
          class="
            w-100
            h-100
            bg-white
            p-0
            shadow-sm
            d-flex
            justify-content-center
            align-items-baseline
          "
        >
          <div class="d-lg-grid gap-2 d-block w-100 p-1">
            <button
              type="button"
              style={{ fontSize: "inherit" }}
              class="btn btn-outline-secondary border-0 my-2"
            >
              <span class="material-icons fs-2 d-block">dashboard</span>
              Dashboard
            </button>
            <button
              type="button"
              style={{ fontSize: "inherit" }}
              class="btn btn-outline-secondary border-0 my-2"
            >
              <span class="material-icons fs-2 d-block">people</span>
              Patients
            </button>
            <button
              type="button"
              style={{ fontSize: "inherit" }}
              class="btn btn-outline-secondary border-0 my-2"
            >
              <span class="material-icons fs-2 d-block">event_note</span>
              Schedule
            </button>
            <button
              type="button"
              style={{ fontSize: "inherit" }}
              class="btn btn-outline-secondary border-0 my-2"
            >
              <span class="material-icons fs-2 d-block">payments</span>
              Payments
            </button>
            <button
              type="button"
              style={{ fontSize: "inherit" }}
              class="btn btn-outline-secondary border-0 my-2"
            >
              <span class="material-icons fs-2 d-block">schedule</span>
              Appointments
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withRouter(SideBar));
