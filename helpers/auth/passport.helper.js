const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const { ExtractJwt } = require('passport-jwt')

const config = require('@root/config')
const User = require('@models/user/user.model')
const authHelper = require('@helpers/auth/auth.helper')
// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.auth.secret
}, async (payload, done) => {
  try {
    // find user specified in token
    const userId = payload.sub
    const user = User.findById(userId)

    // if user doesn't exists, handle it
    if (!user) {
      return done(null, false)
    }

    // else return user
    done(null, user)
  } catch (e) {
    done(e, false)
  }
}))

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // find the user with given email
    const user = await User.find({ email: email })

    // if user doesn't exist then handle it
    if (!user) {
      return done(null, false)
    }

    // verify given password
    const hasValidPassword = await authHelper.comparePasswords(password, user.password)

    // if not valid password then handle it
    if (!hasValidPassword) {
      return done(null, false)
    }

    // else return user
    done(null, user)
  } catch (e) {
    done(e, false)
  }
}))

module.exports = passport

// passport.authenticate('jwt', { session: false })
// passport.authenticate('local', { session: false })
