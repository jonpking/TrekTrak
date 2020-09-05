const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("validator");

const User = require("../models/user");

// ROOT ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});

// =====================
// PASSPORT ROUTES
// =====================

// LOGIN FORM
router.get("/login", function (req, res) {
    res.render("login");
});

// LOGIN LOGIC
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/journals',
        failureRedirect: '/login',
        failureFlash: false
    })
);

// REGISTER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

// REGISTER LOGIC
router.post("/register", function (req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        // REGISTERED USERNAME VALIDATION
        if (!validator.isLength(req.body.username, { min: 1, max: 5 })) {
            req.flash("error", "Username must be between 1 and 5 characters");
            return res.redirect("/register");
        }
        if (!validator.isAlphanumeric(req.body.username)) {
            req.flash("error", "Username must be alphanumeric");
            return res.redirect("/register");
        }
        // REGISTERED PASSWORD VALIDATION
        if (!validator.isLength(req.body.password, { min: 1, max: 5 })) {
            req.flash("error", "Password must be between 1 and 5 characters");
            return res.redirect("/register");
        }
        if (!validator.isAlphanumeric(req.body.password)) {
            req.flash("error", "Password must be alphanumeric");
            return res.redirect("/register");
        }
        // CHECK REGISTRATION FOR ERROR
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        // IF ALL TESTS PASS, PROCESS REGISTRATION
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to TrekTrak " + user.username);
            res.redirect("/journals");
        });
    });
});

// LOGOUT
router.get('/logout', function (req, res) {
    req.flash("success", "Logged you out");
    req.logout();
    res.redirect('/journals');
});

module.exports = router;