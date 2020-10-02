/*jslint: es6 */
const { db, admin } = require("../utils/admin");

exports.getAppointments = (req, res) => {
  db.collection("appointments")
    .where("attendants", "array-contains", res.locals.uid)
    .get()
    .then((snapshot) => {
      let appointments = [];
      snapshot.forEach((doc) => {
        appointments.push(doc.data());
      });
      return res.json({ appointments });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: error.message });
    });
};

exports.getAppointment = (req, res) => {
  db.doc(`appointments/${req.params.id}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      return res.json(doc.data());
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: "Something went wrong" });
    });
};

exports.createAppointment = (req, res) => {
  const newAppointment = {
    body: req.body.body,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    userHandle: req.body.userHandle,
    userAvatar: req.body.userAvatar,
    attendants: [res.locals.uid],
  };

  db.collection("appointments")
    .add(newAppointment)
    .then((doc) => {
      // Indicate that a new resource was created
      return res
        .status(201)
        .send({ message: `document ${doc.id} was created` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "something went wrong" });
    });
};

exports.deleteAppointment = (req, res) => {
  const document = db.doc(`appointments/${req.params.id}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).send({ message: "Appointment not found" });
      }
      // User should not delete others' appointment
      if (doc.data().attendants.includes[res.locals.uid]) {
        return res.status(403).send({ message: "Unauthorized" });
      }

      return document.delete();
    })
    .then(() => {
      return res.json({ message: `Appointment was deleted` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "something went wrong" });
    });
};
