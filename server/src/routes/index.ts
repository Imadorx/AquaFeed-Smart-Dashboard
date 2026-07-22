import { Router } from "express";
import dashboardRoutes from "./dashboard.routes";
import historyRoutes from "./history.routes";
import alertRoutes from "./alert.routes";
import pumpRoutes from "./pump.routes";
import settingsRoutes from "./settings.routes";

const router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/history", historyRoutes);
router.use("/alerts", alertRoutes);
router.use("/pump", pumpRoutes);
router.use("/settings", settingsRoutes);

export default router;
