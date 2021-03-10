const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

// show all campgrounds
router.get("/", function (req, res) {
    //get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campGrounds: allCampgrounds,
                // currentUser: req.user
            });
        }
    });

});

router.post("/", isLoggedIn, function (req, res) {
    // get data from form and add to camgnd array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
    };

    // create a new campground and save in DB
    Campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            // res.redirect("/campgrounds");
            console.log(campground)
            res.redirect("/campgrounds");
        }
    });
});

router.get('/new', isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
    //find the campground with provided id and show its template
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCamp);
            //render show template with that campground
            res.render("campgrounds/show", {
                campground: foundCamp
            });
        }
    });
});


// EDIT Camp route
router.get("/:id/edit", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {
                campground: foundCamp
            });
        }
    });
});

// UPDATE Camp route
router.put("/:id", function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect show page
});

//DELETE Campground
router.delete("/:id", function (req, res) {
    //find and delete the correct campground
    Campground.findByIdAndRemove(req.params.id, function (err){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    });
});


//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;