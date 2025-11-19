import cron from "node-cron";
import pool from "../models/db.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await pool.query(`
      UPDATE bookings
      SET status = 'cancelled',
          reject_response = 'Payment window expired (2 hours)'
      WHERE status = 'approved'
        AND payment_status = 'unpaid'
        AND approved_at <= NOW() - INTERVAL '2 HOURS'
    `);

    if (result.rowCount > 0) {
      console.log(`${result.rowCount} bookings auto-rejected after 2 hours.`);
    } else {
      console.log("No expired unpaid bookings found.");
    }
  } catch (error) {
    console.error("Error running booking cron job:", error.message);
  }
});