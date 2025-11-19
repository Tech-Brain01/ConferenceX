import express from "express";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

import {
  createRefundRequestController,
  getRefundsByUserController,
  getAllRefundsForAdminController,
  getRefundDetailsForAdminController,
  processRefundController,
} from "../controller/RefundController.js";

const router = express.Router();

router.post("/create", authenticateJWT, createRefundRequestController);

router.get("/my-refunds", authenticateJWT, getRefundsByUserController);

router.get(
  "/admin/all",
  authenticateJWT,
  isAdmin,
  getAllRefundsForAdminController
);

router.get(
  "/admin/details/:id",
  authenticateJWT,
  isAdmin,
  getRefundDetailsForAdminController
);

router.put(
  "/admin/process/:id",
  authenticateJWT,
  isAdmin,
  processRefundController
);
export default router;
