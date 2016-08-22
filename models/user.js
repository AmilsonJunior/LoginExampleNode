var mongoose = require('../models/db'); //db holds everything about your mongo connection.
/*
 db.js =>
    var mongoose = require('mongoose');
    mongoose.connect('YOUR_MONGO_CONNECTION');
    var db = mongoose.connection;
    module.exports = mongoose;
*/

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    email:{ type: String },
    password: { type: String },
    name: { type: String },
    profileimage: { type: String }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(user, callback){
    user.save(callback);
};
