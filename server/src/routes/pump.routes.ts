import { Router } from "express";
import { pumpController } from "../controllers/pump.controller";

const router = Router();

router.post("/on", (req, res, next) => pumpController.turnOn(req, res, next));
router.post("/off", (req, res, next) => pumpController.turnOff(req, res, next));

export default router;
