const express = require("express"),
    fs = require('fs'),
    router = express.Router({ mergeParams: true });


router.get('/', middleware.isLoggedIn, (req, res) => {
    const text = fs.readFileSync("cities.txt", 'utf-8');
    const cities = text.split('\n');
    res.render('home', { cities });
})


module.exports = router;