const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const bcrypt = require("bcryptjs");
const jwtSecret = require("./jwt.config");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

// var opts = {};
// opts.jwtFromRequest = function (req) {
//   // tell passport to read JWT from cookies
//   var token = null;
//   if (req && req.cookies) {
//     token = req.cookies["jwt"];
//   }
//   return token;
// };
// opts.secretOrKey = jwtSecret.secret;

// // main authentication, our app will rely on it
// passport.use(
//   new JWTstrategy(opts, function (jwt_payload, done) {
//     console.log("JWT BASED AUTH GETTING CALLED"); // called everytime a protected URL is being served

//     console.log(jwt_payload);
//     if (CheckUser(jwt_payload.data)) {
//       return done(null, jwt_payload.data);
//     } else {
//       // user account doesnt exists in the DATA
//       return done(null, false);
//     }
//   })
// );

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      var userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
        provider: profile.provider,
        photo: profile.photos[0].value,
        isVerified: profile._json.email_verified,
      };

      done(null, userData);
    }
  )
);
