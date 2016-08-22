var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.post('/register', upload.single('profileimage'), function(req, res, next){
    var userdata = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,  //!!!
        password2: req.body.password2 //!!!
    };

    //console.log(req.file);

    if(req.file){
        console.log('Uploading file [...]');
        var profileimage = req.file.filename;
    } else {
        console.log('No file uploaded.');
        var profileimage = 'noimage.jpg';
    }

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords not match').equals(userdata.password);

    //Check errors
    var errors = req.validationErrors();

    if(errors){
        console.log('Errors');
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: userdata.name,
            email: userdata.email,
            password: userdata.password,
            username: userdata.username,
            profileimage: profileimage
        });
        User.createUser(newUser, function(error, user){
            if(error) throw error;
            console.log(user);
        });
        res.location('/');
        res.redirect('/');
    }
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

module.exports = router;
