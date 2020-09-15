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
        failureFlash: true
    })
);

// REGISTER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

// REGISTER LOGIC
router.post("/register", function (req, res) {
    // REGISTERED USERNAME VALIDATION
    if (!validator.isLength(req.body.username, { min: 4, max: 20 })) {
        req.flash("error", "Username must be between 4 and 20 characters");
        return res.redirect("/register");
    }
    if (!validator.isAlphanumeric(req.body.username)) {
        req.flash("error", "Username must be alphanumeric");
        return res.redirect("/register");
    }
    // REGISTERED PASSWORD VALIDATION
    if (!validator.isLength(req.body.password, { min: 8, max: 64 })) {
        req.flash("error", "Password must be between 8 and 64 characters");
        return res.redirect("/register");
    }
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
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