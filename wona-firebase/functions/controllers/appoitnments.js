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
  const postData = req.body;

  if(! postData.hasOwnProperty("doctorID")) {
    console.log("Doctor ID is required");
    return res.status(500).send({ message: "something went wrong" });
  }
  
  const appointment = {
    date: admin.firestore.Timestamp.fromDate(new Date(postData.date)),
    user: postData.user,
    doctor: postData.doctor,
    location: { address: postData.location.address },
    attendants: [res.locals.uid, postData.doctorID],
    status: "paid",
    paid: true,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  if(postData.hasOwnProperty("location") &&  postData.location.hasOwnProperty("geopoint")) {
    // use firestore immutable geopoint object
    appointment.location.geopoint = new admin.firestore.GeoPoint(
      postData.location.geopoint.latitude,
      postData.location.geopoint.longitude
    );
  }
  
  db.collection("appointments").add(appointment).then((doc) => {
      // Update user & doctor documents for data integrity.
      db.doc(`users/${res.locals.uid}`).update({
        appointments: firebase.firestore.FieldValue.arrayUnion(doc.id)
      });
      db.doc(`doctors/${postData.doctorID}`).update({
        appointments: firebase.firestore.FieldValue.arrayUnion(doc.id)
      });

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
