const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        console.log(accessToken)
        console.log(profile)
    }))
}