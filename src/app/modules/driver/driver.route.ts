import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { RideController } from "./../rider/ride.controller";
import { DriverController } from "./driver.controller";

const router = Router();
router.get(
  "/",
  checkAuth(UserRole.Admin, UserRole.Driver),
  DriverController.getDrivers
);
router.get(
  "/rideHistory",
  checkAuth(UserRole.Rider),
  RideController.getRideHistory
);
// router.patch(
//   "/:id/availability",
//   checkAuth(UserRole.Driver),
//   DriverController.updateAvailability
// );
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
