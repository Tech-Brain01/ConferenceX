import {
  createRefundRequest,
  getAllRefundsForAdmin,
  getAllRefundsWithBooking,
  getBookingDetailsByRef,
  getRefundByUser,
  processRefund,
  getRefundById,
} from "../models/Refund.js";


export const createRefundRequestController = async (req, res) => {
  try {
    // Get user ID from token
    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.uid ||
      req.user?.userid ||
      null;

    if (!userId) {
      return res.status(401).json({ error: "User ID missing in token" });
    }

    const { bookingRef, txnNo, roomName, reason } = req.body;

    if (!bookingRef || !txnNo || !roomName || !reason) {
      return res.status(400).json({
        error: "bookingRef, txnNo, roomName and reason are required",
      });
    }

    const refundData = {
      userId,
      roomName,
      bookingRef,
      txnNo,
      userReason: reason,
    };

    const refundRequest = await createRefundRequest(refundData);

    return res.status(201).json({
      success: true,
      data: refundRequest,
    });

  } catch (error) {
    console.error("createRefundRequestController:", error);
    return res.status(500).json({ error: "Failed to create refund request" });
  }
};


export const getRefundsByUserController = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({ error: "Invalid user token" });

    const refunds = await getRefundByUser(userId);

    return res.json({
      success: true,
      refunds
    });

  } catch (err) {
    console.error("getRefundsByUserController:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getAllRefundsForAdminController = async (req, res) => {
  try {
    const refunds = await getAllRefundsWithBooking();
    res.json({ success: true, refunds });
  } catch (err) {
    console.error("getAllRefundsForAdminController error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getRefundDetailsForAdminController = async (req, res) => {
  try {
    const refunds = await getAllRefundsForAdmin();

    if (!refunds.length) {
      return res.status(200).json({ message: "No refund requests found." });
    }

    res.status(200).json(refunds);
  } catch (err) {
    console.error('getRefundDetailsForAdminController error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const processRefundController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, partial_amount, admin_reason } = req.body;

    console.log("==== processRefundController called ====");
    console.log("Refund ID:", id);
    console.log("Request body:", req.body);

    // Validate ID
    if (!id) {
      return res.status(400).json({ success: false, error: "Refund ID is required" });
    }

    // Validate status
    const validStatus = ["PENDING", "REJECTED", "APPROVED_FULL", "APPROVED_PARTIAL"];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid or missing status" });
    }

    // Validate refund exists
    const refund = await getRefundById(id);
    if (!refund) {
      return res.status(404).json({ success: false, error: "Refund request not found" });
    }

    // Determine approved amount
    let approvedAmount = null;
    if (status === "APPROVED_PARTIAL") {
      if (partial_amount === undefined || partial_amount === null) {
        return res.status(400).json({ success: false, error: "Partial amount required" });
      }
      if (partial_amount > refund.booking_amount) {
        return res.status(400).json({ success: false, error: "Partial amount cannot exceed booking amount" });
      }
      approvedAmount = partial_amount;
    } else if (status === "APPROVED_FULL") {
      approvedAmount = refund.booking_amount;
    } else if (status === "REJECTED") {
      approvedAmount = 0;
    }

    const updatedRefund = await processRefund(id, status, approvedAmount, admin_reason || null);

    return res.json({ success: true, refund: updatedRefund });

  } catch (err) {
    console.error("processRefundController ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
