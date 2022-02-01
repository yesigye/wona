import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";
// Redux
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/userActions";
import { getErrors } from "../redux/selectors";
import { userActionTypes } from "../redux/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// React Bootstrap
import NavDropdown from "react-bootstrap/NavDropdown";
// Components
// import EditProfileButton from "./EditProfileButton";
// import CustomButton from "../components/CustomButton";

export class Profile extends Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => this.setState({ anchorEl: null });

  handleSignout = () => {
    this.handleClose();
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      errors,
      user: { credentials, authenticated },
    } = this.props;

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        {authenticated ? (
          <React.Fragment>
            <NavDropdown
              title={
                <React.Fragment>
                  <div className="position-relative">
                    <FontAwesomeIcon
                      icon={["fas", "bell"]}
                      className="me-2 text-muted fs-5"
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white">
                      9 <span className="visually-hidden">unread messages</span>
                    </span>
                  </div>
                </React.Fragment>
              }
              id="basic-nav-dropdown"
              className=""
            >
              <NavDropdown.Item href="#">
                <span className="material-icons pad">notifications</span>{" "}
                blahhhhhhhhhhhhhhhhhhhhh
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#" className="text-center text-danger">
                clear notifications
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              className="user-item"
              title={
                <React.Fragment>
                  {Object.keys(credentials).length ? (
                    <div className="d-flex">
                      <img
                        src={credentials?.avatar}
                        className="drounded-circle me-2 position-relative"
                        style={{ width: 35, height: 35, top: -5 }}
                        width="35"
                      />
                      {credentials?.firstName + " " + credentials?.lastName}
                    </div>
                  ) : (
                    <span
                      className="skeleton skeleton-text"
                      style={{ width: 120 }}
                    ></span>
                  )}
                </React.Fragment>
              }
            >
              <NavDropdown.Item href="#">
                <i className="fa fa-user mr-2"></i> Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <i className="fa fa-tachometer-alt mr-2"></i> Dashboard
              </NavDropdown.Item>
              {/* user has role user */}
              <NavDropdown.Item href="#">
                <i className="fa fa-calendar mr-2"></i> Appointments
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#" className="dropdown-item text-danger">
                <i className="fa fa-sign-out-alt text-danger mr-2"></i> Logout
              </NavDropdown.Item>
            </NavDropdown>
            <li className="nav-item ms-md-2">
              <a className="nav-link text-danger" href="#">
                Sign out
              </a>
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <li className="nav-item">
              <NavLink className="nav-link" to="/signin">
                Sign in
              </NavLink>
            </li>
            <li className="nav-item ms-3">
              <a
                className="btn btn-primary"
                href="#"
                onClick={this.handleSignout}
              >
                Sign up
              </a>
            </li>
          </React.Fragment>
        )}
      </ul>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  errors: getErrors(state, userActionTypes.SET_USER),
});

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { logoutUser })(Profile);
