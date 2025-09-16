"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../app/Modules/user/user.model");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("./env");
const user_interfaces_1 = require("../app/Modules/user/user.interfaces");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(null, false, { message: "No email found" });
        }
        let user = await user_model_1.User.findOne({ email });
        const defaultCoordinates = [90.3563, 23.685];
        if (!user) {
            user = await user_model_1.User.create({
                email,
                name: profile.displayName,
                profileImage: profile.photos?.[0]?.value,
                location: {
                    type: "Point",
                    coordinates: defaultCoordinates,
                    updatedAt: new Date(),
                },
                role: user_interfaces_1.Role.RIDER,
                auths: [
                    {
                        provider: profile.provider,
                        providerId: profile.id || profile._json.sub,
                    },
                ],
            });
        }
        else {
            const alreadyLinked = user.auths?.some((a) => a.provider === "google" && a.providerId === profile.id);
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
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, async (identifier, password, done) => {
    try {
        const isUserExist = await user_model_1.User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });
        if (!isUserExist) {
            return done(null, false, { message: "User not found." });
        }
        const isGoogleAuthenticated = isUserExist.auths?.some((providerObjects) => providerObjects.provider === "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, {
                message: "You are joined by Google. First login by google and then set a password.",
            });
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(password, isUserExist.password || "");
        if (!isPasswordMatch) {
            return done(null, false, { message: "Password is wrong." });
        }
        return done(null, isUserExist, { message: "Login successfull." });
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
