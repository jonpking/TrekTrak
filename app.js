const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Journal = require("./models/journal");
const Comment = require("./models/comment");
const seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost:27017/trek_trak", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("Connected to DB!"))
    .catch(err => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// =====================
// JOURNAL ROUTES
// =====================

// JOURNAL - ROOT ROUTE
app.get("/", function (req, res) {
    res.render("landing");
});

// JOURNAL - INDEX ROUTE
app.get("/journals", function (req, res) {
    Journal.find({}, function (err, allJournals) {
        if (err) {
            console.log(err);
        } else {
            res.render("journals/index", { journals: allJournals });
        }
    });
});

// JOURNAL - CREATE ROUTE
app.post("/journals", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newJournal = { name: name, image: image, description: desc };
    Journal.create(newJournal, function (err, createdJournal) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/journals");
        }
    });
});

// JOURNAL - NEW ROUTE
app.get("/journals/new", function (req, res) {
    res.render("journals/new");
});

// JOURNAL - SHOW ROUTE
app.get("/journals/:id", function (req, res) {
    Journal.findById(req.params.id).populate("comments").exec(function (err, foundJournal) {
        if (err) {
            console.log(err);
        } else {
            res.render("journals/show", { journal: foundJournal });
        }
    });
});

// JOURNAL - EDIT ROUTE
app.get("/journals/:id/edit", function (req, res) {
    Journal.findById(req.params.id, function (err, foundJournal) {
        if (err) {
            console.log(err);
        } else {
            res.render("journals/edit", { journal: foundJournal });
        }
    });
});

// JOURNAL - UPDATE ROUTE
app.put("/journals/:id", function (req, res) {
    Journal.findByIdAndUpdate(req.params.id, req.body.journal, function (err, updatedJournal) {
        if (err) {
            res.redirect("/journals");
        } else {
            res.redirect("/journals/" + req.params.id);
        }
    });
});

// JOURNAL - DELETE/DESTROY ROUTE
app.delete("/journals/:id", function (req, res) {
    Journal.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/journals");
        } else {
            res.redirect("/journals");
        }
    });
});

// =====================
// COMMENT ROUTES
// =====================

// COMMENT - NEW ROUTE
app.get("/journals/:id/comments/new", function (req, res) {
    Journal.findById(req.params.id, function (err, journal) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { journal: journal });
        }
    });
});

// COMMENT - CREATE ROUTE
app.post("/journals/:id/comments", function (req, res) {
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
app.get("/journals/:id/comments/:comment_id/edit", function (req, res) {
    Journal.findById(req.params.id, function (err, foundJournal) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", { journal: foundJournal });
        }
    });
});

// COMMENT - UPDATE ROUTE

// COMMENT - DELETE/DESTROY ROUTE



app.listen(3000, function () {
    console.log("TrekTrak server has started");
});