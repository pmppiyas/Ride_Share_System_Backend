import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import passport from "passport";

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

export const AuthRoutes = router;
