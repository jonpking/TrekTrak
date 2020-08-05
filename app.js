const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const journals = [
    {
        name: "trip to the river",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
    },
    {
        name: "mountain journey",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Mount_Everest_as_seen_from_Drukair2_PLW_edit.jpg"
    },
    {
        name: "ballpark tour",
        image: "https://www.ballparksofbaseball.com/wp-content/uploads/2016/03/nats17_top.jpg"
    },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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