/*jslint: es6 */
const admin = require("firebase-admin");
const serviceAccount = require("../wona-certificate.json");

const config = {
  apiKey: "AIzaSyCs2TZZBSiXNRVRTlK3IP120ICm0O79D1Q",
  authDomain: "wona-39cfa.firebaseapp.com",
  databaseURL: "https://wona-39cfa.firebaseio.com",
  projectId: "wona-39cfa",
  storageBucket: "wona-39cfa.appspot.com",
  messagingSenderId: "434140256319",
  appId: "1:434140256319:web:2bef0b257d989f130a808a",
  measurementId: "G-1WB01JTTS7",
  credential: admin.credential.cert(serviceAccount),
};

admin.initializeApp(config);

const db = admin.firestore();

module.exports = { admin, db, config };
