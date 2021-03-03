const express = require("express"),
      router = express.Router({mergeParams: true}),
      Comment = require("../models/comment");   

//comment new
router.get("/new", isLoggedIn,function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground });
        }
    });
});

// Comment create
router.post("/", isLoggedIn,function (req, res){
    //find campground by id
    Campground.findById(req.params.id, function (err,campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment){
                if(err){
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log("added a new comment");
                    //redirect campground to show page
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
