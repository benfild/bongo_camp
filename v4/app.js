var express = require("express");
// import express from "express"; //Using ES6 imports
var app = express();
const PORT = process.env.port || 3000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground")
var seedDB = require("./seed");

seedDB();
mongoose.connect("mongodb://localhost:27017/bongo_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //db connection
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


//RESTFUL ROUTES
app.get("/", function (req, res) {
    res.render("landing");
});

// show all campgrounds
app.get("/campgrounds", function (req, res) {
    //get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campGrounds: allCampgrounds
            });
        }
    });

});

app.post("/campgrounds", function (req, res) {
    // get data from form and add to camgnd array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    console.log(`${req.body.name} ${req.body.image} ${req.body.description}`);
    var newCampground = {
        name: name,
        image: image,
        description: description
    };

    // create a new campground and save in DB
    Campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            // res.redirect("/campgrounds");
            res.redirect("/campgrounds");
        }
    });
});

app.get('/campgrounds/new', function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function (req, res) {
    //find the campground with provided id and show its template
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCamp);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

//===================
// COMMENTS ROUTES
//===================
 app.get("/campgrounds/:id/comments/new", function (req, res) {
     res.render("comments/new");
 });

app.listen(PORT, process.env.IP, function () {
    console.log("Server started at:" + PORT);
});