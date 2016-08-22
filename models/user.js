var mongoose = require('../models/db');

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
