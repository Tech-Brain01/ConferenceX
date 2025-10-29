import {
  getTotalUserBookings,
  getTotalAmountSpend,
  getUserBookingTrend,
  getAllFeedback,
  getUserHistory,
  getInvoicesByUser
} from "../models/UserDashboardModel.js";

export const getUserDashboardStatsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const totaluserbookings = await getTotalUserBookings(
      userId,
      fromDate,
      toDate
    );
    const totalamountspend = await getTotalAmountSpend(
      userId,
      fromDate,
      toDate
    );

    res.json({ totaluserbookings, totalamountspend });
  } catch (err) {
    console.error("Error fetching user dashboard stats:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserBookingTrendController = async (req, res) => {
  try {
    const userId = req.user.id;
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const userBookingTrend = await getUserBookingTrend(
      userId,
      fromDate,
      toDate
    );

    res.json( userBookingTrend );
  } catch (err) {
    console.error("Error fetching user booking stats:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserFeedbackController = async (req, res) => {
  try {
    const userId = req.user.id;
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    console.log("userId:", userId);
    console.log("from:", fromDate, "to:", toDate);
    const feedbackData = await getAllFeedback(userId, fromDate, toDate);
    console.log(" result count:", feedbackData.length);
    console.log(" first record:", feedbackData[0]);

    res.json(feedbackData);
  } catch (err) {
    console.error("Error fetching user feedback:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserHistoryController = async (req,res) => {
    try {
        const userId = req.user.id;
        const fromDate = req.query.from || null;
        const toDate = req.query.to || null;

        const userHistory = await getUserHistory(userId , fromDate , toDate);
        //  console.log(" result count:", userHistory.length);
        //  console.log(" first record:", userHistory[0]);
        res.json(userHistory);

    } catch (err) {
        console.error("Error fetching user's feedback:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserInvoicesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    console.log("[INVOICE DEBUG] userId:", userId);
    console.log("[INVOICE DEBUG] from:", fromDate, "to:", toDate);

    const userInvoices = await getInvoicesByUser(userId, fromDate, toDate);
    console.log(" [INVOICE DEBUG] result count:", userInvoices.length);
    console.log("[INVOICE DEBUG] first record:", userInvoices[0]);

    res.json(userInvoices);
  } catch (err) {
    console.error("Error fetching user invoices:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
