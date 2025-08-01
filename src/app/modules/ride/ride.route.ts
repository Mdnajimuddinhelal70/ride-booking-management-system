import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { RideController } from "./ride.controller";

const router = Router();

router.post("/", checkAuth(UserRole.Rider), RideController.createRide);

router.get("/all-rides", checkAuth(UserRole.Admin), RideController.getAllRides);

router.patch(
  "/:id/cancel",
  checkAuth(UserRole.Rider),
  RideController.cancelRide
);

router.patch(
  "/:id/accept",
  checkAuth(UserRole.Driver),
  RideController.acceptRide
);
router.patch(
  "/:id/reject",
  checkAuth(UserRole.Driver),
  RideController.rejectRide
);
router.patch(
  "/status/:rideId",
  checkAuth(UserRole.Driver, UserRole.Admin),
  RideController.updateRideStatus
);
router.get(
  "/earnings",
  checkAuth(UserRole.Driver),
  RideController.getDriverEarningsController
);

export const RideRoutes = router;
