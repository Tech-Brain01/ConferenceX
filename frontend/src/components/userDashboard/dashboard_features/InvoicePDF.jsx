import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    color: "#1d4ed8",
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    borderBottom: "1px solid #e5e7eb",
  },
  bold: { fontWeight: "bold" },
  headerText: { fontSize: 14, marginBottom: 5 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "2px solid #9ca3af",
    paddingBottom: 5,
    marginTop: 10,
    backgroundColor: "#e0e7ff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottom: "1px solid #e5e7eb",
  },
  cell: { width: "25%", fontSize: 12 },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTop: "2px solid #9ca3af",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 10,
    color: "#6b7280",
  },
});

const InvoiceDocument = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Hall Booking Invoice</Text>

      {/* Invoice Header */}
      <View style={styles.section}>
        <Text style={styles.headerText}>
          <Text style={styles.bold}>Invoice No:</Text> {invoice.invoice_no}
        </Text>
        <Text style={styles.headerText}>
          <Text style={styles.bold}>Booking Ref:</Text> {invoice.booking_ref}
        </Text>
        <Text style={styles.headerText}>
          <Text style={styles.bold}>Issued:</Text>{" "}
          {new Date(invoice.issue_date).toLocaleDateString()}
        </Text>
        <Text style={styles.headerText}>
          <Text style={styles.bold}>Status:</Text> {invoice.status}
        </Text>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <Text style={[styles.bold, { marginBottom: 5 }]}>Billed To:</Text>
        <Text>{invoice.user_name}</Text>
        <Text>{invoice.user_email}</Text>
      </View>

      {/* Room Info */}
      <View style={styles.section}>
        <Text style={[styles.bold, { marginBottom: 5 }]}>Room Details:</Text>
        <Text>{invoice.room_name}</Text>
        <Text>Location: {invoice.room_location}</Text>
        <Text>Price: ₹{invoice.room_price}</Text>
      </View>

      {/* Amount Summary */}
      <View style={styles.section}>
        <Text style={[styles.bold, { marginBottom: 5 }]}>Amount Summary</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.bold]}>Description</Text>
          <Text style={[styles.cell, styles.bold]}>Amount</Text>
          <Text style={[styles.cell, styles.bold]}>Tax</Text>
          <Text style={[styles.cell, styles.bold]}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>Room Booking</Text>
          <Text style={styles.cell}>₹{invoice.amt}</Text>
          <Text style={styles.cell}>₹{invoice.gst}</Text>
          <Text style={styles.cell}>₹{invoice.total_amt}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}>Grand Total</Text>
          <Text style={styles.cell}>₹{invoice.total_amt}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for booking with us!</Text>
        <Text>© 2025 Conference Booking Portal</Text>
      </View>
    </Page>
  </Document>
);

const InvoicePDF = ({ invoice }) => (
  <PDFDownloadLink
    document={<InvoiceDocument invoice={invoice} />}
    fileName={`invoice_${invoice.invoice_no}.pdf`}
    style={{
      backgroundColor: "#1d4ed8",
      color: "white",
      padding: "8px 16px",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    {({ loading }) => (loading ? "Generating..." : "Download PDF")}
  </PDFDownloadLink>
);

export default InvoicePDF;
