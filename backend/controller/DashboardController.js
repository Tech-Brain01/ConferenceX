import {
  getTotalBookings,
  getTotalRevenue,
  getTotalRoom,
  getBookedRooms,
  getUpcomingBookings,
  getBookingTrends,
  getCancelledvsApprovedTrend,
  getRevenueTrends,
  getRevenueByRoom,
  getRevenueLossFromCancellations
} from "../models/DashboardModel.js";

export const getDashboardStatsController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const bookingsResult = await getTotalBookings(fromDate, toDate);
    const revenueResult = await getTotalRevenue(fromDate, toDate);
    const roomResult = await getTotalRoom();

    res.json({
      totalbookings: bookingsResult,
      totalrevenue: revenueResult,
      totalroom: roomResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getBookedRoomsController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;
 
    const rooms = await getBookedRooms(fromDate, toDate);
    res.json(rooms);
  } catch (err) {
    console.error("Server error in getBookedRoomsController:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUpcomingBookingsController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const upcomingBookings = await getUpcomingBookings(fromDate, toDate);
    res.json(upcomingBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingTrendsController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const trends = await getBookingTrends( fromDate, toDate);
    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCancelledvsApprovedTrendController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const trend = await getCancelledvsApprovedTrend( fromDate, toDate);
    res.json(trend);
    console.log("From:", fromDate, "To:", toDate);
   

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRevenueTrendsController = async (req, res) => {
  try {
    
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const trends = await getRevenueTrends( fromDate, toDate);
    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRevenueByRoomController = async (req, res) => {
  try {
    
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const revenueByRoom = await getRevenueByRoom(fromDate , toDate);
    res.json(revenueByRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRevenueLossFromCancellationsController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const loss = await getRevenueLossFromCancellations(fromDate, toDate);
    res.json({ revenueloss: loss });
  } catch (err) {
    console.error("Revenue loss fetch failed:", err.message, err.stack);
    res.status(500).json({ message: "Server error fetching revenue loss" });
  }
};

