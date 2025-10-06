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
    const bookingsResult = await getTotalBookings();
    const revenueResult = await getTotalRevenue();
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
    const rooms = await getBookedRooms();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUpcomingBookingsController = async (req, res) => {
  try {
    const upcomingBookings = await getUpcomingBookings();
    res.json(upcomingBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingTrendsController = async (req, res) => {
  try {
    const filter = req.query.filter || "week";
    const fromDate = req.query.from;
    const toDate = req.query.to;

    const trends = await getBookingTrends(filter, fromDate, toDate);
    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCancelledvsApprovedTrendController = async (req, res) => {
  try {
    const filter = req.query.filter || "week";
    const fromDate = req.query.from;
    const toDate = req.query.to;

    const trend = await getCancelledvsApprovedTrend(filter, fromDate, toDate);
    res.json(trend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRevenueTrendsController = async (req, res) => {
  try {
    const filter = req.query.filter || "week";
    const fromDate = req.query.from;
    const toDate = req.query.to;

    const trends = await getRevenueTrends(filter, fromDate, toDate);
    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRevenueByRoomController = async (req, res) => {
  try {
    const revenueByRoom = await getRevenueByRoom();
    res.json(revenueByRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRevenueLossFromCancellationsController = async (req, res) => {
  try {
    const loss = await getRevenueLossFromCancellations();
    res.json({ revenueloss: loss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


