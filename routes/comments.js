const express = require("express");
const router = express.Router({ mergeParams: true });
const validator = require("validator");

const middleware = require("../middleware");
const Journal = require("../models/journal");
const Comment = require("../models/comment");

// COMMENT - NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Journal.findById(req.params.id, function (err, journal) {
        if (err || !journal) {
            req.flash("error", "Journal not found");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/new", { journal: journal });
        }
    });
});

// COMMENT - CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    // COMMENT VALIDATION
    if (!validator.isLength(req.body.comment.text, { min: 1, max: 300 })) {
        req.flash("error", "Comment text must be between 1 and 300 characters");
        return res.redirect("/journals/" + req.params.id + "/comments/new");
    }
    Journal.findById(req.params.id, function (err, journal) {
        if (err) {
            console.log(err);
            res.redirect("/journals");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    journal.comments.push(comment);
                    journal.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/journals/" + journal._id);
                }
            })
        }
    });
});

// COMMENT - EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Journal.findById(req.params.id, function (err, foundJournal) {
        if (err || !foundJournal) {
            req.flash("error", "Journal not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", { journal_id: req.params.id, comment: foundComment });
            }
        });
    });
});

// COMMENT - UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/journals/" + req.params.id);
        }
    });
});

// COMMENT - DELETE/DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("/journals/" + req.params.id);
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/journals/" + req.params.id);
        }
    });
});

module.exports = router;