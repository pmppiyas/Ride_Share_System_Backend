import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interfaces";
import { UserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(UserZodSchema),
  UserController.createUser
);

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.getAllUsers
);

router.get(
  "/single/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.getSingleUser
);

router.patch(
  "/update/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DRIVER, Role.RIDER),
  validateRequest(UserZodSchema.partial()),
  UserController.updateUser
);

router.delete(
  "/delete/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DRIVER, Role.RIDER),
  UserController.deleteUser
);

export const UserRoutes = router;
