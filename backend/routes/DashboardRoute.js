import express from "express";
import {
 getDashboardStatsController,
 getBookedRoomsController,
 getUpcomingBookingsController,
 getBookingTrendsController,
 getCancelledvsApprovedTrendController,
 getRevenueTrendsController,
 getRevenueByRoomController,
 getRevenueLossFromCancellationsController
} from "../controller/DashboardController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";
import {BookingAnalyticsExcelReportController, DashboardExcelReportController, RevenueAnalyticsExcelReportController} from "../controller/ExcelController.js";

const router = express.Router();


router.get("/stats", authenticateJWT, isAdmin, getDashboardStatsController);
router.get("/room-booking-stats", authenticateJWT , isAdmin, getBookedRoomsController);
router.get("/upcoming-bookings" , authenticateJWT , isAdmin , getUpcomingBookingsController);
router.get('/booking-trends',authenticateJWT , isAdmin, getBookingTrendsController);
router.get("/cancel-approved-trend",authenticateJWT , isAdmin, getCancelledvsApprovedTrendController);
router.get("/revenue",authenticateJWT , isAdmin, getRevenueTrendsController);
router.get("/revenue-by-room",authenticateJWT , isAdmin, getRevenueByRoomController);
router.get("/revenue-loss",authenticateJWT , isAdmin, getRevenueLossFromCancellationsController)

router.get("/export-excel-dashboard", authenticateJWT, isAdmin, DashboardExcelReportController);
router.get("/export-excel-booking-analytics", authenticateJWT , isAdmin , BookingAnalyticsExcelReportController);
router.get("/export-excel-revenue-analytics", authenticateJWT , isAdmin , RevenueAnalyticsExcelReportController);

export default router;
