import ExcelJS from "exceljs";

// Admin: Export bookings to Excel
router.get("/bookings/export", authenticateJWT, isAdmin, async (req, res) => {
  try {
    // Optional: filter by status
    const { status } = req.query;

    let sql = `SELECT b.start_date, b.start_time, b.end_date, b.end_time, b.status, b.payment_status, b.phone_number,
                      u.name AS user_name, u.email, r.name AS room_name
               FROM bookings b
               JOIN users u ON b.user_id = u.id
               JOIN rooms r ON b.room_id = r.id`;

    const params = [];
    if (status) {
      sql += " WHERE b.status = $1";
      params.push(status);
    }

    sql += " ORDER BY b.start_date DESC";

    const result = await pool.query(sql, params);
    const bookings = result.rows;

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bookings");

    // Define columns
    worksheet.columns = [
      { header: "Room Name", key: "room_name", width: 20 },
      { header: "User Name", key: "user_name", width: 20 },
      { header: "Phone Number", key: "phone_number", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Start Date & Time", key: "start_datetime", width: 25 },
      { header: "End Date & Time", key: "end_datetime", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Payment Status", key: "payment_status", width: 15 },
    ];

    // Add rows
    bookings.forEach((b) => {
      worksheet.addRow({
        room_name: b.room_name,
        user_name: b.user_name,
        phone_number: b.phone_number,
        email: b.email,
        start_datetime: `${b.start_date} ${b.start_time}`,
        end_datetime: `${b.end_date} ${b.end_time}`,
        status: b.status,
        payment_status: b.payment_status,
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bookings.xlsx`
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
