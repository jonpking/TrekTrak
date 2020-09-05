const express = require("express");
const router = express.Router();

const middleware = require("../middleware");
const Journal = require("../models/journal");
const Comment = require("../models/comment");
const { default: validator } = require("validator");
// const User = require("../models/user");
// const journal = require("../models/journal");

// JOURNAL - INDEX ROUTE
router.get("/", function (req, res) {
    Journal.find({}, function (err, allJournals) {
        if (err) {
            console.log(err);
        } else {
            res.render("journals/index", { journals: allJournals });
        }
    });
});

// JOURNAL - CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    // JOURNAL NAME VALIDATION
    if (!validator.isLength(req.body.name, { min: 1, max: 50 })) {
        req.flash("error", "Journal name must be between 1 and 50 characters");
        return res.redirect("/journals/new");
    }
    if (!validator.isAlphanumeric(req.body.name)) {
        req.flash("error", "Journal must be alphanumeric");
        return res.redirect("/journals/new");
    }
    // JOURNAL IMAGE VALIDATION
    if (!validator.isURL(req.body.image, { protocols: ["http", "https"], require_protocol: true, allow_underscores: true })) {
        req.flash("error", "Journal image must be a valid URL");
        return res.redirect("/journals/new");
    }
    // JOURNAL DESCRIPTION VALIDATION
    if (!validator.isLength(req.body.description, { min: 1, max: 1000 })) {
        req.flash("error", "Journal description must be between 1 and 1000 characters");
        return res.redirect("/journals/new");
    }
    const newJournal = { name: name, image: image, description: desc, author: author };
    Journal.create(newJournal, function (err, createdJournal) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/journals");
        }
    });
});

// JOURNAL - NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("journals/new");
});

// JOURNAL - SHOW ROUTE
router.get("/:id", function (req, res) {
    Journal.findById(req.params.id).populate("comments").exec(function (err, foundJournal) {
        if (err || !foundJournal) {
            req.flash("error", "Journal not found");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("journals/show", { journal: foundJournal });
        }
    });
});

// JOURNAL - EDIT ROUTE
router.get("/:id/edit", middleware.checkJournalOwnership, function (req, res) {
    Journal.findById(req.params.id, function (err, foundJournal) {
        res.render("journals/edit", { journal: foundJournal });
    });
});

// JOURNAL - UPDATE ROUTE
router.put("/:id", middleware.checkJournalOwnership, function (req, res) {
    // JOURNAL NAME VALIDATION
    if (!validator.isLength(req.body.journal.name, { min: 1, max: 5 })) {
        req.flash("error", "Journal name must be between 1 and 50 characters");
        return res.redirect("/journals/" + req.params.id + "/edit");
    }
    if (!validator.isAlphanumeric(req.body.journal.name)) {
        req.flash("error", "Journal must be alphanumeric");
        return res.redirect("/journals/" + req.params.id + "/edit");
    }
    // JOURNAL IMAGE VALIDATION
    if (!validator.isURL(req.body.journal.image, { protocols: ["http", "https"], require_protocol: true, allow_underscores: true })) {
        req.flash("error", "Journal image must be a valid URL");
        return res.redirect("/journals/" + req.params.id + "/edit");
    }
    // JOURNAL DESCRIPTION VALIDATION
    if (!validator.isLength(req.body.journal.description, { min: 1, max: 5 })) {
        req.flash("error", "Journal description must be between 1 and 1000 characters");
        return res.redirect("/journals/" + req.params.id + "/edit");
    }
    Journal.findByIdAndUpdate(req.params.id, req.body.journal, function (err, updatedJournal) {
        if (err) {
            res.redirect("/journals");
        } else {
            res.redirect("/journals/" + req.params.id);
        }
    });
});

// JOURNAL - DELETE/DESTROY ROUTE
router.delete("/:id", middleware.checkJournalOwnership, function (req, res) {
    Journal.findByIdAndDelete(req.params.id, function (err, removedJournal) {
        if (err) {
            res.redirect("/journals");
        } else {
            Comment.deleteMany({ _id: { $in: removedJournal.comments } }, function (err, removedComments) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/journals");
            });
        }
    });
});

module.exports = router;