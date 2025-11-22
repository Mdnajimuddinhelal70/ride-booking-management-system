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
//============================================
router.get("/summary", checkAuth(UserRole.Admin), AdminController.summary);
router.get("/trends", checkAuth(UserRole.Admin), AdminController.trends);
router.get("/drivers", checkAuth(UserRole.Admin), AdminController.topDrivers);
router.put(
  "/:id/profile",
  checkAuth(UserRole.Admin),
  AdminController.updateProfile
);
router.put(
  "/:id/change-password",
  checkAuth(UserRole.Admin),
  AdminController.changePassword
);
export const AdminRoutes = router;
