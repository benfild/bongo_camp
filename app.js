const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user");

require("dotenv").config(); 
const MONGO_URI= process.env.MONGO_URI;
// seedDB = require("./seed");
const PORT = process.env.port || 3000;

//ROUTES IMPORTS
const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      indexRoutes = require("./routes/index");

//db connection
mongoose.connect(MONGO_URI, {
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
//-momery unleaked---------
app.set('trust proxy', 1);
const session = require('express-session');
const mongoDbStore = require("connect-mongodb-session")(session);

const mongoStore = new mongoDbStore(
  {
    uri: MONGO_URI,
    collection: "session",
  },
  (err) => {
    if (err) console.log(err);
  }
);

app.use(session({
    store: mongoStore,
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
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Routes USES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(PORT, process.env.IP, function(){
  console.log("Server start at:" + PORT);
});