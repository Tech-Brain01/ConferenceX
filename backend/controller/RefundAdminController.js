import RefundModel from "../models/Refund.js";

export const getAllRefundRequests = async (req, res) => {
  try {
    const result = await RefundModel.getAllRefunds();
    res.status(200).json(result.rows);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const approveFullRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { total_amount, admin_reason } = req.body;

    const result = await RefundModel.updateRefundStatus(
      id,
      "Approved",
      total_amount,
      admin_reason
    );

    res.status(200).json({ message: "Full refund approved", data: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const approvePartialRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refund_amount, admin_reason } = req.body;

    const result = await RefundModel.updateRefundStatus(
      id,
      "Partial",
      refund_amount,
      admin_reason
    );

    res.status(200).json({ message: "Partial refund approved", data: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const rejectRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_reason } = req.body;

    const result = await RefundModel.updateRefundStatus(
      id,
      "Rejected",
      null,
      admin_reason
    );

    res.status(200).json({ message: "Refund rejected", data: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
