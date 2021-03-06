const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('@models/user/user.model')
const UserHelper = require('@utils/user.helper')
require('dotenv').config()

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username })
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        })
      }

      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Invalid password'
        })
      }

      return done(null, user)
    } catch (e) {
      return done(e)
    }
  })
)

passport.use(
  new GoogleStrategy({
    clientID: process.env.googleClientId,
    clientSecret: process.env.googleClientSecret,
    callbackURL: process.env.APP_URL + '/auth/google/redirect'
  }, async (accessToken, refreshToken, profile, done) => {
    if (!accessToken) {
      return done(null, false, {
        message: 'No access token provided'
      })
    }
    if (!profile || !profile._json) {
      return done(null, false, {
        message: 'No user profile provided'
      })
    }
    const userData = {
      profile: profile._json,
      firstName: profile._json.given_name,
      lastName: profile._json.family_name,
      email: profile._json.email,
      emailVerified: profile._json.email_verified
    }

    if (!userData.email) {
      return done(null, false, {
        message: 'User google email not provided'
      })
    }

    if (!userData.emailVerified) {
      return done(null, false, {
        message: 'User google email is not verified'
      })
    }

    var user = await User.findOne({ email: userData.email })

    if (!user) {
      user = await UserHelper.addUser(userData.email, userData.firstName, userData.lastName, true)
    }
    done(null, user)
  })
)
