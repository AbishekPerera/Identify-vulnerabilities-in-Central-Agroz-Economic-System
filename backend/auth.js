import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '672556296509-9ck6jcp8p17k9v9pm4h524naguuv9qgc.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8075/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})