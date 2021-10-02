const { v4: uuidv4 } = require("uuid");
let multer = require("multer");
const express = require("express");

const router = express.Router();

const DIR = "./public/";
let File = require("../model/File");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("File type not accepted (.png, .jpg, .jpeg)"));
    }
  },
});

router.post(
  "/multi-images-upload",
  upload.array("imagesArray", 8),
  (req, res, next) => {
    const reqFiles = [];

    const url = req.protocol + "://" + req.get("host");

    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/public/" + req.files[i].filename);
    }

    const user = new File({
      _id: new mongoose.Types.ObjectId(),
      imagesArray: reqFiles,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Uploaded!",
          userCreated: {
            _id: result._id,
            imagesArray: result.imagesArray,
          },
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }
);

router.get("/", (req, res, next) => {
  File.find().then((response) => {
    res.status(200).json({
      message: "Images fetched!",
      posts: response,
    });
  });
});

module.exports = router;
