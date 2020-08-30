const express = require("express");
const router = express.Router();
const passport = require("passport");

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
        if (err) {
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/journals");
        });
    });
});

// LOGOUT
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/journals');
});

module.exports = router;