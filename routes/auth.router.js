const express = require('express');
const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');
const { body, validationResult, check } = require("express-validator");
const jwt = require('jsonwebtoken');

const User = require("../model/user.model");
const verifyUser = require("../middleware/verifyuser");

const router = express.Router();

const validateRegister = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('number').isMobilePhone('any').withMessage('Invalid phone number'),
  body("email").isEmail().withMessage("Email is not valid!"),
  body("password").notEmpty().withMessage("Password is required!"),

  (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, respond with a 400 status and the error messages
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, continue to the next middleware or route handler
    next();
  }
];

const validateUpdate = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('number').isMobilePhone('any').withMessage('Invalid phone number'),
  body("email").isEmail().withMessage("Email is not valid!"),

  (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, respond with a 400 status and the error messages
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, continue to the next middleware or route handler
    next();
  }
];

const validateLogin = [
  body('number').isMobilePhone('any').withMessage('Invalid phone number'),
  body("password").notEmpty().withMessage("Password is required!"),
  (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, respond with a 400 status and the error messages
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, continue to the next middleware or route handler
    next();
  }
]

router.route("/register")
  .post(validateRegister, async (req, res) => {
    try {
      const newUser = new User({
        username: req.body.username,
        number: req.body.number,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString()
      });
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error creating a user" })
    }
  })

router.route("/login")
  .post(validateLogin, async (req, res) => {
    try {
      const user = await User.findOne({ number: req.body.number });

      if(!user)
      {
        return res.status(401).json({ message: "Incorrect Mobile Number" });
      }
     

      const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
      decodedPassword !== req.body.password && res.status(401).json({ message: "Incorrect Password" });

      const { password, ...rest } = user._doc;
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN,{ expiresIn: 3600 })

      res.json({ ...rest, accessToken });

    } catch (err) {
      console.log(err)
    }
  }
  )

router.route("/user/:id")
  .put(validateUpdate,verifyUser, async function (req, res) {
    try {
      const id = req.params.id;
      let updateData = {
        email: req.body.email,
        number: req.body.number,
        username: req.body.username,
      };
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.send("<h1>Invalid Id : " + id + "</h1>");
      let record = await User.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
      }).exec();
      if (record) {
        return res.send("Record is Updated Scuccessfully");
      }
      return res.send("No Record Updated  Invlalid Id : " + id);
    } catch (err) {
      return res.send("Error Update" + err);
    }
  });

module.exports = router;