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
    flash = require('connect-flash');


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


app.use(session({
    secret: "Any normal Word", //decode or encode session
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 1000
    }
}));
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
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
    next();
});

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})




app.post("/register", (req, res) => {
    const { fname, lname, email, password, cpass } = req.body;


    User.findOne({ username: email })
        .then(async(user) => {
            if (!user) {
                if (password === cpass) {
                    await User.register(new User({
                        username: email,
                        firstname: fname,
                        lastname: lname,
                        email: email,
                    }), password, function(err, user) {
                        if (err) {
                            console.log(err);
                            res.redirect("/register");
                        } else {
                            console.log("Following User has been registerd");
                            console.log(user);
                            req.flash("success", "Registered Successfully");
                            res.redirect("/login");
                        }
                    })


                } else {
                    req.flash("error", "Passwords dose not match.");
                    res.redirect("/register");
                }

            } else {
                //   res.status(400).json({ error: 'User already exists' });
                req.flash("error", "Email is already registered.");
                res.redirect("/register");
            }
        })
        .catch((err) => {
            //return error
        });


})





app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
}), function(req, res) {});


app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});



app.get('/', isLoggedIn, (req, res) => {
    const text = fs.readFileSync("cities.txt", 'utf-8');
    const cities = text.split('\n');
    res.render('home', { cities });
})


app.get('/register', (req, res) => {
    res.render('register');
})


app.get('/login', (req, res) => {
    res.render('login');
})


app.post('/climate',isLoggedIn, (req, res) => {

    const city = req.body.city;


    var options = {
        method: 'GET',
        url:process.env.rapidapi_url,
        params: { q: city },
        headers: {
            'x-rapidapi-key': process.env.x_rapidapi_key,
            'x-rapidapi-host': process.env.x_rapidapi_host
        }
    };

    axios.request(options).then(function(response) {

        //console.log(response.data);
        const jsonObj = response.data;
        const img = jsonObj.current.condition.icon.slice(21);
        const img_path = "images/" + img;
        const date_now = new Date();
        const date_data = { "date": date_now.getDate() + " " + months[date_now.getMonth()] + "," + date_now.getFullYear(), "time": date_now.getHours() + ":" + date_now.getMinutes() + ":" + date_now.getSeconds() };
        if (jsonObj.location.name.length >= 20) {
            let name = jsonObj.location.name.split(" ")[0];
            res.render('climate.ejs', { data: jsonObj, name: name, i: img_path, date_data });
        } else {
            res.render('climate.ejs', { data: jsonObj, name: "", i: img_path, date_data });
        }

    }).catch(function(error) {
        req.flash('error', 'Incorrect Choice!!! Please Select correct city');
        res.redirect('/');
        console.error(error);
    });

})

app.get('/forecast',isLoggedIn, (req, res) => {
    req.flash('error',"This feature is not available right now.We are working on it.");
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening 3000!!");
})