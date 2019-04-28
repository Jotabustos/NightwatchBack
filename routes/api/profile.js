const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile Model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load Validation
const validateProfileInput = require("../../validation/profile");

// @route GET api/profile/test
// @desc Test profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route GET api/profile
// @desc Get current users profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]) // user contains the name and the avatar
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @route GET api/profile/handle/:handle
// @desc Get profile by handle
// @access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(400).json({ profile: "There is no profile for this user" })
    );
});

// @route GET api/profile/user/all
// @desc Get all profiles
// @access Public

router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(400).json({ profile: "There is no profiles" })
    );
});


// TODO: *******************************+
// Create POST request to create, update or delete the profile


// @route DELETE api/profile
// @desc Delete user and profile
// @access Private

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
      User.findOneAndRemove({_id: req.user.id})
        .then(() => res.json({success: true}));
    });
});

module.exports = router;
