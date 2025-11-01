import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { RideController } from "./ride.controller";

const router = Router();

router.post("/request", checkAuth(UserRole.Rider), RideController.createRide);

router.get("/all-rides", checkAuth(UserRole.Admin), RideController.getAllRides);

router.get(
  "/rideHistory",
  checkAuth(UserRole.Rider),
  RideController.getRideHistory
);
router.patch(
  "/:id/cancel",
  checkAuth(UserRole.Rider),
  RideController.cancelRide
);

router.patch(
  ":id/action",
  checkAuth(UserRole.Driver),
  RideController.handleRideAction
);

router.get(
  "/earnings",
  checkAuth(UserRole.Driver),
  RideController.getDriverEarningsController
);

export const RideRoutes = router;
