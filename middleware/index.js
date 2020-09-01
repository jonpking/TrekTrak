const Journal = require("../models/journal");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

middlewareObj.checkJournalOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Journal.findById(req.params.id, function (err, foundJournal) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundJournal.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;