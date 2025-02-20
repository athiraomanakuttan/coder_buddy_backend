import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user: Express.User, done: (err: any, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done: (err: any, user?: any) => void) => {
  done(null, obj);
});

export default passport;
