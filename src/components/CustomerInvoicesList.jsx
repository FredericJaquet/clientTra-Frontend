import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

function CustomerInvoicesList(){
    const { t } = useTranslation();
    
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [formData, setFormData] = useState({ 
                                        docNumber:"",
                                        docDate: "",
                                        status: "",
                                        docType: "INV_CUST",
                                        language: "",
                                        vatRate: 0.0,
                                        withholding: 0.0,
                                        currency: "",
                                        noteDelivery: "",
                                        notePayment: "",
                                        noteComment: "",
                                        deadline: "",
                                        idChangeRate: 1,
                                        idBankAccount: "",
                                        idCompany: "",
                                        idDocumentParent: "",
                                        orderIds: []
                                    });
    const [error, setError] = useState("");
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState({});
    const [invoiceToDelete, setInvoiceToDelete] = useState({});
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [orders, setOrders] = useState([]);
    const [changeRates, setChangeRates] = useState([]);
    const [selectedChangeRate, setSelectedChangeRate] = useState({});
    const [bankAccounts, setBankAccounts] = useState([]);
    const [lastInvoiceNumber, setLastInvoiceNumber] = useState("");
    const [totals, setTotals] = useState({  
                                        totalNet:0,
                                        totalVat:0,
                                        totalWithholding:0,
                                        totalGross:0,
                                        totalGross2: 0,
                                        totalToPay:0,
                                        totalToPay2: 0});
    const [selectedTab, setSelectedTab] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: "dateOrder", direction: "desc" });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    //Getting invoices for list and customers for select
    useEffect(() => {
        axios
            .get("/customer-invoices")
            .then(
                (response) => {setInvoices(response.data);})
            .catch((err) => console.error(err.response.data.message || "Error"));
        axios
            .get("/customers/minimal-list")
            .then(
                (response) => {
                    setCustomers(response.data);
                })
            .catch((err) => console.error(err.response.data.message || "Error"));
        axios
            .get("/change-rates")
            .then(
                (response) => {setChangeRates(response.data);})
            .catch((err) => console.error(err.response.data.message || "Error"));
        axios
            .get("/owner/bank-accounts")
            .then(
                (response) => {
                    setBankAccounts(response.data);
                })
            .catch((err) => console.error(err.response.data.message || "Error"));
    }, []);

    //Filtering invoices by customer/state
    useEffect(() => {
        let result = invoices;
    
        if (selectedCustomer.comName) {
            result = result.filter(i => i.comName === selectedCustomer.comName);
        }
    
        if (selectedTab === "pending") {
            result = result.filter(i => i.status === "PENDING");
        } else if (selectedTab === "paid") {
            result = result.filter(i => i.status === "PAID");
        }
    
        setFilteredInvoices(result);
    }, [invoices, selectedTab, selectedCustomer]);

    //Calculate totals
    useEffect(() => {
        if(orders.length>0){
            const ordersSelected = orders.filter(o => formData.orderIds.includes(o.idOrder));
            const totalNet = ordersSelected.reduce((sum, o) => sum + Number.parseFloat(o.total || 0), 0);

            const vatValue = Number.parseFloat(formData.vatRate) || 0;
            const vatRate = vatValue < 1 ? vatValue : vatValue / 100;
            
            const withholdingValue = Number.parseFloat(formData.withholding) || 0;
            const withholding = withholdingValue < 1 ? withholdingValue : withholdingValue / 100;
                    
            const totalVat = totalNet *  vatRate;
            const totalWithholding = totalNet * withholding;
            const totalGross = totalNet + totalVat;
            const totalGross2 = totalGross * selectedChangeRate?.rate || 1; 
            const totalToPay = totalGross - totalWithholding;
            const totalTopay2 = totalToPay * selectedChangeRate?.rate || 1;


            setTotals({
                totalNet: totalNet.toFixed(2),
                totalVat: totalVat.toFixed(2),
                totalWithholding: totalWithholding.toFixed(2),
                totalGross: totalGross.toFixed(2),
                totalGross2: totalGross2.toFixed(2),
                totalToPay:  totalToPay.toFixed(2),
                totalToPay2: totalTopay2.toFixed(2)
            })
        }
    }, [formData.orderIds, formData.vatRate, formData.withholding, orders, selectedChangeRate])

    //Sorting columns
    const sortedInvoices = [...filteredInvoices].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    //Handle Add
    const handleAddInvoice = async () => {
        setShowAddForm(true);
        
        setFormData({ 
                    docNumber:"",
                    docDate: "",
                    status: "PENDING",
                    docType: "INV_CUST",
                    language: "",
                    vatRate: 0.0,
                    withholding: 0.0,
                    currency: "€",
                    noteDelivery: "",
                    notePayment: "",
                    noteComment: "",
                    deadline: "",
                    idChangeRate: 1,
                    idBankAccount: "",
                    idCompany: "",
                    idDocumentParent: "",
                    orderIds: []
                    });

        try{
            const response = await axios.get("/customer-invoices/last-number");
            setLastInvoiceNumber(response.data);
        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }

    }

    const handleAddCancel = () =>{
        setShowAddForm(false);
        setSelectedCustomer({});
        setFormData({ 
                    docNumber:"",
                    docDate: "",
                    status: "",
                    docType: "INV_CUST",
                    language: "",
                    vatRate: 0.0,
                    withholding: 0.0,
                    currency: "",
                    noteDelivery: "",
                    notePayment: "",
                    noteComment: "",
                    deadline: "",
                    idChangeRate: 1,
                    idBankAccount: "",
                    idCompany: "",
                    idDocumentParent: "",
                    orderIds: []
                    });
    }

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.docNumber || !formData.docDate) {
            setError(t('error.all_fields_required'));
            return;
        }
        if(totals.totalNet === 0){
            setError(t('error.document_without_Order'));
            return;
        }
        if(!formData.idCompany){
            setError(t('error.no_customer_selected'));
            return;
        }

        try{
            const response = await axios.post(`/customer-invoices/create/${formData.idCompany}`, formData);
            const newInvoice = mapDocument(response.data);

            setInvoices(prevInvoices => {
                const updateInvoices =[...prevInvoices, newInvoice];
                return updateInvoices;
            })

            setShowAddForm(false);
            setSelectedCustomer({});
            setOrders([]);
            setFormData({ 
                        docNumber:"",
                        docDate: "",
                        status: "PENDING",
                        docType: "INV_CUST",
                        language: "",
                        vatRate: 0.0,
                        withholding: 0.0,
                        currency: "",
                        noteDelivery: "",
                        notePayment: "",
                        noteComment: "",
                        deadline: "",
                        idChangeRate: 1,
                        idBankAccount: "",
                        idCompany: "",
                        idDocumentParent: "",
                        orderIds: []
                        });

        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || t('error.editing_order'));
        }
    }

    const handleCustomerSelection = async (e) => {
        const customer = customers.find(c => c.idCompany === Number(e.target.value));
        setSelectedCustomer(customer);
        setFormData(prev => ({...prev, idCompany: customer.idCompany}));

        try{
            const pendingOrdersResponse = await axios.get(`companies/${customer.idCompany}/orders/pending`);
            const pendingOrders = pendingOrdersResponse.data;
            setOrders(pendingOrders);
            
            const customerDetailResponse = await axios.get(`/customers/${customer.idCompany}`);
            const customerDetail = customerDetailResponse.data;
            setFormData(prev => ({...prev, vatRate: customerDetail.defaultVat}));
            setFormData(prev => ({...prev, withholding: customerDetail.defaultWithholding}));
            setFormData(prev => ({...prev, language: customerDetail.defaultLanguage}));

        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    }

    // Handle Edit
    const handleEditInvoice = async (invoice) => {
        try{
            const invoiceResponse = await axios.get(`/customer-invoices/by-id/${invoice.idDocument}`);
            const invoiceData = invoiceResponse.data;
      
            const pendingOrdersResponse = await axios.get(`companies/${invoiceData.company.idCompany}/orders/pending`);
            const pendingOrders = pendingOrdersResponse.data;
            
            const combinedOrders = [
                ...invoiceData.orders, 
                ...pendingOrders.filter(po => !invoiceData.orders.some(io => io.idOrder === po.idOrder))
            ];

            setSelectedInvoice(invoiceData);
            setOrders(combinedOrders);
            setSelectedChangeRate(invoiceData.changeRate);

            setFormData({ 
                        docNumber:invoiceData.docNumber,
                        docDate: invoiceData.docDate,
                        status: invoiceData.status || "PENDING",
                        docType: invoiceData.docType || "INV_CUST",
                        language: invoiceData.language || "es",
                        vatRate: invoiceData.vatRate || 0.00,
                        withholding: invoiceData.withholding || 0.00,
                        currency: invoiceData.currency || "€",
                        noteDelivery: invoiceData.noteDelivery || "",
                        notePayment: invoiceData.notePayment || "",
                        noteComment: invoiceData.noteComment || "",
                        deadline: invoiceData.deadline || "",
                        idChangeRate: invoiceData.changeRate.idChangeRate || 1,
                        idBankAccount: invoiceData.bankAccount?.idBankAccount,
                        idCompany: invoiceData.company.idCompany,
                        idDocumentParent: invoiceData.documentParent?.idDocument,
                        orderIds: invoiceData.orders?.map(o => o.idOrder) || []
                        });
            setShowEditForm(true);
        } catch (err) {
            console.error(err.response?.data?.message || "Error al cargar factura");
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!formData.docNumber || !formData.docDate) {
            setError(t('error.all_fields_required'));
            return;
        }
        if (formData.orderIds < 1){
            setError(t('error.no_orders'));
            return;
        }

        try{
            const response = await axios.post(`/customer-invoices/modify-to-new-version/${selectedInvoice.idDocument}`, formData);
            const updateDoc = mapDocument(response.data);

            setInvoices(prevInvoices =>
                prevInvoices.map(invoice =>
                    invoice.idDocument === selectedInvoice.idDocument ? updateDoc : invoice
                )
            );

            setShowEditForm(false);
            setError("");
            setFormData({ 
                        docNumber:"",
                        docDate: "",
                        status: "",
                        docType: "INV_CUST",
                        language: "",
                        vatRate: 0.0,
                        withholding: 0.0,
                        currency: "",
                        noteDelivery: "",
                        notePayment: "",
                        noteComment: "",
                        deadline: "",
                        idChangeRate: 1,
                        idBankAccount: "",
                        idCompany: "",
                        idDocumentParent: "",
                        orderIds: []
                        });
        }catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    }

    const handleEditCancel = () => {
        setShowEditForm(false);
        setFormData({ 
                    docNumber:"",
                    docDate: "",
                    status: "",
                    docType: "INV_CUST",
                    language: "",
                    vatRate: 0.0,
                    withholding: 0.0,
                    currency: "",
                    noteDelivery: "",
                    notePayment: "",
                    noteComment: "",
                    deadline: "",
                    idChangeRate: 1,
                    idBankAccount: "",
                    idCompany: "",
                    idDocumentParent: "",
                    orderIds: []
                    });
        setSelectedInvoice({});
        setError("");
    }

    //Handle Changes for Edit/Add
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleChangeRateSelection = (e) => {
        const changeRate = changeRates.find(c => c.idChangeRate === Number(e.target.value));
        setSelectedChangeRate(changeRate || {});
        setFormData(prev => ({ ...prev, idChangeRate: changeRate.idChangeRate}))
        setFormData(prev => ({ ...prev, currency: changeRate.currency1}))
    }

    const handlePaidChange = (e) => {
        const newStatus = e.target.checked ? "PAID" : "PENDING";

        setFormData(prev => ({...prev, status: newStatus}));
    }

    //Orders selection
    const handleOrderChange = (e, order) => {
        if (e.target.checked) {
            // add order
            setFormData(prev => ({
              ...prev,
              orderIds: [...prev.orderIds, order.idOrder]
            }));
        } else {
            //  remove order
            setFormData(prev => ({
              ...prev,
              orderIds: prev.orderIds.filter(id => id !== order.idOrder)
            }));
        }
    }

    const handleSelectAllOrders = (e) => {
        if (e.target.checked) {
            // add all
            setFormData(prev => ({
                ...prev,
                orderIds: orders.map(o => o.idOrder)
            }));
        } else {
            // remove all
            setFormData(prev => ({
                ...prev,
                orderIds: []
            }));
        }
    }

    //Handle Delete
    const handleDelete = (invoice) => {
        setInvoiceToDelete(invoice);
        setShowDeleteConfirm(true);
    }

    const handleDeleteSubmit = async () => {
        if (!invoiceToDelete) return;

        try {
            await axios.delete(`/customer-invoices/delete/${invoiceToDelete.idDocument}`);
            
            setInvoices(prevInvoices => {
                const updatedInvoices = prevInvoices.filter(i => i.idDocument !== invoiceToDelete.idDocument);
                return updatedInvoices;
            });

            setShowDeleteConfirm(false);
            setInvoiceToDelete(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.deleting_order'));
        }
    };

    const handleDeleteCancel = () => {
        setInvoiceToDelete({});
        setShowDeleteConfirm(false);
        setError("");
    };

    //Used to normalize the response of the backend for Update request
    const mapDocument = (document) => ({
        idDocument: document.idDocument,
        comName: document.company?.comName || "",
        docNumber: document.docNumber,
        docDate: document.docDate,
        totalNet: document.totalNet,
        currency: document.currency,
        status: document.status,
        type: document.type,
    });

    return(
        <div className="flex w-full flex-col items-center gap-5 py-10">
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">{t('documents.confirm_delete')}</h3>
                        {error && (
                                <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                {error}
                                </div>
                            )}
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)]"
                                onClick={handleDeleteCancel}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
                                onClick={handleDeleteSubmit}
                            >
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Card Add Order */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-2/3 max-h-[90vh] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4">{t('documents.add_invoice')}</h3>
                    <div className="p-6 overflow-y-auto">
                        <div className="flex p-6 overflow-y-auto justify-end">
                            
                        </div>
                        <div className="flex gap-4 mb-4">
                            <select
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                value={selectedCustomer?.idCompany || ""}
                                onChange={handleCustomerSelection}
                                >
                                <option value="">{t("documents.select_customer")}</option>
                                {customers.map(c => (
                                    <option key={c.idCompany} value={c.idCompany}>
                                        {c.comName}
                                    </option>
                                ))}
                            </select>
                            <span className="p-2 w-1/3">
                                {lastInvoiceNumber ? `${t("documents.last_number")}: ${lastInvoiceNumber}` : ""}
                            </span>
                            <label className="w-1/6 py-2">{t('documents.is_paid')}</label>
                            <input
                                type="checkbox"
                                className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                checked={formData.status === "PAID"}
                                onChange={handlePaidChange}
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <span className="p-2 w-1/2">
                                {selectedCustomer?.comName || ""}
                            </span>
                            <span className="p-2 w-1/2">
                                {selectedCustomer?.vatNumber || ""}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <select
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                value={selectedChangeRate?.idChangeRate || ""}
                                onChange={handleChangeRateSelection}
                                >
                                {changeRates.map(c => (
                                <option key={c.idChangeRate} value={c.idChangeRate}>
                                    {`${c.currency1} -> ${c.currency2}: ${c.rate}`}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                value={formData.idBankAccount || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, idBankAccount: Number(e.target.value) }))}
                                >
                                {bankAccounts.map(b => (
                                    <option key={b.idBankAccount} value={b.idBankAccount}>
                                        {`${b.iban}`}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="language"
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                onChange={handleChange}
                                value={formData.language}
                                >
                                <option value="es">{t("languages.es")}</option>
                                <option value="fr">{t("languages.fr")}</option>
                                <option value="en">{t("languages.en")}</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input 
                                type="text"
                                name="docNumber"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.docNumber}
                                placeholder={t('documents.number')}
                                onChange={handleChange}
                                required    
                                />
                            <input 
                                type="date"
                                name="docDate"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.docDate}
                                placeholder={t('documents.date')}
                                onChange={handleChange}
                                required    
                                />                          
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input 
                                type="text"
                                name="noteDelivery"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.noteDelivery}
                                placeholder={t('documents.note_delivery')}
                                onChange={handleChange}
                                required    
                                />
                            <input 
                                type="text"
                                name="notePayment"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.notePayment}
                                placeholder={t('documents.note_payment')}
                                onChange={handleChange}
                                required    
                                />                          
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input 
                                type="text"
                                name="noteComment"
                                className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                value={formData.noteComment}
                                placeholder={t('documents.note_comment')}
                                onChange={handleChange}
                                required    
                                />                        
                        </div>
                        <div className="flex gap-4 mt-4 mb-1 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_net")}: ${totals.totalNet}${formData.currency}`}
                            </span>
                            <span className="p-2 w-1/4">
                                {t("documents.vat_rate") + ": " + (selectedCustomer?.vatRate || 0 > 1 
                                ? formData.vatRate + "%" 
                                : formData.vatRate * 100 + "%"
                                )}
                            </span>
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_vat")}: ${totals.totalVat}${formData.currency}`}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-1 w-full">
                            <span className="p-2 w-1/4">
                                {t("documents.withholding") + ": " + (selectedCustomer?.withholding || 0 > 1 
                                ? formData.withholding + "%" 
                                : formData.withholding * 100 + "%"
                                )}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.withholding")}: ${totals.totalWithholding}${formData.currency}`}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-2 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_gross")}: ${totals.totalGross}${formData.currency}`}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.total_to_pay")}: ${totals.totalToPay}${formData.currency}`}
                            </span>
                        </div>
                        {!selectedChangeRate.rate === 1 && 
                        <div className="flex gap-4 mb-2 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_gross")}: ${totals.totalGross}${formData.currency}`}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.total_to_pay")}: ${totals.totalToPay}${formData.currency}`}
                            </span>
                        </div>
                        }
                        <div className="flex justify-end gap-2 my-5">
                            <button
                                type="button"
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                onClick={handleAddCancel}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                onClick={handleAddSubmit}    
                            >
                                {t('button.save')}
                            </button>
                        </div>
                        <hr></hr>
                        <h3 className="text-xl font-semibold my-4 mb-4">{t("orders.orders")}</h3>
                        <div className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors">
                            <label className="w-1/2 py-2">{t("orders.name")}</label>
                            <label className="w-1/6 py-2">{t("orders.date")}</label>
                            <label className="w-1/6 py-2">{t("orders.total")+"€"}</label>
                            <input
                                type="checkbox"
                                className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                checked={orders.length > 0 && orders.every(o => formData.orderIds.includes(o.idOrder))}
                                onChange={handleSelectAllOrders}
                            />
                        </div>
                        <hr className="border border-[color:var(--primary)]"></hr>
                        <div className="mb-4">
                            {orders?.map((order) => (
                            <div
                                key={order.idOrder}
                                className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                                title="Double click to edit"
                                >
                                <label className="w-1/2 py-2">{order.descrip}</label>
                                <label className="w-1/6 py-2">{order.dateOrder}</label>
                                <label className="w-1/6 py-2">{`${order.total.toFixed(2)}${formData.currency}`}</label>
                                <input
                                    type="checkbox"
                                    className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    checked={formData.orderIds.includes(order.idOrder)}
                                    onChange={(e) => handleOrderChange(e, order)}
                                />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                </div>
            )}
            {/* Card Edit Order */}
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                {selectedInvoice.status === "PAID" ? (
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2">
                        <h3 className="text-xl font-semibold mb-4">{t('documents.cant_modify_if_paid')}</h3>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)]"
                                onClick={handleEditCancel}
                            >
                                {t('button.cancel')}
                            </button>
                        </div>
                    </div>
                ) : (
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-2/3 max-h-[90vh] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4">{t('documents.edit_invoice')}</h3>
                    <div className="p-6 overflow-y-auto">
                        <div className="flex p-6 overflow-y-auto justify-end">
                            <label className="w-1/6 py-2">{t('documents.is_paid')}</label>
                            <input
                                type="checkbox"
                                className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                checked={formData.status === "PAID"}
                                onChange={handlePaidChange}
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <span className="p-2 w-1/2">
                                {selectedInvoice.company?.comName}
                            </span>
                            <span className="p-2 w-1/2">
                                {selectedInvoice.company?.vatNumber}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <select
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                value={selectedChangeRate?.idChangeRate || ""}
                                onChange={handleChangeRateSelection}
                                >
                                {changeRates.map(c => (
                                <option key={c.idChangeRate} value={c.idChangeRate}>
                                    {`${c.currency1} -> ${c.currency2}: ${c.rate}`}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                value={formData.idBankAccount || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, idBankAccount: Number(e.target.value) }))}
                                >
                                <option value="">{t("documents.bank_account")}</option>
                                {bankAccounts.map(b => (
                                    <option key={b.idBankAccount} value={b.idBankAccount}>
                                        {`${b.iban}`}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="language"
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                onChange={handleChange}
                                value={formData.language}
                                >
                                <option value="es">{t("languages.es")}</option>
                                <option value="fr">{t("languages.fr")}</option>
                                <option value="en">{t("languages.en")}</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input 
                                type="text"
                                name="docNumber"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.docNumber}
                                placeholder={t('documents.number')}
                                onChange={handleChange}
                                required    
                                />
                            <input 
                                type="date"
                                name="docDate"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.docDate}
                                placeholder={t('documents.date')}
                                onChange={handleChange}
                                required    
                                />                          
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input 
                                type="text"
                                name="noteDelivery"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.noteDelivery}
                                placeholder={t('documents.note_delivery')}
                                onChange={handleChange}
                                required    
                                />
                            <input 
                                type="text"
                                name="notePayment"
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                value={formData.notePayment}
                                placeholder={t('documents.note_payment')}
                                onChange={handleChange}
                                required    
                                />                          
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input 
                                type="text"
                                name="noteComment"
                                className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                value={formData.noteComment}
                                placeholder={t('documents.note_comment')}
                                onChange={handleChange}
                                required    
                                />                        
                        </div>
                        <div className="flex gap-4 mt-4 mb-1 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_net")}: ${totals.totalNet}${selectedChangeRate.currency1}`}
                            </span>
                            <span className="p-2 w-1/4">
                                {t("documents.vat_rate") + ": " + (formData.vatRate > 1 
                                ? formData.vatRate + "%" 
                                : formData.vatRate * 100 + "%"
                                )}
                            </span>
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_vat")}: ${totals.totalVat}${selectedChangeRate.currency1}`}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-1 w-full">
                            <span className="p-2 w-1/4">
                                {t("documents.withholding") + ": " + (formData.withholding > 1 
                                ? formData.withholding + "%" 
                                : formData.withholding * 100 + "%"
                                )}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.withholding")}: ${totals.totalWithholding}${selectedChangeRate.currency1}`}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-2 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_gross")}: ${totals.totalGross}${selectedChangeRate.currency1}`}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.total_to_pay")}: ${totals.totalToPay}${selectedChangeRate.currency1}`}
                            </span>
                        </div>
                        {!selectedChangeRate.rate === 1 && 
                        <div className="flex gap-4 mb-2 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_gross")}: ${totals.totalGross}${selectedChangeRate.currency1}`}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.total_to_pay")}: ${totals.totalToPay}${selectedChangeRate.currency1}`}
                            </span>
                        </div>
                        }
                        <div className="flex justify-end gap-2 my-5">
                            <button
                                type="button"
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                onClick={handleEditCancel}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                onClick={handleEditSubmit}    
                            >
                                {t('button.save')}
                            </button>
                        </div>
                        <hr></hr>
                        <h3 className="text-xl font-semibold my-4 mb-4">{t("orders.orders")}</h3>
                        <div className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors">
                            <label className="w-1/2 py-2">{t("orders.name")}</label>
                            <label className="w-1/6 py-2">{t("orders.date")}</label>
                            <label className="w-1/6 py-2">{t("orders.total")+"€"}</label>
                            <input
                                type="checkbox"
                                className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                checked={orders.length > 0 && orders.every(o => formData.orderIds.includes(o.idOrder))}
                                onChange={handleSelectAllOrders}
                            />
                        </div>
                        <hr className="border border-[color:var(--primary)]"></hr>
                        <div className="mb-4">
                            {orders?.map((order) => (
                            <div
                                key={order.idOrder}
                                className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                                title="Double click to edit"
                                >
                                <label className="w-1/2 py-2">{order.descrip}</label>
                                <label className="w-1/6 py-2">{order.dateOrder}</label>
                                <label className="w-1/6 py-2">{`${order.total.toFixed(2)}${selectedChangeRate.currency1}`}</label>
                                <input
                                    type="checkbox"
                                    className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    checked={formData.orderIds.includes(order.idOrder)}
                                    onChange={(e) => handleOrderChange(e, order)}
                                />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                )}
                </div>
            )}
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex flex-row">
                    <div className="w-full flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold mb-2 w-1/8">{t('documents.invoices_customers')}</h4>
                        <select
                            className="h-8 w-1/4 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start"
                            value={selectedCustomer?.idCompany || ""}
                            onChange={(e) => {
                                const customer = customers.find(c => c.idCompany === Number(e.target.value));
                                setSelectedCustomer(customer || {});
                            }}
                            >
                            <option value="">{t("customers.all_customers")}</option>
                            {customers.map(c => (
                                <option key={c.idCompany} value={c.idCompany}>
                                    {c.comName}
                                </option>
                            ))}
                        </select>
                        {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") &&
                        <button
                            className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                            onClick={handleAddInvoice}
                        >
                        <span className="text-lg font-bold">+</span> {t('button.add')}
                        </button>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[color:var(--primary)] mb-4">
                {["all", "pending", "paid"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 -mb-px font-medium ${
                        selectedTab === tab
                        ? "border-b-4 border-[color:var(--primary)] text-[color:var(--text)] font-semibold"
                        : "text-[color:var(--text)]"
                    }`}
                    >
                    {tab === "all" ? t('documents.all_invoices') : tab === "pending" ? t('documents.pending') : t('documents.paid')}
                    </button>
                ))}
                </div>

                {/* Table */}
            {sortedInvoices.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('documents.no_documents')}
                </div>
                ) : (
                <div className="overflow-auto max-h-80 w-full">
                    <table className="min-w-full divide-y divide-[color:var(--divide)] table-fixed">
                        <thead className="bg-[color:var(--secondary)] sticky top-0 z-10">
                        <tr>
                            <th className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("comName")}>
                            {t('customers.customer')} {sortConfig.key === "comName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("docNumber")}>
                            {t('documents.number')} {sortConfig.key === "docNumber" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("docDate")}>
                            {t('documents.date')} {sortConfig.key === "docDate" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("totalNet")}>
                            {t('documents.total')} {sortConfig.key === "totalNet" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                            <th className="w-1/6 py-3 text-center text-[color:var(--text)] font-medium">{/* icon header */}</th>
                            )}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[color:var(--divide)]">
                        {sortedInvoices.map(invoice => (
                            <tr key={invoice.idDocument} className="cursor-pointer bg-[color:var(--secondary)] text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors">
                            <td className="w-1/3 py-2" onClick={() => handleEditInvoice(invoice)}>{invoice.comName}</td>
                            <td className="w-1/3 py-2" onClick={() => handleEditInvoice(invoice)}>{invoice.docNumber}</td>
                            <td className="w-1/6 py-2" onClick={() => handleEditInvoice(invoice)}>
                                {new Date(invoice.docDate).toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" })}
                            </td>
                            <td className="w-1/6 py-2" onClick={() => handleEditInvoice(invoice)}>{`${invoice.totalNet.toFixed(2)}€`}</td>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                                <td className="w-1/6 py-2 text-center">
                                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(invoice)}>🗑️</button>
                                </td>
                            )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    )
}

export default CustomerInvoicesList;