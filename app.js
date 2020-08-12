const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
    image: String
});

const Journal = mongoose.model("Journal", journalSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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
            res.render("journals", { journals: allJournals });
        }
    });
});

// CREATE ROUTE
app.post("/journals", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const newJournal = { name: name, image: image };
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

app.listen(3000, function () {
    console.log("TrekTrak server has started");
});