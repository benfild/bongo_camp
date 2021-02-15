var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');


var data = [{
        name: "DIT",
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
        description: "This is the huge DIT camp in Dar es salaam"
    },
    {
        name: "UDSM",
        image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description: "This is the huge UDSM"
    },
    {
        name: "UDOM",
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "This is the huge"
    },
    {
        name: "DIT",
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
        description: "This is the DIT in Tech"
    },
    {
        name: "UDSM",
        image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description: "This is the UDSM"
    },
    {
        name: "UDOM",
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "This is the another UDOM"
    }
];

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('removes campgrounds!');
            //Add few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a new camp");
                        //Add few comments
                        Comment.create({
                            text: "This place is great but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err)
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("added a new comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;