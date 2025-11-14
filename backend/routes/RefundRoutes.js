import express from "express";
import { authenticateJWT, isAdmin } from "../middleware/auth.js";

import { submitRefund, getMyRefundRequests } from "./refund.controller.js";
import { 
  getAllRefundRequests,
  approveFullRefund,
  approvePartialRefund,
  rejectRefund
} from "../controller/RefundAdminController.js";

const router = express.Router();

// user route
router.post("/request", authenticateJWT, submitRefund);
router.get("/my-requests", authenticateJWT, getMyRefundRequests);

// Admin Route
router.get("/admin/all", authenticateJWT, isAdmin, getAllRefundRequests);

router.put("/admin/approve/full/:id", authenticateJWT, isAdmin, approveFullRefund);
router.put("/admin/approve/partial/:id", authenticateJWT, isAdmin, approvePartialRefund);
router.put("/admin/reject/:id", authenticateJWT, isAdmin, rejectRefund);

export default router;
