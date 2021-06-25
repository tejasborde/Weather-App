const express    = require("express"),
      router     = express.Router({mergeParams : true}),
	  User       = require("../models/user"),
	  middleware = require("../middleware"),
    passport = require("passport");
     


router.get('/register', (req, res) => {
    res.render('register');
})


router.get('/login', (req, res) => {
    res.render('login');
})


router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success', "Logout Successfully.");
    res.redirect("/login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
}), function(req, res) {});


router.post("/register", async(req, res) => {
    const { fname, lname, email, password, cpass } = req.body;
    await User.findOne({ username: email })
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
                
                req.flash("error", "Email is already registered.");
                res.redirect("/register");
            }
        })
        .catch((err) => {
            req.flash('error', "Something went wrong,Please try again later.");
            res.redirect("/register");
        });

})

module.exports = router;