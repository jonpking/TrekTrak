const mongoose = require("mongoose");
const Journal = require("./models/journal");
const Comment = require("./models/comment");

const data = [
    {
        name: "Place we went!",
        image: "https://image.shutterstock.com/image-photo/europe-travel-vacation-fun-summer-600w-1048935941.jpg",
        description: "Holy cow we totally went to a place and did a thing!!!"
    },
    {
        name: "Trip we took!",
        image: "https://image.shutterstock.com/image-photo/hipster-young-girl-backpack-enjoying-600w-458190886.jpg",
        description: "Man that trip sure did take place!"
    },
    {
        name: "Boy did we travel!",
        image: "https://image.shutterstock.com/image-photo/travelers-couple-look-mountain-lake-600w-1156349101.jpg",
        description: "Traveling was DEFINITELY a thing we did!"
    },
]

function seedDB() {
    Journal.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Journals removed!");
        Comment.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("Comments Removed!");
        });
        data.forEach(function (seed) {
            Journal.create(seed, function (err, journal) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Journal added");
                    Comment.create(
                        {
                            text: "Placeholder comment",
                            author: "Person"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                journal.comments.push(comment);
                                journal.save();
                                console.log("Comment created");
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;