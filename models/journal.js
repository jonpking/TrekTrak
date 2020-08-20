const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Journal", journalSchema);