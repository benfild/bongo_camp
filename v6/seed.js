const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');


var data = [{
        name: "DIT",
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
        description: "This is the huge DIT camp in Dar es salaam"
    },
    {
        name: "UDSM",
        image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "UDOM",
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "This is the huge"
    },
    {
        name: "DIT",
        image: "https://cdn.pixabay.com/photo/2017/08/07/02/34/people-2598902__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "UDSM",
        image: "https://cdn.pixabay.com/photo/2016/03/30/02/57/camping-1289930__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "UDOM",
        image: "https://cdn.pixabay.com/photo/2016/11/23/17/05/campfire-1853835__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, function (err) {
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
                            } else {
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