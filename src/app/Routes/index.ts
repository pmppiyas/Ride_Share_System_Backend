import { Router } from "express";
import { RiderRoutes } from "./../Modules/rider/rider.routes";
import { AuthRoutes } from "../Modules/auth/auth.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/rider",
    route: RiderRoutes,
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
