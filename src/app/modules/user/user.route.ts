import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";
import { UserRole } from "./user.interface";

const router = Router();

router.post("/register", UserControllers.createUser);
router.get(
  "/all-users",
  checkAuth(UserRole.Admin),
  UserControllers.getAllUsers
);
router.patch(
  "/update-profile",
  checkAuth(...Object.values(UserRole)),
  UserControllers.updateProfile
);

router.get("/me", checkAuth(...Object.values(UserRole)), UserControllers.getMe);
router.patch(
  "/block-unblock/:id",
  checkAuth(UserRole.Admin),
  UserControllers.blockOrUnblockUser
);

export const UserRoutes = router;
