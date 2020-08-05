const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/journals", function (req, res) {
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
    ]
    res.render("journals", { journals: journals });
});

app.listen(3000, function () {
    console.log("TrekTrak server has started");
});