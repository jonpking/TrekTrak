const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const journals = [
    {
        name: "trip to the river",
        image: "https://images.unsplash.com/photo-1455577380025-4321f1e1dca7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
    },
    {
        name: "mountain journey",
        image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
    },
    {
        name: "ballpark tour",
        image: "https://images.unsplash.com/photo-1470755711115-961e80ee0284?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
    }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/journals", function (req, res) {
    res.render("journals", { journals: journals });
});

app.post("/journals", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const newJournal = { name: name, image: image };
    journals.push(newJournal);
    res.redirect("/journals");
});

app.get("/journals/new", function (req, res) {
    res.render("new");
});

app.listen(3000, function () {
    console.log("TrekTrak server has started");
});