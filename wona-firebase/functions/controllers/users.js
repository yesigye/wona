/*jslint: es6 */
const { db, admin, config } = require("../utils/admin");
const firebase = require("firebase");

firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../utils/validators");

// Format necessary properties of a user
const mapUser = (user) => {
  const customClaims = user.customClaims || { role: "" };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
};

exports.signup = (req, res) => {
  const newUser = req.body;
  // Validation of the user fields
  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImg = "no-user-image.png";
  let token, userId;

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((tokenId) => {
      token = tokenId;

      if (!newUser.role) newUser.role = "user";
      // Set user role through firebase custom claim
      return admin.auth().setCustomUserClaims(userId, { role: newUser.role });
    })
    .then(() => {
      // Define profile data for new user
      const userCredentials = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: new Date().toISOString(),
        avatar: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId,
      };
      // Save user profile to document
      return db.doc(`/users/${userId}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((error) => {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong, please try again" });
      }
    });
};

exports.signin = (req, res) => {
  const user = req.body;
  // Validation of the user fields
  const { valid, errors } = validateLoginData(user);

  if (!valid) res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Wrong credetials, please try again" });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  db.doc(`users/${res.locals.uid}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).send({ message: "User not found" });
      }

      userData.credentials = doc.data();

      // TODO: Change where clause from sender to receipient
      return db
        .collection(`notifications`)
        .where("sender", "==", res.locals.uid)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          type: doc.data().type,
          read: doc.data().read,
          refId: doc.data().refId,
        });
      });

      return res.json(userData);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: error.message });
    });
};

exports.editUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${res.locals.uid}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "User profile updated" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: error.message });
    });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imgName;
  let imgToUpload = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const allowedFiles = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFiles.includes(mimetype)) {
      return res.status(400).json({ message: "Wrong file type submitted" });
    }

    const imgExt = filename.split(".")[filename.split(".").length - 1];
    imgName = `${Math.round(Math.random() * 100000000000)}.${imgExt}`;
    const imgPath = path.join(os.tmpdir(), imgName);
    imgToUpload = { imgPath, mimetype };
    return file.pipe(fs.createWriteStream(imgPath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imgToUpload.imgPath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imgToUpload.mimetype,
          },
        },
      })
      .then(() => {
        const avatar = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imgName}?alt=media`;
        return db.doc(`/users/${res.locals.uid}`).update({ avatar });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ message: error.message });
      });
  });
  busboy.end(req.rawBody);
};

exports.getUsers = (req, res) => {
  // List batch of users, 1000 at a time.
  admin
    .auth()
    .listUsers(1000)
    .then((listUsers) => {
      const users = listUsers.users.map(mapUser);
      return res.status(200).send({ users });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: error.message });
    });
};
