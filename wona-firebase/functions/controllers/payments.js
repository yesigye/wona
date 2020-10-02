/*jslint: es6 */
const { db, admin } = require("../utils/admin");
const momo = require("mtn-momo");

exports.collect = (req, res) => {
  //   let batch = db.batch();
  //   req.body.forEach((notificationId) => {
  //     const notification = db.doc(`notifications/${notificationId}`);
  //     batch.update(notification, { read: true });
  //   });
  //   batch
  //     .commit()
  //     .then(() => {
  //       return res.json({ message: "Notifications marked read" });
  //     })
  //     .catch((error) => {
  //       return res.status(500).json({ message: error.code });
  //     });
  const { Collections } = momo.create({
    baseUrl: "https://sandbox.momodeveloper.mtn.com",
    environment: "sandbox",
    callbackHost: "http://localhost:5000/wona-39cfa/us-central1/api/",
  });

  const collections = Collections({
    userSecret: "d9685f15aef54aacbf09b3502772667e",
    userId: "79452273-1d10-4f2a-a5cb-1d8af5baeb31",
    primaryKey: "53111355b9c848daa2b48981650e73ee",
  });

  // Request to pay
  collections
    .requestToPay({
      amount: "50",
      currency: "EUR",
      externalId: "123456",
      payer: {
        partyIdType: "MSISDN",
        partyId: "256774290781",
      },
      payerMessage: "testing",
      payeeNote: "hello",
    })
    .then((transactionId) => {
      console.log({ transactionId });
      // Get transaction status
      return collections.getTransaction(transactionId);
    })
    .then((transaction) => {
      console.log({ transaction });
      // Get account balance
      return collections.getBalance();
    })
    .then((accountBalance) => {
      return res.json({ accountBalance });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: error.code });
    });
};
