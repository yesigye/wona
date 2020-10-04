/*jslint: es6 */
const isEmpty = (string) => {
  return string == null ? true : string.trim() === "";
};

const isEmail = (email) => {
  const emailRegEx =
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  return email.match(emailRegEx);
};

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Email must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }
  if (isEmpty(data.password)) {
    errors.password = "Password must not be empty";
  }
  if (isEmpty(data.firstName)) {
    errors.firstName = "First name must not be empty";
  }
  if (isEmpty(data.lastName)) {
    errors.lastName = "Last name must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Email must not be empty";
  if (isEmpty(data.password)) errors.password = "Password must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.firstName)) userDetails.firstName = data.firstName;
  if (!isEmpty(data.lastName)) userDetails.lastName = data.lastName;
  if (typeof data.address !== "undefined" && !isEmpty(data.address)) {
    userDetails.address = data.address;
  }

  return userDetails;
};
