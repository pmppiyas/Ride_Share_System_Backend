import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../rider/rider.interfaces";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

router.post("/logout", AuthControllers.logout);

router.post("/refresh-token", AuthControllers.getNewAccessToken);

router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

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
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallback
);
export const AuthRoutes = router;
