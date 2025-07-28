import { Router } from "express";
import { RiderRoutes } from "./../Modules/rider/rider.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/rider",
    route: RiderRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
