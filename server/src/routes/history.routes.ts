import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/", (req, res, next) => analyticsController.getHistory(req, res, next));
router.get("/statistics", (req, res, next) => analyticsController.getStatistics(req, res, next));

export default router;
