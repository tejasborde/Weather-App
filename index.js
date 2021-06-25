const dotenv=require('dotenv').config();
const express = require('express'),
    app = express(),
    fs = require('fs'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    session = require("express-session"),
    User = require("./models/user"),
    path = require("path"),
    axios = require("axios"),
    flash = require('connect-flash'),
    middleware = require("./middleware"),
    authRoutes = require('./routes/auth'),
    services = require('./routes/services'),
    homeRoutes = require('./routes/index'),
    passport_config=require('./passport-config');




mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


app.use(session({
    secret: "Any normal Word",
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 1000
    }
}));
// passport.serializeUser(User.serializeUser()); 
// passport.deserializeUser(User.deserializeUser()); 
passport.use(new LocalStrategy(User.authenticate()));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    res.locals.currentUser = req.user;
    next();
});


app.use(authRoutes);
app.use(services);
app.use(homeRoutes);


app.listen(process.env.PORT || 3000, () => {
    console.log("Listening 3000!!");
})