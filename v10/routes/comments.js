const express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

//comment new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});

// Comment create
router.post("/", middleware.isLoggedIn, function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username
                    //connect new comment to campground
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log("added a new comment");
                    //redirect campground to show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {
                         campground: foundCamp, comment: foundComment
                    });
                }
            });
        }
    });
});

// UPDATE Comment route
router.put("/:comment_id", middleware.checkCommentOwnership,function (req, res) {
    // find and update the correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE Comment
router.delete("/:comment_id", middleware.checkCommentOwnership,function (req, res) {
    //find and delete the correct campground
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});


module.exports = router;