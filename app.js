const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const Journal = require("./models/journal");
const Comment = require("./models/comment");
const User = require("./models/user");

const commentRoutes = require("./routes/comments");
const journalRoutes = require("./routes/journals");
const indexRoutes = require("./routes/index");

const seedDB = require("./seeds");

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

// PASSPORT CONFIG
app.use(session({
    secret: "purple bacon",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// DATABASE SEEDING
// seedDB();

app.use("/", indexRoutes);
app.use("/journals", journalRoutes);
app.use("/journals/:id/comments", commentRoutes);

app.listen(3000, function () {
    console.log("TrekTrak server has started");
});