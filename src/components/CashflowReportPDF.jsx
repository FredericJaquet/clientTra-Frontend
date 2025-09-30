import React from "react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 20,
    fontFamily: "Helvetica"
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
    border: "1px solid #2563eb",
    padding: 5,
    borderRadius: 5
  },
  total: {
    textAlign: "right",
    marginVertical: 5,
    fontSize: 12,
    fontWeight: "bold"
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 5,
    fontWeight: "bold",
    borderBottom: "1px solid #2563eb",
    paddingBottom: 3,
    marginTop: 3
  },
  row: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 4,
    marginBottom: 2
  },
  cell: { flex: 1 },
  cellWide: { flex: 2 },
  cellRight: { flex: 1, textAlign: "right" },
  customer: {
    marginTop: 8,
    marginBottom: 3,
    padding: 4,
    border: "1px solid #2563eb",
    borderRadius: 4,
    fontWeight: "bold",
    flexDirection: "row",
    wrap: false
  },
  invoiceRowEven: {
    flexDirection: "row",
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
    padding: 3
  },
  invoiceRowOdd: {
    flexDirection: "row",
    backgroundColor: "#dbeafe",
    borderRadius: 4,
    padding: 3
  }
});

const CashflowReportPDF = ({ t, title, startDate, endDate, report }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Title */}
      <Text style={styles.title} fixed>
        {title}: {t("reports.date_from")}{" "}
        {new Date(startDate).toLocaleDateString("es-ES")} {t("reports.date_to")}{" "}
        {new Date(endDate).toLocaleDateString("es-ES")}
      </Text>

      {/* Total */}
      <Text style={styles.total}>
        {t("reports.total")}: {report.grandTotalNet?.toFixed(2)}€
      </Text>

      {/* fixed Header */}
      <View style={styles.headerRow} fixed>
        <Text style={styles.cellWide}>{t("reports.customer")}</Text>
        <Text style={styles.cellRight}>{t("reports.total_net")}</Text>
        <Text style={styles.cellRight}>{t("reports.total_vat")}</Text>
        <Text style={styles.cellRight}>{t("reports.total_withholding")}</Text>
      </View>

      {/* Customers + Invoices */}
      {report.parties?.map((party) => (
        <View key={party.idCompany} wrap={false}>
          {/* Customer */}
          <View style={styles.customer}>
            <Text style={styles.cellWide}>{party.legalName} / {party.vatNumber}</Text>
            <Text style={styles.cellRight}>
              {party.totalNet?.toFixed(2)}€
            </Text>
            <Text style={styles.cellRight}>
              {party.totalVat?.toFixed(2)}€
            </Text>
            <Text style={styles.cellRight}>
              {party.totalWithholding?.toFixed(2)}€
            </Text>
          </View>

          {/* Invoices */}
          <View style={{ marginLeft: 10 }}>
            {party.invoices?.map((invoice, index) => (
              <View
                key={invoice.invoiceNumber}
                style={
                  index % 2 === 0 ? styles.invoiceRowEven : styles.invoiceRowOdd
                }
              >
                <Text style={styles.cell}>{invoice.invoiceNumber}</Text>
                <Text style={styles.cell}>
                  {new Date(invoice.docDate).toLocaleDateString("es-ES")}
                </Text>
                <Text style={styles.cellRight}>
                  {invoice.totalNet?.toFixed(2)}€
                </Text>
                <Text style={styles.cellRight}>
                  {invoice.totalVat?.toFixed(2)}€
                </Text>
                <Text style={styles.cellRight}>
                  {invoice.totalWithholding?.toFixed(2)}€
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default CashflowReportPDF;
