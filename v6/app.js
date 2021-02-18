const   express = require("express"),
        app = express(),
        PORT = process.env.port || 3000,
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        Campground = require("./models/campground"),
        Comment = require("./models/comment"),
        User = require("./models/user"),
        seedDB = require("./seed");


seedDB();
//db connection
mongoose.connect("mongodb://localhost:27017/bongo_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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
            console.log(campground)
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
            res.render("campgrounds/show", {
                campground: foundCamp
            });
        }
    });
});

//===================
// COMMENTS ROUTES
//===================
app.get("/campgrounds/:id/comments/new", function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res){
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

app.listen(PORT, process.env.IP, function () {
    console.log("Server started at:" + PORT);
});