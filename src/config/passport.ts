/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Rider } from "../app/Modules/rider/rider.model";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envVars } from "./env";

import { Role } from "../app/Modules/rider/rider.interfaces";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await Rider.findOne({ email });

        if (!user) {
          user = await Rider.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            role: Role.RIDER,
            auths: [
              {
                provider: profile.provider,
                providerId: profile.id || profile._json.sub,
              },
            ],
          });
        } else {
          const alreadyLinked = user.auths?.some(
            (a) => a.provider === "google" && a.providerId === profile.id
          );

          if (!alreadyLinked) {
            if (!user.auths) {
              user.auths = [];
            }
            const providerId = profile.id || profile._json?.sub;

            if (!providerId) {
              return done(null, false, { message: "No provider ID found" });
            }

            user.auths.push({
              provider: profile.provider,
              providerId: providerId,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await Rider.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialization error:", error);
    done(error, null);
  }
});
