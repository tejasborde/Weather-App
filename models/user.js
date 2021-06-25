const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const dotenv=require('dotenv').config();



mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 32,
        unique: true,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: String
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);