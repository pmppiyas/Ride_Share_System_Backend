import { Router } from "express";
import { UserController } from "./user.controller";
import { UserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interfaces";

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
