const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/trek_trak", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("Connected to DB!"))
    .catch(err => console.log(error.message));

// SCHEMA SETUP
const journalSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Journal = mongoose.model("Journal", journalSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// ROOT ROUTE
app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX ROUTE
app.get("/journals", function (req, res) {
    Journal.find({}, function (err, allJournals) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { journals: allJournals });
        }
    });
});

// CREATE ROUTE
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

// NEW ROUTE
app.get("/journals/new", function (req, res) {
    res.render("new");
});

// SHOW ROUTE
app.get("/journals/:id", function (req, res) {
    Journal.findById(req.params.id, function (err, foundJournal) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { journal: foundJournal });
        }
    });
});

// EDIT ROUTE
app.get("/journals/:id/edit", function (req, res) {
    Journal.findById(req.params.id, function (err, foundJournal) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { journal: foundJournal });
        }
    });
});

// UPDATE ROUTE
app.put("/journals/:id", function (req, res) {
    Journal.findByIdAndUpdate(req.params.id, req.body.journal, function (err, updatedJournal) {
        if (err) {
            res.redirect("/journals");
        } else {
            res.redirect("/journals/" + req.params.id);
        }
    });
});

// DELETE/DESTROY ROUTE
app.delete("/journals/:id", function (req, res) {
    Journal.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/journals");
        } else {
            res.redirect("/journals");
        }
    });
});

app.listen(3000, function () {
    console.log("TrekTrak server has started");
});