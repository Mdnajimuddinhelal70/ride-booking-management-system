import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { DriverController } from "./driver.controller";

const router = Router();
router.get(
  "/",
  checkAuth(UserRole.Admin, UserRole.Driver),
  DriverController.getDrivers
);

router.get("/requested", DriverController.getRequestedRides);

router.patch(
  "/availability",
  checkAuth(UserRole.Driver),
  DriverController.updateAvailability
);

router.patch(
  "/:id/update-status",
  checkAuth(UserRole.Admin, UserRole.Driver),
  DriverController.updateStatus
);

export const DriverRoute = router;
