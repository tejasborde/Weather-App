  
const User = require("../models/user");



middleware = {};

middleware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect("/login");
	}
}

module.exports = middleware;