import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.routes";
import { AuthRoutes } from "../Modules/auth/auth.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
