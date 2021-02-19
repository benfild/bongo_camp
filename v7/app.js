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
seedDB();

app.use(require("express-session")({
    secret: "benward loves Sharifa",
    resave: false,
    saveUninitialized: false
}));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass currentUser in every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
                campGrounds: allCampgrounds,
                currentUser: req.user
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
app.get("/campgrounds/:id/comments/new", isLoggedIn,function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn,function (req, res){
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

//=====================
// AUTH ROUTES
//=====================
//show register from
app.get("/register", function (req, res){
    res.render("register");
});
// handle sign up logic
app.post("/register", function (req, res){
    const newUSer = new User({username: req.body.username});
    User.register(newUSer, req.body.password, function (err, user){
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req, res){

});
//Logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, process.env.IP, function () {
    console.log("Server started at:" + PORT);
});