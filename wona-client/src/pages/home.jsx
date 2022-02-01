import React, { Component } from "react";

export class home extends Component {
  render() {
    return (
      <React.Fragment>
        <section class="py-5 bg-light shadow-sm mb-1">
          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <h1>Access healthcare anywhere, anytime</h1>
                <p class="mt-3 mb-5">
                  Find a profession physician or a hospital that will cater to
                  your needs.
                </p>
                <form>
                  <div class="input-group mt-3 border">
                    <div class="input-group-prepend">
                      <div class="input-group-text border-0 bg-white pl-4 pr-0">
                        <i class="fa fa-search"></i>
                      </div>
                    </div>
                    <input
                      type="text"
                      name="q"
                      class="form-control form-ontrol-lg p-md-4 border-0"
                      placeholder="Search for a doctor"
                    />
                  </div>
                </form>
              </div>
              <div class="col-md-4">
                <img src="/images/appointment.svg" alt="" class="img-fluid" />
              </div>
            </div>
          </div>
        </section>

        <section class="container bg-white py-4" id="how-it-works">
          <h2 class="my-4 h4 font-weight-light">How does it all work?</h2>
          <div class="card-group text-md-center">
            <div class="card mt-3 border-0">
              <div class="card-body m-0 py-0 px-md-5">
                <img src="/images/doc.svg" alt="" class="img-fluid" />
              </div>
              <div class="card-footer border-0 bg-white lead">
                <span class="badge badge-pill badge-secondary mr-2 py-2 px-3">
                  1
                </span>{" "}
                Find a doctor
              </div>
            </div>
            <div class="card mt-3 border-0">
              <div class="card-body m-0 py-0 px-md-5">
                <img src="/images/appointment.svg" alt="" class="img-fluid" />
              </div>
              <div class="card-footer border-0 bg-white lead">
                <span class="badge badge-pill badge-secondary mr-2 py-2 px-3">
                  2
                </span>{" "}
                Book an appointment
              </div>
            </div>
            <div class="card mt-3 border-0">
              <div class="card-body m-0 py-0 px-md-5">
                <img src="/images/agreement.svg" alt="" class="img-fluid" />
              </div>
              <div class="card-footer border-0 bg-white lead">
                <span class="badge badge-pill badge-secondary mr-2 py-2 px-3">
                  3
                </span>{" "}
                Get quality care
              </div>
            </div>
          </div>
          <div class="text-center">
            <a
              href="<?php echo base_url('register') ?>"
              class="btn btn-lg btn-outline-secondary text-left my-4"
            >
              <small>Create an account</small>
            </a>
          </div>
        </section>

        <section class="mt-3 bg-dark text-white-50 py-5">
          <div class="container">
            <div class="row">
              <div class="col-md-7 m-auto">
                <h2 class="my-3">Register now. Feel Better. Stay informed</h2>
                <p>
                  Sign up for an account to get access to online consulting,
                  booking and scheduling, stay informed with our newsletters
                  with updates, event information, special offers and more.
                </p>
                <form
                  action="http://localhost/medicare/register"
                  method="post"
                  accept-charset="utf-8"
                >
                  <input
                    type="hidden"
                    name="csrf_test_name"
                    value="106aff82dc9ebf9bd34384666b48882a"
                  />
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="email" class="control-label mb-1">
                          Email
                        </label>
                        <span class="form-text text-muted mt-0 mb-1">
                          We do not share your email address with anyone
                        </span>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          value=""
                          class="form-control form-dark"
                          placeholder="Enter your email address"
                        />{" "}
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="first_name" class="control-label mb-1">
                          First name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value=""
                          class="form-control form-dark"
                          placeholder="Enter your first name"
                        />{" "}
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="last_name" class="control-label mb-1">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value=""
                          class="form-control form-dark"
                          placeholder="Enter your last name"
                        />{" "}
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="password" class="control-label mb-1">
                          Password
                        </label>
                        <input
                          type="text"
                          name="password"
                          value=""
                          class="form-control form-dark"
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="form-group">
                        <div class="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            name="newsletter"
                            value=""
                            class="custom-control-input"
                            id="check_newsletter"
                          />
                          <label
                            for="check_newsletter"
                            class="custom-control-label"
                          >
                            Company newsletters{" "}
                            <span class="form-text text-muted mt-0 mb-1">
                              Yes, i want to stay informed with product updates,
                              event information, special offers and more.
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="small text-muted mb-2">
                    By clicking below, I agree to the
                    <a
                      class="text-white"
                      href="http://localhost/medicare/legal/terms-of-service"
                    >
                      Terms of service
                    </a>
                    and
                    <a
                      class="text-white"
                      href="http://localhost/medicare/legal/privacy-policy"
                    >
                      Privacy policy
                    </a>
                    .
                  </div>
                  <div class="form-group text-center mt-3 mt-md-5">
                    <button
                      type="submit"
                      name="register"
                      value="1"
                      class="btn btn-lg btn-secondary rounded-0"
                    >
                      <small>SIGN UP NOW</small>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default home;
