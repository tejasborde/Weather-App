const dotenv=require('dotenv').config();
const express = require("express"),
    router = express.Router({ mergeParams: true }),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    path = require("path"),
    axios = require("axios"),
    flash = require('connect-flash'),
    middleware = require("../middleware");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

router.post('/climate', middleware.isLoggedIn, (req, res) => {

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
        console.log(img_path);
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


router.get('/forecast', middleware.isLoggedIn, (req, res) => {
    req.flash('error',"This feature is not available right now.We are working on it.");
    res.redirect('/');
})

module.exports = router;