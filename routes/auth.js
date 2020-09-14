const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");

//Image upload:
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

//Import USER(mongoose model):
const User = require("../model/User");

//To retrieve User details(GET METHOD):
router.get("/register", (req, res, next) => {
    User.find()
        .select("name email password phoneNumber gender dob userImage")
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                createdUser: docs.map((doc) => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        password: doc.password,
                        phoneNumber: doc.phoneNumber,
                        gender: doc.gender,
                        dob: doc.dob,
                        userImage: doc.userImage,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/register/",
                        },
                    };
                }),
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

//To create user details(POST METHOD):
router.post("/register", upload.single("userImage"), (req, res, next) => {
    //email,phonenumber exists(unique)
    User.find({
            email: req.body.email,
        }, {
            phoneNumber: req.body.phoneNumber,
        })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail or PhoneNumber exists",
                });
            } else {
                //password encrypted format
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const user = new User({
                            // _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            gender: req.body.gender,
                            dob: req.body.dob,
                            userImage: req.file.path,
                        });
                        user
                            .save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: "Created user successfully",
                                    createdUser: {
                                        name: result.name,
                                        email: result.email,
                                        password: result.password,
                                        phoneNumber: result.phoneNumber,
                                        gender: result.gender,
                                        dob: result.dob,
                                        _id: result._id,
                                        request: {
                                            type: "POST",
                                            url: "http://localhost:3000/register/",
                                        },
                                    },
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                });
                            });
                    }
                });
            }
        });
});

//export auth.js
module.exports = router;