import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/getAdminOverview", AdminController.getAdminOverview);

export const AdminRouter = router;
