const mongoose = require("mongoose");

// SCHEMA SETUP
const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

//Compile into a Model
module.exports = mongoose.model("Comment", commentSchema);