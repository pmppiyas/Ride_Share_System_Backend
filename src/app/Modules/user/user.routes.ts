import { Router } from "express";
import { UserController } from "./user.controller";
import { UserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(UserZodSchema),
  UserController.createUser
);

router.get("/", UserController.getAllUsers);

router.patch(
  "/update/:id",
  validateRequest(UserZodSchema.partial()),
  UserController.updateUser
);

router.delete("/delete/:id", UserController.deleteUser);

export const UserRoutes = router;
