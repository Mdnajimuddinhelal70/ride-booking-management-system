import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { AdminController } from "./admin.controller";

const router = Router();
router.get("/users", checkAuth(UserRole.Admin), AdminController.getAllUsers);
router.patch(
  "/user/:id/status",
  checkAuth(UserRole.Admin),
  AdminController.updateUserStatus
);
router.patch(
  "/driver/:id/approval",
  checkAuth(UserRole.Admin),
  AdminController.updateDriverApproval
);
router.get("/all", checkAuth(UserRole.Admin), AdminController.getAllRides);

export const AdminRoutes = router;
