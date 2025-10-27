import express from "express";
import { authenticateJWT} from "../middleware/authMiddleware.js";
import { getUserDashboardStatsController , getUserBookingTrendController , getUserFeedbackController , getUserHistoryController , getUserInvoicesController} from "../controller/UserDashboardController.js";


const router = express.Router();

router.get("/stats" , authenticateJWT , getUserDashboardStatsController);
router.get("/booking-stats" , authenticateJWT , getUserBookingTrendController);
router.get("/all-feedback", authenticateJWT , getUserFeedbackController);
router.get("/payment-history", authenticateJWT , getUserHistoryController);
router.get("/download-invoices", authenticateJWT, getUserInvoicesController);

export default router;