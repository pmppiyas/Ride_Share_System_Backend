/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Rider } from "../app/Modules/rider/rider.model";

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await Rider.findById(id);
    done(null, user);
    console.log(user);
  } catch (error) {
    console.error("Deserialization error:", error);
    done(error, null);
  }
});
