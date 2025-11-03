import ExcelJS from "exceljs";

import {
  getBookedRooms,
  getBookingTrends,
  getCancelledvsApprovedTrend,
  getRevenueByRoom,
  getTotalBookings,
  getTotalRoom,
  getRevenueLossFromCancellations,
  getRevenueTrends,
  getTotalRevenue,
  getUpcomingBookings,
  getRevenueByUser,
} from "../models/DashboardModel.js";

export const DashboardExcelReportController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    // Fetch data as before
    const totalBookings = await getTotalBookings(fromDate, toDate);
    const totalRevenue = await getTotalRevenue(fromDate, toDate);
    const totalRooms = await getTotalRoom(fromDate, toDate);
    const bookedRooms = await getBookedRooms(fromDate, toDate);
    const upcomingBookings = await getUpcomingBookings(fromDate, toDate);
    const bookingTrends = await getBookingTrends(fromDate, toDate);
    const revenueLoss = await getRevenueLossFromCancellations(fromDate, toDate);

    const workbook = new ExcelJS.Workbook();

    const summarySheet = workbook.addWorksheet("Summary");

    summarySheet.columns = [
      { header: "Stats", key: "stats", width: 30 },
      { header: "Value", key: "value", width: 20 },
    ];

    summarySheet.addRows([
      { stats: "Total Bookings", value: totalBookings },
      { stats: "Total Revenue", value: totalRevenue },
      { stats: "Total Rooms", value: totalRooms },
      { stats: "Revenue Loss (Cancellations)", value: revenueLoss },
    ]);

    const summaryHeaderRow = summarySheet.getRow(1);
    summaryHeaderRow.font = {
      bold: true,
      size: 12,
      color: { argb: "FFFFFFFF" },
    };
    summaryHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    summaryHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
    summaryHeaderRow.height = 20;

    summaryHeaderRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    summarySheet.getColumn("value").numFmt = "#,##0";

    summarySheet.views = [{ state: "frozen", ySplit: 1 }];

    const bookedRoomsSheet = workbook.addWorksheet("Booked Rooms");
    bookedRoomsSheet.columns = [
      { header: "Sr no.", key: "no", width: 10 },
      { header: "Room Name", key: "name", width: 30 },
      { header: "Total Bookings", key: "totalbookings", width: 15 },
      { header: "Booking Refs", key: "booking_refs", width: 40 },
      {
        header: "Avg Booking Duration",
        key: "avg_booking_duration",
        width: 20,
      },
    ];

    const index = bookedRooms.map((row,i) => ({
      no: i + 1,
      ...row
    }))
    bookedRoomsSheet.addRows(index);

    const bookedRoomsHeader = bookedRoomsSheet.getRow(1);
    bookedRoomsHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    bookedRoomsHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
    bookedRoomsHeader.alignment = { horizontal: "center", vertical: "middle" };
    bookedRoomsHeader.height = 20;
    bookedRoomsHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    bookedRoomsSheet.views = [{ state: "frozen", ySplit: 1 }];

    const upcomingBookingsSheet = workbook.addWorksheet("Upcoming Bookings");
    upcomingBookingsSheet.columns = [
      { header: "Sr no", key: "no", width: 10 },
      { header: "Room Name", key: "room_name", width: 30 },
      { header: "Booked By", key: "user_name", width: 30 },
      { header: "Start date", key: "start_date", width: 15 },
      { header: "End date", key: "end_date", width: 15 },
      { header: "Booking Status", key: "status", width: 25 },
    ];

    const index1 = upcomingBookings.map((row, i) => ({
      no: i + 1,
      ...row
    }));
    upcomingBookingsSheet.addRows(index1);

    const upcomingHeader = upcomingBookingsSheet.getRow(1);
    upcomingHeader.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    upcomingHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    upcomingHeader.alignment = { horizontal: "center", vertical: "middle" };
    upcomingHeader.height = 20;
    upcomingHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    upcomingBookingsSheet.views = [{ state: "frozen", ySplit: 1 }];

    /** --- Booking Trend Sheet --- **/
    const bookingTrendSheet = workbook.addWorksheet(
      "Booking Trend Basic Detail"
    );
    bookingTrendSheet.columns = [
      {header: "Sr no", key: "no" , width: 10},
      { header: "Room Name", key: "room_names", width: 30 },
      { header: "Total Booking", key: "total_bookings", width: 15 },
      { header: "Booking Start Date", key: "period", width: 20 },
      {header:"Booking End Date", Key: "end_period", width: 20 }
    ];

    const index3 = bookingTrends.map((row , i) => ({
      no: i + 1,
      ...row
    }))
    bookingTrendSheet.addRows(index3);

    const bookingTrendHeader = bookingTrendSheet.getRow(1);
    bookingTrendHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    bookingTrendHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8064A2" }, // Purple
    };
    bookingTrendHeader.alignment = { horizontal: "center", vertical: "middle" };
    bookingTrendHeader.height = 20;
    bookingTrendHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    bookingTrendSheet.views = [{ state: "frozen", ySplit: 1 }];

    /** --- Format numeric columns in Booking Trend Sheet --- **/
    bookingTrendSheet.getColumn("total_bookings").numFmt = "#,##0";
    bookingTrendSheet.getColumn("period").numFmt = "mm-dd-yyyy";

    /** --- Finally generate and send buffer --- **/
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=dashboard-report-${fromDate || "start"}-to-${
        toDate || "end"
      }.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error("Excel report generation failed:", err);
    res.status(500).json({ error: "server error" });
  }
};

export const BookingAnalyticsExcelReportController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const bookingTrends = await getBookingTrends(fromDate, toDate);
    const cancelledvsApprovedTrend = await getCancelledvsApprovedTrend(
      fromDate,
      toDate
    );

    const workbook = new ExcelJS.Workbook();

    /** --- Booking Over Time Trend Detail Sheet --- **/
    const bookingTrendSheet = workbook.addWorksheet(
      "Booking Over Time Trend Detail"
    );

    bookingTrendSheet.columns = [
      { header: "Sr no.", key: "id", width: 10 },
      { header: "Room Name", key: "room_names", width: 30 },
      { header: "User Name", key: "user_names", width: 30 },
      { header: "Total Booking", key: "total_bookings", width: 15 },
      { header: "Booking Refs", key: "booking_refs", width: 40 },
      { header: "Booking Start Date", key: "period", width: 20 },
      { header: "Booking End Date", key: "end_period", width: 20 },
    ];

    const index = bookingTrends.map((row, i) => ({
      id: i + 1,
      ...row,
    }));
    bookingTrendSheet.addRows(index);

    // Style header row
    const bookingTrendHeader = bookingTrendSheet.getRow(1);
    bookingTrendHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    bookingTrendHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2E75B6" },
    };
    bookingTrendHeader.alignment = { horizontal: "center", vertical: "middle" };
    bookingTrendHeader.height = 20;
    bookingTrendHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    bookingTrendSheet.views = [{ state: "frozen", ySplit: 1 }];

    // Number formatting
    bookingTrendSheet.getColumn("total_bookings").numFmt = "#,##0";
    bookingTrendSheet.getColumn("period").numFmt = "d-mm-yyyy";
    bookingTrendSheet.getColumn("end_period").numFmt = "d-m-yyyy";

    /** --- Cancelled vs Approved Trend Sheet --- **/
    const cancelledvsApprovedTrendSheet = workbook.addWorksheet(
      "Cancelled vs Approved Trend"
    );

    cancelledvsApprovedTrendSheet.columns = [
      { header: "Sr no.", key: "id", width: 10 },
      { header: "Room Name", key: "room_names", width: 30 },
      { header: "User Name", key: "user_names", width: 30 },
      { header: "Booking Refs", key: "booking_refs", width: 40 },
      { header: "Booking Start Date", key: "period", width: 20 },
      { header: "Booking End Date", Key: "end_period", width: 20 },
      { header: "Total Approved", key: "approvedbooking", width: 15 },
      { header: "Total Cancelled", key: "cancelledbooking", width: 15 },
    ];

    const dateIndex = cancelledvsApprovedTrend.map((row, i) => ({
      id: i + 1,
      ...row,
    }));
    cancelledvsApprovedTrendSheet.addRows(dateIndex);

    // Style header row
    const cancelApproveHeader = cancelledvsApprovedTrendSheet.getRow(1);
    cancelApproveHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    cancelApproveHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9C0006" }, // Dark Red
    };
    cancelApproveHeader.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cancelApproveHeader.height = 20;
    cancelApproveHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    cancelledvsApprovedTrendSheet.views = [{ state: "frozen", ySplit: 1 }];

    // Number formatting for approved and cancelled columns
    cancelledvsApprovedTrendSheet.getColumn("approvedbooking").numFmt = "#,##0";
    cancelledvsApprovedTrendSheet.getColumn("cancelledbooking").numFmt =
      "#,##0";
    cancelledvsApprovedTrendSheet.getColumn("period").numFmt = "mm-dd-yyyy";

    /** --- Send buffer --- **/
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking-analytics-report-${
        fromDate || "start"
      }-to-${toDate || "end"}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error("Excel report generation failed:", err);
    res.status(500).json({ error: "server error" });
  }
};

export const RevenueAnalyticsExcelReportController = async (req, res) => {
  try {
    const fromDate = req.query.from || null;
    const toDate = req.query.to || null;

    const revenueTrend = await getRevenueTrends(fromDate, toDate);
    const revenueByRoom = await getRevenueByRoom(fromDate, toDate);
    const revenueByUser = await getRevenueByUser(fromDate, toDate);

    const workbook = new ExcelJS.Workbook();

    /** --- Revenue Over Time Trend Detail Sheet --- **/
    const revenueTrendSheet = workbook.addWorksheet(
      "Revenue Over Time Trend Detail"
    );

    revenueTrendSheet.columns = [
      { header: "Sr no", key: "id", width: 10 },
      { header: "Booking Start Date", key: "period", width: 20 },
      { header: "Booking End Date", key: "end_period", width: 20 },
      { header: "Total Booking", key: "total_bookings", width: 15 },
      { header: "Total Revenue", key: "totalrevenue", width: 15 },
      { header: "Room Name", key: "room_names", width: 30 },
      { header: "Total Rooms", key: "total_rooms", width: 15 },
    ];

    const dateindex = revenueTrend.map((row, i) => ({
      id: i + 1,
      ...row,
    }));
    revenueTrendSheet.addRows(dateindex);

    // Style header row
    const revenueTrendHeader = revenueTrendSheet.getRow(1);
    revenueTrendHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    revenueTrendHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2F5597" }, // Dark Blue
    };
    revenueTrendHeader.alignment = { horizontal: "center", vertical: "middle" };
    revenueTrendHeader.height = 20;
    revenueTrendHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    revenueTrendSheet.views = [{ state: "frozen", ySplit: 1 }];

    // Number and date formatting
    revenueTrendSheet.getColumn("period").numFmt = "mm-dd-yyyy";
    revenueTrendSheet.getColumn("total_bookings").numFmt = "#,##0";
    revenueTrendSheet.getColumn("totalrevenue").numFmt = '"$"#,##0.00';

    /** --- Revenue By User Sheet --- **/
    const revenueByUserSheet = workbook.addWorksheet("Revenue By User");

    revenueByUserSheet.columns = [
      { header: "Sr No.", key: "id", width: 10 },
      { header: "User Name", key: "user_name", width: 30 },
      { header: "Booking Refs", key: "booking_refs", width: 40 },
      { header: "Total Bookings", key: "total_bookings", width: 15 },
      { header: "Total Revenue", key: "total_revenue", width: 15 },
    ];

    const dataWithIndex = revenueByUser.map((row, i) => ({
      id: i + 1,
      ...row,
    }));

    revenueByUserSheet.addRows(dataWithIndex);

    // Style header row
    const revenueByUserHeader = revenueByUserSheet.getRow(1);
    revenueByUserHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    revenueByUserHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F497D" },
    };
    revenueByUserHeader.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    revenueByUserHeader.height = 20;
    revenueByUserHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    revenueByUserSheet.views = [{ state: "frozen", ySplit: 1 }];

    // Number formatting
    revenueByUserSheet.getColumn("total_bookings").numFmt = "#,##0";
    revenueByUserSheet.getColumn("total_revenue").numFmt = '"$"#,##0.00';

    /** --- Revenue By Room Sheet --- **/
    const revenueByRoomSheet = workbook.addWorksheet("Revenue By Room");

    revenueByRoomSheet.columns = [
      { header: "Sr No", key: "id", width: 10 },
      { header: "Room Name", key: "room_name", width: 30 },
      { header: "User Names", key: "user_names", width: 30 },
      { header: "Booking Refs", key: "booking_refs", width: 40 },
      { header: "Total Bookings", key: "total_bookings", width: 15 },
      { header: "Total Revenue", key: "totalrevenue", width: 15 },
    ];

    const dataWithIndex2 = revenueByRoom.map((row, i) => ({
      id: i + 1,
      ...row,
    }));
    revenueByRoomSheet.addRows(dataWithIndex2);

    // Style header row
    const revenueByRoomHeader = revenueByRoomSheet.getRow(1);
    revenueByRoomHeader.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    revenueByRoomHeader.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F497D" },
    };
    revenueByRoomHeader.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    revenueByRoomHeader.height = 20;
    revenueByRoomHeader.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    revenueByRoomSheet.views = [{ state: "frozen", ySplit: 1 }];

    // Number formatting
    revenueByRoomSheet.getColumn("total_bookings").numFmt = "#,##0";
    revenueByRoomSheet.getColumn("totalrevenue").numFmt = '"$"#,##0.00';

    /** --- Send buffer --- **/
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=revenue-analytics-report-${
        fromDate || "start"
      }-to-${toDate || "end"}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error("Excel report generation failed:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
};
