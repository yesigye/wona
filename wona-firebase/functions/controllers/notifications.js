/*jslint: es6 */
const { db, admin } = require("../utils/admin");

exports.markNotificationsAsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.code });
    });
};
