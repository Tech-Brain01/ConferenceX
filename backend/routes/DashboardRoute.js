import express from "express";
import {
 getDashboardStatsController,
 getBookedRoomsController,
 getUpcomingBookingsController,
 getBookingTrendsController,
 getCancelledvsApprovedTrendController,
 getRevenueTrendsController,
 getRevenueByRoomController,
 getRevenueLossFromCancellationsController,
 getRevenueByUserController
} from "../controller/DashboardController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";
import {BookingAnalyticsExcelReportController, DashboardExcelReportController, RevenueAnalyticsExcelReportController} from "../controller/ExcelController.js";

import { getUserDashboardStatsController } from "../controller/UserDashboardController.js";


const router = express.Router();


router.get("/stats", authenticateJWT, isAdmin, getDashboardStatsController);
router.get("/room-booking-stats", authenticateJWT , isAdmin, getBookedRoomsController);
router.get("/upcoming-bookings" , authenticateJWT , isAdmin , getUpcomingBookingsController);
router.get('/booking-trends',authenticateJWT , isAdmin, getBookingTrendsController);
router.get("/cancel-approved-trend",authenticateJWT , isAdmin, getCancelledvsApprovedTrendController);
router.get("/revenue",authenticateJWT , isAdmin, getRevenueTrendsController);
router.get("/revenue-by-room",authenticateJWT , isAdmin, getRevenueByRoomController);
router.get("/revenue-by-user",authenticateJWT , isAdmin, getRevenueByUserController)
router.get("/revenue-loss",authenticateJWT , isAdmin, getRevenueLossFromCancellationsController)

router.get("/export-excel-dashboard", authenticateJWT, isAdmin, DashboardExcelReportController);
router.get("/export-excel-booking-analytics", authenticateJWT , isAdmin , BookingAnalyticsExcelReportController);
router.get("/export-excel-revenue-analytics", authenticateJWT , isAdmin , RevenueAnalyticsExcelReportController);


router.get("/stats" , authenticateJWT , getUserDashboardStatsController);

export default router;
