import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { RideController } from "./ride.controller";

const router = Router();

router.post(
  "/request",
  checkAuth(UserRole.Rider),
  RideController.createRideRequest
);

router.get(
  "/all-rides",
  checkAuth(UserRole.Admin, UserRole.Driver),
  RideController.getAllRides
);

// router.get("/:id", checkAuth(UserRole.Driver), RideController.getRideById);

router.get(
  "/rideHistory",
  checkAuth(UserRole.Rider),
  RideController.getRideHistory
);

router.patch(
  "/:id/action",
  checkAuth(UserRole.Driver),
  RideController.handleRideAction
);

// router.patch(
//   "/:id/updateStatus",
//   checkAuth(UserRole.Driver),
//   RideController.updateRideStatus
// );
router.patch(
  "/:id/status",
  checkAuth(UserRole.Driver),
  RideController.updateRideStatus
);

router.get(
  "/earnings",
  checkAuth(UserRole.Driver),
  RideController.getDriverEarningsController
);
router.get(
  "/active-ride",
  checkAuth(UserRole.Driver),
  RideController.getActiveRide
);

export const RideRoutes = router;
