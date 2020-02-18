const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('users')

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken)
        // console.log(profile)
        const newUser = {
            googleID: profile.id,
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            image: profile.photos[0].value
        }

        User.findOne({
            googleID: profile.id
        })
        .then(user => { 
            if(user) {
                done(null, user)
            } else {
                new User(newUser)
                .save()
                .then(user => done(null, user))
                .catch(err => console.log(err))
            }
        })
    }))


    // We use these to generate a session with a cookie that expires as soon as the
    // user log out
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}