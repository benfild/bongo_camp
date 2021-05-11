const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

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

router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from form and add to camgnd array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };

    // create a new campground and save in DB
    Campground.create(newCampground, function (err, campground) {
        if (err) {
            req.flash("error", "Something went WRONG!");
            console.log(err);
        } else {
            // res.redirect("/campgrounds");
            console.log(campground)
            req.flash("success", "New campground added successfully!");
            res.redirect("/campgrounds");
        }
    });
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
    //find the campground with provided id and show its template
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went WRONG!");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {
                campground: foundCamp
            });
        }
    });
});

// EDIT Camp route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went WRONG!");
            res.redirect("back");
        } else {
           res.render("campgrounds/edit", {
            campground: foundCamp
        });
        }
    });
});

// UPDATE Camp route
router.put("/:id", middleware.checkCampgroundOwnership,function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went WRONG!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect show page
});

//DELETE Campground
router.delete("/:id", middleware.checkCampgroundOwnership,function (req, res) {
    //find and delete the correct campground
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went WRONG!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted successfully!");
            res.redirect("/campgrounds")
        }
    });
});


module.exports = router;