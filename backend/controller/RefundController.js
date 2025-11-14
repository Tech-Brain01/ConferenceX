import RefundModel from "../models/Refund.js";

export const submitRefund = async (req, res) => {
  try {
    const { booking_id, reason } = req.body;
    const user_id = req.user.id;

    if (!booking_id || !reason) {
      return res.status(400).json({ error: "booking_id and reason are required" });
    }

    const result = await RefundModel.createRefund(booking_id, user_id, reason);
    res.status(201).json({ message: "Refund request submitted", data: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getMyRefundRequests = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await RefundModel.getRefundsByUser(user_id);

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
