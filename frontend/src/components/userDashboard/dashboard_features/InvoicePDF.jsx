import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    backgroundColor: "#fff",
    color: "#333",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    color: "#2e86de",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  bold: { fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #999",
    marginTop: 10,
  },
  tableRow: { flexDirection: "row", marginVertical: 5 },
  cell: { width: "25%" },
  footer: { textAlign: "center", marginTop: 20, fontSize: 10 },
});

const InvoiceDocument = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Hall Booking Invoice</Text>

      {/* Invoice Header */}
      <View style={styles.section}>
        <Text>
          <Text style={styles.bold}>Invoice No:</Text> {invoice.invoices_number}
        </Text>
        <Text>
          <Text style={styles.bold}>Booking Ref:</Text> {invoice.booking_ref}
        </Text>
        <Text>
          <Text style={styles.bold}>Issued:</Text>{" "}
          {new Date(invoice.issue_date).toLocaleDateString()}
        </Text>
        <Text>
          <Text style={styles.bold}>Due:</Text>{" "}
          {new Date(invoice.due_date).toLocaleDateString()}
        </Text>
        <Text>
          <Text style={styles.bold}>Status:</Text> {invoice.status}
        </Text>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <Text style={styles.bold}>Billed To:</Text>
        <Text>{invoice.user_name}</Text>
        <Text>{invoice.user_email}</Text>
      </View>

      {/* Room Info */}
      <View style={styles.section}>
        <Text style={styles.bold}>Room Details:</Text>
        <Text>{invoice.room_name}</Text>
        <Text>Location: {invoice.room_location}</Text>
        <Text>Price: ₹{invoice.room_price}</Text>
      </View>

      {/* Amount Summary */}
      <View style={styles.section}>
        <Text style={styles.bold}>Amount Summary</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.bold]}>Description</Text>
          <Text style={[styles.cell, styles.bold]}>Amount</Text>
          <Text style={[styles.cell, styles.bold]}>Tax</Text>
          <Text style={[styles.cell, styles.bold]}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>Room Booking</Text>
          <Text style={styles.cell}>₹{invoice.amount}</Text>
          <Text style={styles.cell}>₹{invoice.tax}</Text>
          <Text style={styles.cell}>₹{invoice.total_amount}</Text>
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
    fileName={`invoice_${invoice.invoices_number}.pdf`}
    style={{
      backgroundColor: "#2e86de",
      color: "white",
      padding: "6px 12px",
      borderRadius: "5px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    {({ loading }) => (loading ? "Generating..." : "Download PDF")}
  </PDFDownloadLink>
);

export default InvoicePDF;
