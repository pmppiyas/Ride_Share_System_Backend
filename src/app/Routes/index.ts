import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.routes";
import { AuthRoutes } from "../Modules/auth/auth.router";
import { DriverRoutes } from "../Modules/driver/driver.router";

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
  {
    path: "/driver",
    route: DriverRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
