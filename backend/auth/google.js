// auth/google.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.provider = "google";
            await user.save();
          }
        } else {
          user = await User.create({
            email,
            username: "@" + profile.displayName.replace(/\s+/g, "").toLowerCase(),
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            googleId: profile.id,
            provider: "google",
            password: Math.random().toString(36).slice(-8),
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
