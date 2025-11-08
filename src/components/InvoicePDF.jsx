import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        fontSize: 10,
        padding: 30,
        backgroundColor: "#f9fafb",
        fontFamily: "Helvetica",
    },
    container: {
        flexDirection: "column",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        minHeight: "100%",
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        position: "relative",
        gap: 6,
        marginBottom: 12,
        marginTop: 12,
        alignItems: "flex-start",
        minHeight: 130
    },
    ownerColumn: {
        flex: 2,
        flexDirection: "column",
    },
    ownerGrid: {
        flexDirection: "column",
        gap: 2,
    },
    customerColumn: {
        width: 165,
        borderWidth: 1,
        borderColor: "#1d4ed8",
        borderRadius: 6,
        padding: 6,
        gap: 6,
        flexDirection: "column",
    },
    row: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 2,
    },
    label: {
        fontWeight: "700",
        color: "#111827",
        fontSize: 9,
        minWidth: 70,
    },
    value: {
        color: "#111827",
        fontSize: 9,
    },
    logo: {
        width: 80,
        height: 80,
        objectFit: "contain",
        marginRight: 10,
    },
    titleBox: {
        position: "absolute",
        left: 0,
        right: "35%",
        bottom: 0,
        borderWidth: 1,
        borderColor: "#1d4ed8",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 2,
    },
    metaLabel: {
        fontWeight: "700",
        color: "#111827",
        fontSize: 9,
        minWidth: 70,
    },
    metaValue: {
        color: "#111827",
        fontSize: 9,
    },
    hr: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginVertical: 8,
    },
    orderContainer: {
       marginBottom: 12,
    },
    orderRow: {
        backgroundColor: "#e5e7eb",
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginBottom: 6,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        fontWeight: "700",
        fontSize: 9
    },
    orderCell: {
        width: "40%",
    },
    orderCellSmall: {
        width: "20%",
        textAlign: "right",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 12,
        paddingRight: 6,
        paddingVertical: 2, 
        marginBottom: 3,
        fontSize: 9
    },
    itemCell: {
        width: "40%",
    },
    itemCellSmall: {
        width: "15%",
        textAlign: "right",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    bankDetails: {
        width: "60%",
        flexDirection: "column",
        gap: 6,
    },
    totals: {
        width: "40%",
        flexDirection: "column",
        gap: 4,
    },
    totalBlock: {
        marginBottom: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 9,
    },
});

const InvoicePDF = ({ invoice, owner, customer, translations, logo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
        <View style={styles.container}>
            <View style={{ flexDirection: "column", flex: 1 }}>
                {/* HEADER */}
                <View style={styles.header} fixed>
                    {/* Owner */}
                    <View style={styles.ownerColumn}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                            {logo && <Image src={logo} style={styles.logo} />}
                            <View style={styles.ownerGrid}>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.name}:</Text>
                                <Text style={styles.value}>{owner.legalName}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.cif}:</Text>
                                <Text style={styles.value}>{owner.vatNumber}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.street}:</Text>
                                <Text style={styles.value}>
                                {owner.addresses[0].street} {owner.addresses[0].stNumber}{" "}
                                {owner.addresses[0].apt}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.cp_city}:</Text>
                                <Text style={styles.value}>
                                {owner.addresses[0].cp}/{owner.addresses[0].city}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.country}:</Text>
                                <Text style={styles.value}>{owner.addresses[0].country}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.email}:</Text>
                                <Text style={styles.value}>{owner.email}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{translations.web}:</Text>
                                <Text style={styles.value}>{owner.web}</Text>
                            </View>
                            </View>
                        </View>
                    </View>

                    {/* Customer */}
                    <View style={styles.customerColumn}>
                        <Text style={styles.label}>{customer.comName}</Text>
                        <Text style={styles.value}>{customer.legalName}</Text>
                        <Text style={styles.value}>{customer.vatNumber}</Text>
                        <Text style={styles.value}>
                            {customer.addresses[0].street} {customer.addresses[0].stNumber}{" "}
                            {customer.addresses[0].apt}
                        </Text>
                        <Text style={styles.value}>
                            {customer.addresses[0].cp}/{customer.addresses[0].city}
                        </Text>
                        <Text style={styles.value}>{customer.addresses[0].country}</Text>
                        <Text style={styles.value}>{customer.email}</Text>
                        <Text style={styles.value}>{customer.web}</Text>
                        </View>

                        {/* Title Factura */}
                        <View style={styles.titleBox}>
                        <Text style={styles.titleText}>{translations.title}</Text>
                    </View>
                </View>

                {/* META */}
                <View style={styles.metaRow} fixed>
                    <View style={{ width: "33%" }}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>{translations.number}:</Text>
                        <Text style={styles.metaValue}>{invoice.docNumber}</Text>
                    </View>
                    </View>
                    <View style={{ width: "33%" }}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>{translations.date}:</Text>
                        <Text style={styles.metaValue}>{invoice.docDate}</Text>
                    </View>
                    </View>
                    <View style={{ width: "33%", alignItems: "flex-end" }}>
                        <Text
                            style={styles.metaValue}
                            render={({ pageNumber, totalPages }) =>
                            `${translations.page} ${pageNumber} ${translations.of} ${totalPages}`
                            }
                            fixed
                        />
                    </View>
                </View>

                <View style={styles.hr} fixed/>

                {/* ORDERS */}
                {invoice.orders.map((order, idx) => (
                <View key={idx} wrap={false} style={styles.orderContainer}>
                    <View>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderCell}>{order.descrip}</Text>
                            <Text style={styles.orderCellSmall}>{order.dateOrder}</Text>
                            <Text style={styles.orderCellSmall}>
                                {order.pricePerUnit.toFixed(2)} {invoice.changeRate?.currency1 || "€"}
                            </Text>
                            <Text style={styles.orderCellSmall}>
                                {order.total.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                        </View>
                        {order.items.map((item, idy) => (
                        <View key={idy} style={styles.itemRow}>
                            <Text style={styles.itemCell}>{item.descrip}</Text>
                            <Text style={styles.itemCellSmall}>{item.qty}</Text>
                            <Text style={styles.itemCellSmall}>{order.units}</Text>
                            <Text style={styles.itemCellSmall}>{(item.discount * 100).toFixed(2)}%</Text>
                            <Text style={styles.itemCellSmall}>
                                {item.total.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                        </View>
                        ))}
                    </View>
                </View>
                ))}
            </View>

            {/* FOOTER */}
            <View style={styles.footer} fixed>
                <View style={styles.bankDetails}>
                    <Text style={styles.label}>{translations.bank_details}:</Text>
                    <Text>{invoice.bankAccount?.iban}</Text>
                    <Text>{invoice.bankAccount?.holder}</Text>
                    <Text>{invoice.bankAccount?.branch}</Text>
                    <Text style={styles.label}>{translations.pay_method}:</Text>
                    <Text>{invoice.notePayment}</Text>
                </View>

                <View style={styles.totals}>
                    {/* Bloque 1 */}
                    <View style={styles.totalBlock}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                            <Text style={styles.label}>{translations.total_net}</Text>
                            <Text style={styles.label}>{translations.vat_rate}</Text>
                            <Text style={styles.label}>{translations.total_vat}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>
                                {invoice.totalNet.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                            <Text>{invoice.vatRate.toFixed(2)}%</Text>
                            <Text>
                                {invoice.totalVat.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                        </View>
                    </View>
                    {/* Bloque 2 */}
                    <View style={styles.totalBlock}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                            <Text style={styles.label}>{translations.withholding}</Text>
                            <Text style={styles.label}>{translations.total_withholding}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>{invoice.withholding.toFixed(2)}%</Text>
                            <Text>
                                {invoice.totalWithholding.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                        </View>
                    </View>
                    {/* Bloque 3 */}
                    <View style={styles.totalBlock}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                            <Text style={styles.label}>{translations.total_gross}</Text>
                            <Text style={styles.label}>{translations.total_to_pay}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>
                                {invoice.totalGross.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                            <Text>
                                {invoice.totalToPay.toFixed(2)}
                                {invoice.changeRate?.currency1 || "€"}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Cambio divisa */}
                    {(invoice.changeRate?.rate || 1) !== 1 && (
                    <View style={styles.totalBlock}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>
                            {invoice.totalGrossInCurrency2.toFixed(2)}
                            {invoice.changeRate?.currency2 || "€"}
                        </Text>
                        <Text>
                            {invoice.totalToPayInCurrency2.toFixed(2)}
                            {invoice.changeRate?.currency2 || "€"}
                        </Text>
                        </View>
                    </View>
                    )}
                </View>
            </View>
        </View>
    </Page>
  </Document>
);

export default InvoicePDF;
