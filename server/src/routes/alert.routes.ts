import { Router } from "express";
import { alertController } from "../controllers/alert.controller";

const router = Router();

router.get("/", (req, res, next) => alertController.getActive(req, res, next));
router.get("/history", (req, res, next) => alertController.getHistory(req, res, next));
router.post("/:id/resolve", (req, res, next) => alertController.resolve(req, res, next));

export default router;
