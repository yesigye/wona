import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import logo from "../assets/images/logo.png";
// Redux stuff
import { connect } from "react-redux";
// Components
import Profile from "./Profile";
// import Toast from "./Toast";

export class Navbar extends Component {
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
        this.props.appointment.hasOwnProperty("status") &&
        this.props.appointment.status === "pending";

      if (isAppointmentPending) {
        const { avatar, handle, department } = this.props.appointment.doctor;
        this.setState({
          ...this.state,
          pendingAppointmentAlert: (
            <div>
              <div className="alert alert-warning alert-top">
                <div container spacing={1}>
                  <div item xs={1}>
                    <img alt={handle} src={avatar} />
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
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className={authenticated ? "container-fluid" : "container"}>
            <a
              className={
                "navbar-brand col-lg-1 " +
                (authenticated && "me-0 text-center text-success")
              }
              href="#"
            >
              <img alt="Brand" src={logo} />
            </a>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarsExample07XL"
              aria-controls="navbarsExample07XL"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="navbar-collapse collapse" id="navbarsExample07XL">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    How it works
                  </a>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctors">
                    Doctors
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctors">
                    Hospitals
                  </NavLink>
                </li>
              </ul>
              <Profile />
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  appointment: state.doctor.appointment,
});

export default connect(mapStateToProps)(withRouter(Navbar));
