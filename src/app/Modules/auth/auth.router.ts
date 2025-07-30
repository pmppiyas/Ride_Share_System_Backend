import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import passport from "passport";
import { AUthControllers } from "./auth.controller";

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    AUthControllers.googleCallback
  )
);

export const AuthRoutes = router;
