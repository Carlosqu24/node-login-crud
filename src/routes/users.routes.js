const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport')

router.get('/users/signin', (req, res) => {
      res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
      successRedirect: '/games/',
      failureRedirect: '/users/signin',
      failureFlash: true
}));

router.get('/users/signup', (req, res) => {
      res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
      const { username, email, password, confirm_password } = req.body;

      const errors = [];

      if(username.length <= 0){ 
            errors.push({
                  text: 'Insert an username'
            });
      }

      if(password != confirm_password) {

            errors.push({
                  text: 'Password do not match'
            });
      };

      if(password.length < 4) {
            errors.push({
                  text: 'Password must be at leat 4 characters'
            });
      };

      if(errors.length > 0) {
            res.render('users/signup', { errors, username, email, password, confirm_password});
      } else {

            const emailUser = await User.findOne({ email: email })

            if(emailUser) {
                  req.flash('error_message', 'The email is already in use');
                  res.redirect('/users/signup')
            }

            const newUser = new User({ username, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();

            req.flash('success_message', 'You are registered');

            res.redirect('/users/signin');
      }

});

router.get('/users/logout', (req, res) => {
      req.logOut();
      res.redirect('/');
});

module.exports = router;