import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

import { addVehicle,getVehicles, updateVehicle,deleteVehicle } from "../controllers/vehicle.controller";

const router = Router();

router.post("/", authMiddleware, addVehicle);

router.get("/", authMiddleware, getVehicles);

router.put("/:id", authMiddleware, updateVehicle);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVehicle
);

export default router;