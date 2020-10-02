/*jslint: es6 */
const functions = require("firebase-functions");
const app = require("express")();

// Network CORS stuff
const cors = require("cors");
app.use(cors());

// Authentication middleware
const { authenticate, authorize } = require("./utils/auth");

// End point Handlers
const { markNotificationsAsRead } = require("./controllers/notifications");
const { getDoctors } = require("./controllers/doctors");
const {
  getUsers,
  signin,
  signup,
  editUserDetails,
  uploadImage,
  getAuthenticatedUser,
} = require("./controllers/users");
const {
  getAppointment,
  getAppointments,
  createAppointment,
  deleteAppointment,
} = require("./controllers/appoitnments");
const { collect } = require("./controllers/payments");

/* Routes */

// User routes
app.post("/login", signin);
app.post("/signup", signup);
app.get("/users", getUsers);
app.get("/user", authenticate, getAuthenticatedUser);
app.post("/user", authenticate, editUserDetails);
app.post("/user/image", authenticate, uploadImage);
// Appointment routes
app.get(
  "/appointments",
  authenticate,
  authorize({ hasRole: ["user"], allowSameUser: true }),
  getAppointments
);
app.post("/appointment", authenticate, createAppointment);
app.get("/appointment/:id", authenticate, getAppointment);
app.delete("/appointment/:id", authenticate, deleteAppointment);
// Dcotors
app.get("/doctors", getDoctors);
// Notifications
app.post("/notifications", authenticate, markNotificationsAsRead);
// Payments
app.post("/payment", collect);

exports.api = functions.https.onRequest(app);

/* Database Triggers */

const { db } = require("./utils/admin");

// Create a notification when a new appointment is made
exports.createAppointmentNotification = functions.firestore
  .document("appointments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`notifications/${snapshot.id}`)
      .set({
        createdAt: new Date().toString(),
        recipient: "insert doctor details",
        sender: snapshot.data().uid,
        type: "appointment",
        read: false,
        refId: snapshot.id,
      })
      .then(() => {
        return;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  });

// Remove notification when an appointment is removed
exports.deleteAppointmentNotificationOnRead = functions.firestore
  .document("appointments/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  });

// User changes their profile
exports.onUserImageChange = functions.firestore
  .document("users/{id}")
  .onUpdate((change) => {
    if (change.before.data().avatar !== change.after.data().avatar) {
      let batch = db.batch();
      return db
        .collection("appointments")
        .where("attendants", "array-contains", change.before.data().uid)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const appointment = db.doc(`appointments/${doc.id}`);
            batch.update(appointment, {
              userAvatar: change.after.data().avatar,
            });
          });
          return batch.commit();
        })
        .catch((error) => console.log(error));
    }
    return false;
  });
