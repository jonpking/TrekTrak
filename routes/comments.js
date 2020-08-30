const express = require("express");
const router = express.Router({ mergeParams: true });

const Journal = require("../models/journal");
const Comment = require("../models/comment");

// COMMENT - NEW ROUTE
router.get("/new", isLoggedIn, function (req, res) {
    Journal.findById(req.params.id, function (err, journal) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { journal: journal });
        }
    });
});

// COMMENT - CREATE ROUTE
router.post("/", isLoggedIn, function (req, res) {
    Journal.findById(req.params.id, function (err, journal) {
        if (err) {
            console.log(err);
            res.redirect("/journals");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    journal.comments.push(comment);
                    journal.save();
                    res.redirect("/journals/" + journal._id);
                }
            })
        }
    });
});

// COMMENT - EDIT ROUTE
router.get("/:comment_id/edit", isLoggedIn, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { journal_id: req.params.id, comment: foundComment });
        }
    });
});

// COMMENT - UPDATE ROUTE
router.put("/:comment_id", isLoggedIn, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/journals/" + req.params.id);
        }
    });
});

// COMMENT - DELETE/DESTROY ROUTE
router.delete("/:comment_id", isLoggedIn, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("/journals/" + req.params.id);
        } else {
            res.redirect("/journals/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;