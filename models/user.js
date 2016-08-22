var mongoose = require('../models/db');
var bcrypt = require('bcryptjs');

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
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
            user.password = hash;
            user.save(callback);
        });
    });

};
