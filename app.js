const   express = require("express"),
        app = express(),
        PORT = process.env.port || 3000,
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        flash = require("connect-flash"),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override"),
        User = require("./models/user");
        // seedDB = require("./seed");

//ROUTES IMPORTS
const campgroundRoutes = require("./routes/campgrounds");
      commentRoutes = require("./routes/comments");
      indexRoutes = require("./routes/index");

//db connection
mongoose.connect("mongodb+srv://benfild-admin:benfildlove0654@cluster0.mtnqq.mongodb.net/bongo_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); //seed the database

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Routes USES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(PORT, process.env.IP, function () {
    console.log("Server started at:" + PORT);
});