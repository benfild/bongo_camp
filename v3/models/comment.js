var mongoose = require("mongoose");

// SCHEMA SETUP
var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

//Compile into a Model
module.exports = mongoose.model("Comment", commentSchema);