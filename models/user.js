var mongoose = require('../models/db');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    username: {
        type: String
    },
    email:{ type: String },
    password: { type: String },
    name: { type: String },
    profileimage: { type: String }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    userModel: User,
    createUser: function(user, callback){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(user.password, salt, function(err, hash){
                user.password = hash;
                user.save(callback);
            });
        });
    },
    getUserById: function(id, callback){
        User.findById(id, callback);
    },
    getUserByUsername: function(username, callback){
        var query = { username: username };
        User.findOne(query, callback);
    },
    comparePassword: function(candPassword, hash, callback){
        bcrypt.compare(candPassword, hash, function(err, isMatch){
            callback(null, isMatch);
        });
    }
};
