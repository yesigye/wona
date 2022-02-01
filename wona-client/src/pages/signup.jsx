import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
// React Bootstrap
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
// Components
import SignupForm from "../components/SignupForm";

function Copyright() {
  return (
    <p className="text-muted" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </p>
  );
}

class Signup extends Component {
  render() {
    return (
      <CardGroup className="row">
        <Card className="col-md-7 border-0 rounded-0 pl-md-0">
          <div className="card-body bg-dark text-white">
            <div className="row">
              <div className="col-3">
                <img
                  src="/images/appointment.svg"
                  style={{ width: "100%" }}
                  alt=""
                />
              </div>
              <div className="col-7">
                <h5>Book Appointments</h5>
                <p className="text-white-50">
                  Creating an account will give you access to the booking
                  system. Choose a date and time that suits both you and your
                  doctor, an appointment will be automatically added to the
                  doctor's calendar and they will be notified immediately.
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-7">
                <h5>Doctors</h5>
                <p className="text-white-50">
                  Get anytime access to credible and professional physicians. No
                  more waiting around, meet the best healthcare providers from
                  the comfort of your location. Contact them about your
                  challenges and have them diagnose and prescribe treatment.
                </p>
              </div>
              <div className="col-3">
                <img src="/images/doc.svg" style={{ width: "100%" }} alt="" />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <img src="/images/data.svg" style={{ width: "100%" }} alt="" />
              </div>
              <div className="col-7">
                <h5>Stay Informed</h5>
                <p className="text-white-50">
                  Be the first to know and be Informed of events and new
                  developments. We shall notify you of any updates through your
                  email address or directly through your accounts page.
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-md-5 border-0 rounded-0 h-100">
          <Card.Body className="py-md-5 px-3 px-md-0">
            <div className="mt-md-5"></div>
            <div className="mt-md-5"></div>
            <div className="mt-md-5"></div>
            <h3 className="mb-4 my-md-5 text-center">Sign Up for free</h3>
            <SignupForm />
            <p>
              <Copyright />
            </p>
          </Card.Body>
        </Card>
      </CardGroup>
    );
  }
}

export default Signup;
