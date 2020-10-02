/*jslint: es6 */
const { admin } = require("./admin");

module.exports.authenticate = (req, res, next) => {
  let idToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).send({ message: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      res.locals = {
        uid: decodedToken.uid,
        role: decodedToken.role,
        email: decodedToken.email,
      };
      return next();
    })
    .catch((error) => {
      console.error("Error while verifying token ", error);
      return res.status(403).json(error);
    });
};

module.exports.authorize = (opts) => {
  return function (req, res, next) {
    const { role, email, uid } = res.locals;
    const { id } = req.params;

    // Allow admin.
    // Admin is hard coded & identifiable by this email
    if (email === "admin@admin.com") return next();

    // Allow user access to their resources. must provide id in params
    if (opts.allowSameUser && id && uid === id) return next();

    // Deny user if no roles were specified
    if (!role) return res.status(403).send();

    // Allow user with specific roles
    if (opts.hasRole.includes(role)) return next();

    return res.status(403).send();
  };
};
