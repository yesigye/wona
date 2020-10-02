/*jslint: es6 */
const { db, admin, config } = require("../utils/admin");
const fakeDoctors = require("../fake-doctors.json");

exports.seed = (req, res) => {
  const noImg = "no-user-image.png";

  const userCredentials = {
    handle: newUser.handle,
    email: newUser.email,
    createdAt: new Date().toISOString(),
    avatar: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
    userId,
  };
  // Save user profile to document
  db.doc(`/users/${newUser.handle}`)
    .set(userCredentials)
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((error) => {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        return res.status(400).json({ message: "Email is already in use" });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong, please try again" });
      }
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
        return db.doc(`/doctors/${res.locals.uid}`).update({ avatar });
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

exports.getDoctors = (req, res) => {
  // List batch of users, 1000 at a time.
  db.collection("doctors")
    .get()
    .then((snapshot) => {
      let doctors = [];
      snapshot.forEach((doc) => doctors.push(doc.data()));

      return res.json(doctors);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: error.message });
    });
};
