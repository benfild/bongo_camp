var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
// compile into a model
module.exports = mongoose.model("Campground", campgroundSchema);