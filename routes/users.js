var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var User = require('../models/user');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

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
        password: req.body.password,
        password2: req.body.password2
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
        var newUser = new User.userModel({
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

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in.');
    res.redirect('/');
});

passport.use(new localStrategy(function(username, password, done){
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user) return done(null, false, {message:'Unknow user'});
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err)
                throw err;
            if(isMatch)
                return done(null, user);
            else
                return done(null, false, {message: 'Invalid password'});
        })
    });
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
        done(err, user);
    });
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.get('/logout', function(req, res){
    console.log('trying to logged out!!!!!!!!!!!!!!!!');
    req.logout();
    console.log('logged out!!!!!!!!!!!!!!!!');
    req.flash('success', 'You are successfully logged out');
    res.redirect('/users/login');
});

module.exports = router;
