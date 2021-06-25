  
const User = require("../models/user");



middleware = {};

middleware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "Please Login First!!!");
		res.redirect("/login");
	}
}

module.exports = middleware;