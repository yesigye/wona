import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import propTypes from "prop-types";
// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
import { isLoading, getErrors } from "../redux/selectors";
import { userActionTypes } from "../redux/types";
// React Bootstrap
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

class SignupForm extends Component {
  state = {
    validated: false,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    errors: {},
  };

  componentDidUpdate(prevProps, prevState) {
    const oldErrors = prevProps.errors;
    const newErrors = this.props.errors;
    let errorsChanged = typeof oldErrors !== typeof newErrors;

    if (typeof newErrors === "object" && typeof oldErrors === "object") {
      // Check for changes in error object properties
      for (const i in { ...oldErrors, ...newErrors }) {
        const propsAdded = !oldErrors.hasOwnProperty(i);
        const propsRemoved = !newErrors.hasOwnProperty(i);
        const propValueChanged =
          oldErrors.hasOwnProperty(i) && oldErrors[i] !== newErrors[i];

        if (propValueChanged || propsAdded || propsRemoved) {
          errorsChanged = true;
        }
      }
    }
    if (errorsChanged) this.setState({ errors: newErrors });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password, firstName, lastName } = this.state;
    const newUser = { email, password, firstName, lastName };
    this.props.signupUser(newUser, this.props.history, this.props.redirect);
  };

  handleTextFeildValueChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { loading } = this.props;
    const { errors, validated } = this.state;

    const redirect =
      this.props.redirect === undefined
        ? "/signin"
        : "/signin?to=" + encodeURIComponent(this.props.redirect);

    return (
      <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-6">
            <Form.Group className="mb-3">
              <Form.Control
                required
                size="lg"
                name="firstName"
                placeholder="First name"
                value={this.state.firstName}
                isInvalid={Boolean(errors?.firstName)}
                onChange={this.handleTextFeildValueChange}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">
                {errors?.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group className="mb-3">
              <Form.Control
                required
                size="lg"
                name="lastName"
                placeholder="Last name"
                value={this.state.lastName}
                isInvalid={Boolean(errors?.lastName)}
                onChange={this.handleTextFeildValueChange}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">
                {errors?.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
        <Form.Group className="mb-3">
          <Form.Control
            required
            size="lg"
            type="email"
            name="email"
            placeholder="Email Address"
            value={this.state.email}
            isInvalid={Boolean(errors?.email)}
            onChange={this.handleTextFeildValueChange}
            autoFocus
          />
          <Form.Control.Feedback type="invalid">
            {errors?.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            required
            size="lg"
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            isInvalid={Boolean(errors?.password)}
            onChange={this.handleTextFeildValueChange}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password}
          </Form.Control.Feedback>
        </Form.Group>
        {errors?.message && <Alert variant="danger">{errors.message}</Alert>}
        {errors?.login && <p className="text-danger">{errors.login}</p>}
        <Form.Group className="d-grid gap-2 mt-4 mb-3">
          <button
            type="submit"
            class="btn btn-block btn-lg btn-primary"
            disabled={loading}
          >
            Sign Up
            {loading && (
              <Spinner className="center" animation="border" role="status" />
            )}
          </button>
          <NavLink
            as="button"
            to={redirect}
            class="btn btn-block btn-lg btn-outline-secondary"
          >
            I already have an Account
          </NavLink>
        </Form.Group>
      </Form>
    );
  }
}

SignupForm.propTypes = {
  classes: propTypes.object.isRequired,
  user: propTypes.object.isRequired,
  UI: propTypes.object.isRequired,
  signupUser: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  loading: isLoading(state, userActionTypes.SET_USER),
  errors: getErrors(state, userActionTypes.SET_USER),
});

export default connect(mapStateToProps, {
  signupUser,
})(SignupForm);
