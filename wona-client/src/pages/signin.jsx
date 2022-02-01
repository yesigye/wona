import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import propTypes from "prop-types";

// React Bootstrap
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
import { isLoading, getErrors } from "../redux/selectors";
import { userActionTypes } from "../redux/types";
// Utility functions
import { getParams } from "../utils/urls";

class Signin extends Component {
  state = {
    validated: false,
    email: "",
    password: "",
    errors: {},
  };

  styles = {
    image: {
      backgroundImage: 'url("/images/appointment.svg")',
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
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
    const { email, password } = this.state;
    const urlParams = getParams(
      this.props.location.pathname + this.props.location.search
    );
    this.props.loginUser({ email, password }, this.props.history, urlParams.to);
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

    return (
      <CardGroup className="row">
        <Card className="col-md-7 border-0 rounded-0">
          <Card.Body style={this.styles.image} />
        </Card>
        <Card className="col-md-5 border-0 rounded-0">
          <Card.Body className="py-md-5 px-3 px-md-0">
            <div className="mt-md-5"></div>
            <div className="mt-md-5"></div>
            <div className="mt-md-5"></div>
            <h3 className="mb-4 my-md-5 text-center">Sign In</h3>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
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
              <Form.Group className="mb-3 d-flex justify-content-between">
                <Form.Check label="Remember me" />
                <NavLink to="/forgot-password">Forgot password?</NavLink>
              </Form.Group>
              {errors?.message && (
                <Alert variant="danger">{errors.message}</Alert>
              )}
              {errors?.login && <p className="text-danger">{errors.login}</p>}
              <Form.Group className="d-grid gap-2 mb-3">
                <button
                  type="submit"
                  class="btn btn-block btn-lg btn-primary"
                  disabled={loading}
                >
                  Sign In
                  {loading && (
                    <Spinner
                      className="center"
                      animation="border"
                      role="status"
                    />
                  )}
                </button>
                <NavLink
                  as="button"
                  to="/register"
                  class="btn btn-block btn-lg btn-outline-secondary"
                >
                  I Don't Have an Account
                </NavLink>
              </Form.Group>
            </Form>
            <div className="mb-md-5"></div>
            <div className="mb-md-5"></div>
            <div className="mb-md-5"></div>
          </Card.Body>
        </Card>
      </CardGroup>
    );
  }
}

Signin.propTypes = {
  loginUser: propTypes.func.isRequired,
  user: propTypes.object.isRequired,
  UI: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  loading: isLoading(state, userActionTypes.SET_USER),
  errors: getErrors(state, userActionTypes.SET_USER),
});

export default connect(mapStateToProps, { loginUser })(Signin);
