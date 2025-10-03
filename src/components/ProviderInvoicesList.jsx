import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

function ProviderInvoicesList(){

    const { t } = useTranslation();
    
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const today = new Date().toISOString().split("T")[0];

    const initialFormData = { 
                            docNumber:"", docDate:"", status:"PENDING", docType:"INV_PROV",
                            language:"", vatRate:0.0, withholding:0.0, currency:"€",
                            noteDelivery:"", notePayment:"", noteComment:"", deadline:"",
                            idChangeRate:"", idCompany:"", idDocumentParent:"", orderIds:[]
                        };
    const currencies = [
                        "EUR","GBP","USD","AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN",
                        "BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL",
                        "BSD","BTN","BWP","BYN","BZD","CAD","CDF","CHF","CLP","CNY",
                        "COP","CRC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP",
                        "ERN","ETB","FJD","FKP","FOK","GEL","GGP","GHS",
                        "GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF",
                        "IDR","ILS","IMP","INR","IQD","IRR","ISK","JEP","JMD","JOD",
                        "JPY","KES","KGS","KHR","KID","KMF","KRW","KWD","KYD","KZT",
                        "LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD",
                        "MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MYR","MZN",
                        "NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK",
                        "PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR",
                        "SBD","SCR","SDG","SEK","SGD","SHP","SLE","SLL","SOS","SRD",
                        "SSP","STN","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY",
                        "TTD","TVD","TWD","TZS","UAH","UGX","UYU","UZS","VES",
                        "VND","VUV","WST","XAF","XCD","XCG","XDR","XOF","XPF","YER",
                        "ZAR","ZMW","ZWL"
                        ];
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState("");
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState({});
    const [invoiceToDelete, setInvoiceToDelete] = useState({});
    const [ownerInfo, setOwnerInfo] = useState({});
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState({});
    const [orders, setOrders] = useState([]);
    const [changeRates, setChangeRates] = useState([]);
    const [selectedChangeRate, setSelectedChangeRate] = useState({});
    const [newChangeRate, setNewChangeRate] = useState({currency1:"", currency2:"", rate:1, date:today});
    const [totals, setTotals] = useState({  
                                        totalNet:0,
                                        totalVat:0,
                                        totalWithholding:0,
                                        totalGross:0,
                                        totalGross2: 0,
                                        totalToPay:0,
                                        totalToPay2: 0
                                    });
    const [selectedTab, setSelectedTab] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: "docDate", direction: "desc" });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showChangeRateForm, setShowChangeRateForm] = useState(false);
    const [showDetailedInvoice, setShowDetailedInvoice] = useState(false);
    const [viewDetailedInvoice, setViewDetailedInvoice] = useState(false);

    //Getting invoices for list and providers for select
    useEffect(() => {
        axios
            .get("/provider-invoices")
            .then(
                (response) => {setInvoices(response.data);})
            .catch((err) => console.error(err.response.data.message || "Error"));
        axios
            .get("/providers/minimal-list")
            .then(
                (response) => {
                    setProviders(response.data);})
            .catch((err) => console.error(err.response.data.message || "Error"));
        axios
            .get("/change-rates")
            .then(
                (response) => { setChangeRates(response.data);
                            })
            .catch((err) => console.error(err.response.data.message || "Error"));
    }, []);

    //Filtering invoices by provider/state
    useEffect(() => {
        let result = invoices;
    
        if (selectedProvider.comName) {
            result = result.filter(i => i.comName === selectedProvider.comName);
        }
    
        if (selectedTab === "pending") {
            result = result.filter(i => i.status === "PENDING");
        } else if (selectedTab === "paid") {
            result = result.filter(i => i.status === "PAID");
        }
    
        setFilteredInvoices(result);
    }, [invoices, selectedTab, selectedProvider]);

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
            const rate = selectedChangeRate?.rate || 1;
            const totalGross2 = totalGross * rate;
            const totalToPay = totalGross - totalWithholding;
            const totalTopay2 = totalToPay * rate;

            setTotals({
                totalNet: totalNet.toFixed(2),
                totalVat: totalVat.toFixed(2),
                totalWithholding: totalWithholding.toFixed(2),
                totalGross: totalGross.toFixed(2),
                totalGross2: totalGross2.toFixed(2),
                totalToPay: totalToPay.toFixed(2),
                totalToPay2: totalTopay2.toFixed(2)
            })
        }
    }, [formData.orderIds, formData.vatRate, formData.withholding, orders, selectedChangeRate]);

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
        
        setFormData(initialFormData);
        setSelectedChangeRate(changeRates[0]);
        setFormData(prev => ({...prev, idChangeRate: changeRates[0].idChangeRate || ""}));
    };

    const handleAddCancel = () =>{
        setShowAddForm(false);
        setSelectedProvider({});
        setFormData(initialFormData);
        setSelectedChangeRate({});
        setOrders([]);
        setError("");
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.docNumber || !formData.docDate) {
            setError(t('error.all_fields_required'));
            return;
        }
        if(formData.orderIds.length < 1){
            setError(t('error.document_without_Order'));
            return;
        }
        if(!formData.idCompany){
            setError(t('error.no_provider_selected'));
            return;
        }

        try{
            const response = await axios.post(`/provider-invoices/create/${formData.idCompany}`, formData);
            const newInvoice = mapDocument(response.data);

            setInvoices(prevInvoices => {
                const updateInvoices =[...prevInvoices, newInvoice];
                return updateInvoices;
            })

            setShowAddForm(false);
            setSelectedProvider({});
            setOrders([]);
            setFormData(initialFormData);
            setSelectedChangeRate({});
            setError("");

        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleProviderSelection = async (e) => {
        const provider = providers.find(c => c.idCompany === Number(e.target.value));
        setSelectedProvider(provider);
        setFormData(prev => ({...prev, idCompany: provider.idCompany}));

        try{
            const pendingOrdersResponse = await axios.get(`companies/${provider.idCompany}/orders/pending`);
            const pendingOrders = pendingOrdersResponse.data;
            setOrders(pendingOrders);
            
            const providerDetailResponse = await axios.get(`/providers/${provider.idCompany}`);
            const providerDetail = providerDetailResponse.data;
            setFormData(prev => ({...prev, vatRate: providerDetail.defaultVat}));
            setFormData(prev => ({...prev, withholding: providerDetail.defaultWithholding}));
            setFormData(prev => ({...prev, language: providerDetail.defaultLanguage}));

        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    // Handle View Details
    const handleViewDetails = async (invoice) => {
        try{
            const invoiceResponse = await axios.get(`/provider-invoices/by-id/${invoice.idDocument}`);
            const invoiceData = invoiceResponse.data;
            setSelectedInvoice(invoiceData);

            const ownerResponse = await axios.get("/owner");
            const ownerData = ownerResponse.data;
            setOwnerInfo(ownerData);

            const providerResponse = await axios.get(`/providers/${invoiceData.company.idCompany}`);
            const providerData = providerResponse.data;
            setSelectedProvider(providerData);

            setShowDetailedInvoice(true);
        } catch (err) {
            console.error(err.response?.data?.message || "Error");
        }
    };

    // Handle Edit
    const handleEditInvoice = async (invoice) => {
        try{
            setViewDetailedInvoice(showDetailedInvoice);
            setShowDetailedInvoice(false);
            const invoiceResponse = await axios.get(`/provider-invoices/by-id/${invoice.idDocument}`);
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
                        docType: invoiceData.docType || "INV_PROV",
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
            console.error(err.response?.data?.message || "Error");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!formData.docNumber || !formData.docDate) {
            setError(t('error.all_fields_required'));
            return;
        }
        if (formData.orderIds.length < 1){
            setError(t('error.no_orders'));
            return;
        }

        try{
            const response = await axios.post(`/provider-invoices/modify-to-new-version/${selectedInvoice.idDocument}`, formData);
            const updateDoc = mapDocument(response.data);

            setInvoices(prevInvoices =>
                prevInvoices.map(invoice =>
                    invoice.idDocument === selectedInvoice.idDocument ? updateDoc : invoice
                )
            );

            setSelectedInvoice(response.data);
            
            setShowEditForm(false);
            setError("");
            setFormData(initialFormData);
            setShowDetailedInvoice(viewDetailedInvoice);
        }catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleEditCancel = () => {
        setShowEditForm(false);
        setFormData(initialFormData);
        setShowDetailedInvoice(viewDetailedInvoice);
        setError("");
    };

    //Handle Changes for Edit/Add
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeRateSelection = (e) => {
        const changeRate = changeRates.find(c => c.idChangeRate === Number(e.target.value));
        setSelectedChangeRate(changeRate || {});
        setFormData(prev => ({ ...prev, idChangeRate: changeRate.idChangeRate}))
        setFormData(prev => ({ ...prev, currency: changeRate.currency1}))
    };

    const handlePaidChange = (e) => {
        const newStatus = e.target.checked ? "PAID" : "PENDING";

        setFormData(prev => ({...prev, status: newStatus}));
        if(showDetailedInvoice){
            setSelectedInvoice(prev => ({...prev, status: newStatus}));

            setInvoices(prevInvoices =>
                prevInvoices.map(invoice =>
                    invoice.idDocument === selectedInvoice.idDocument ? { ...invoice, status: newStatus } : invoice
                )
            );
        }
        try{
            axios.get(`/provider-invoices/toggle-paid-status/${selectedInvoice.idDocument}`)
        }catch(err){
            console.error(err.response?.data?.message || "Error");
        }
    };

    const handleCurrencySelection = (e) => {
        setNewChangeRate(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    useEffect (() => {
        async function fetchChangeRate() {
            if(newChangeRate.currency1 !== "" && newChangeRate.currency2 !== ""){
                
                    try{
                        const response = await fetch(`https://v6.exchangerate-api.com/v6/daefd7493198ef912fd9cf6d/latest/${newChangeRate.currency1}`);
                        const data = await response.json();
                        const rate = data.conversion_rates[newChangeRate.currency2];
                        setNewChangeRate(prev => ({...prev, rate: rate}));
                    }catch(error){
                        console.error("error : " + error);
                    }
                }
            }
        fetchChangeRate()
    }, [newChangeRate.currency1, newChangeRate.currency2]);

    const handleNewChangeRateCancel = () => {
        setShowChangeRateForm(false);
        setNewChangeRate({currency1:"", currency2:"", rate:1, date:today});
    };

    const handleNewChangeRateSubmit = async () => {
        try{
            const response = await axios.post("/change-rates", newChangeRate);
            const data = response.data;

            setChangeRates(prevChangeRates => {
                const updateChangeRates =[...prevChangeRates, data];
                return updateChangeRates;
            })

            setShowChangeRateForm(false);
            setNewChangeRate({currency1:"", currency2:"", rate:1, date:today});
            setSelectedChangeRate(data);
        }catch(err){
            console.error(err);
        }
    };

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
    };

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
    };

    //Handle Delete
    const handleDelete = (invoice) => {
        setInvoiceToDelete(invoice);
        setShowDeleteConfirm(true);
    };

    const handleDeleteSubmit = async () => {
        if (!invoiceToDelete) return;

        try {
            await axios.delete(`/provider-invoices/delete/${invoiceToDelete.idDocument}`);
            
            setInvoices(prevInvoices => {
                const updatedInvoices = prevInvoices.filter(i => i.idDocument !== invoiceToDelete.idDocument);
                return updatedInvoices;
            });

            setShowDeleteConfirm(false);
            setInvoiceToDelete(null);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleDeleteCancel = () => {
        setInvoiceToDelete({});
        setShowDeleteConfirm(false);
        setError("");
    };

    const handleBackToList = () => {
        setShowDetailedInvoice(false);
        setSelectedInvoice({});
        setSelectedProvider({});
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
            {showDetailedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="modal-scroll bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 sm:p-16 lg:p-32 flex flex-col overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex p-6 modal-scroll overflow-y-auto justify-end">
                                <label className="p-2">{t('documents.is_paid')}</label>
                                <input
                                    type="checkbox"
                                    className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    checked={formData.status === "PAID"}
                                    onChange={handlePaidChange}
                                />
                            </div>
                            <div className="flex justify-end mb-4 gap-2">
                                <button
                                    className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                    onClick={handleBackToList}
                                >
                                    {t('button.back')}
                                </button>
                                {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") &&(
                                <>
                                <button
                                    className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                    onClick={() => handleEditInvoice(selectedInvoice)}
                                >
                                    {t('button.edit')}
                                </button>
                                <button
                                    className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                    onClick={() => handleDelete(selectedInvoice)}
                                >
                                    {t('button.delete')}
                                </button>
                                </>
                                )}

                            </div>
                        </div>
                        <div className="w-[794px] bg-white shadow-lg p-10 flex flex-col h-full">
                        {/* contenido */}
                            <div className="flex w-full justify-between gap-6">
                                {/* HEADER */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-4">
                                        <div className="grid grid-cols-[2fr_3fr] gap-1 " >
                                            <label className="font-semibold text-black">{t("providers.name")}:</label>
                                            <label className="text-black">{selectedProvider.legalName}</label>
                                            <label className="font-semibold text-black">{t("providers.vat_number")}:</label>
                                            <label className="text-black">{selectedProvider.vatNumber}</label>
                                            <label className="font-semibold text-black">{t("register.street")}:</label>
                                            <label className="text-black">{selectedProvider.addresses[0].street}</label>
                                            <label className="font-semibold text-black">{t("register.st_number")}:</label>
                                            <label className="text-black">{selectedProvider.addresses[0].stNumber} {selectedProvider.addresses[0].apt}</label>
                                            <label className="font-semibold text-black">{t("register.cp")/t("register.city")}:</label>
                                            <label className="text-black">{selectedProvider.addresses[0].cp}/{selectedProvider.addresses[0].city}</label>
                                            <label className="font-semibold text-black">{t("register.country")}:</label>
                                            <label className="text-black">{selectedProvider.addresses[0].country}</label>
                                            <label className="font-semibold text-black">{t("register.email")}:</label>
                                            <label className="text-black">{selectedProvider.email}</label>
                                            <label className="font-semibold text-black">{t("register.web")}:</label>
                                            <label className="text-black">{selectedProvider.web}</label>
                                        </div>
                                    </div>
                                    <div className="flex border w-full gap-y-2 rounded-full mt-3 p-2 justify-center border-[#1d4ed8]" >
                                        <label className="font-semibold text-black text-2xl">{t("documents.invoice")}</label>
                                    </div>
                                </div>
                                <div className="flex flex-col border gap-y-2 rounded-lg p-3 border-[#1d4ed8]" >
                                    <label className="font-semibold text-black">{ownerInfo.legalName}</label>
                                    <label className="font-semibold text-black">{ownerInfo.vatNumber}</label>
                                    <label className="font-semibold text-black">{ownerInfo.addresses[0].street} {ownerInfo.addresses[0].stNumber} {ownerInfo.addresses[0].apt}</label>
                                    <label className="font-semibold text-black">{ownerInfo.addresses[0].cp}/{ownerInfo.addresses[0].city}</label>
                                    <label className="font-semibold text-black">{ownerInfo.addresses[0].country}</label>
                                    <label className="font-semibold text-black">{ownerInfo.email}</label>
                                    <label className="font-semibold text-black">{ownerInfo.web}</label>
                                </div>
                            </div>
                            <div className="flex justify-between my-6">
                                <div className="flex gap-1 w-1/3">
                                <label className="font-semibold text-black">{t("documents.number")}:</label>
                                <label className="text-black">{selectedInvoice.docNumber}</label>
                                </div>
                                <div className="flex gap-1 w-1/3">
                                <label className="font-semibold text-black">{t("documents.date")}:</label>
                                <label className="text-black">{selectedInvoice.docDate}</label>
                                </div>
                            </div>
                            <hr className="border border-gray-200 mb-4"/>
                            {/* Orders */}
                            <div className="modal-scroll flex-1 overflow-y-auto ">
                                {selectedInvoice.orders.map((order) => (
                                    <div key={order.idOrder} className="px-4 py-2">
                                    {/* Order details */}
                                    <div className="bg-gray-200 px-4 rounded-full grid grid-cols-[3fr_1fr_1fr_1fr] gap-2 text-black font-semibold">
                                        <div>{order.descrip}</div>
                                        <div>{order.dateOrder}</div>
                                        <div>{order.quantity} {order.units}</div>
                                        <div>{order.total.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</div>
                                    </div>
                                    <hr className="border-gray-200 mb-2"/>
                                    {/* Items details */}
                                    <div className="ml-6">
                                        {order.items.map((item) => (
                                        <div key={item.idItem} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-2 mb-1 text-black">
                                            <div>{item.descrip}</div>
                                            <div>{item.quantity}</div>
                                            <div>{order.pricePerUnit.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</div>
                                            <div>{(item.discount*100).toFixed(2)}%</div>
                                            <div>{item.total.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</div>
                                        </div>
                                        ))}
                                    </div>
                                    </div>
                                ))}
                            </div>
                            <hr className="border border-gray-200 mb-4"/>
                            {/* Footer with totals and bank account */}
                            <div className="h-1/6 mt-auto w-full flex justify-between">
                                <div className="flex flex-col w-1/3">
                                    <label className="font-semibold text-black">{t("documents.pay_method")}:</label>
                                    <label className="text-black">{selectedInvoice.notePayment}</label>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div className="flex justify-between">
                                        <label className="font-semibold text-black">{t("documents.total_net")}</label>
                                        <label className="font-semibold text-black">{t("documents.vat_rate")}</label>
                                        <label className="font-semibold text-black">{t("documents.total_vat")}</label>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="text-black">{selectedInvoice.totalNet.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</label>
                                        <label className="text-black">{selectedInvoice.vatRate.toFixed(2)}%</label>
                                        <label className="text-black">{selectedInvoice.totalVat.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</label>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="font-semibold text-black">{t("documents.withholding")}</label>
                                        <label className="font-semibold text-black">{t("documents.total_withholding")}</label>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="text-black">{selectedInvoice.withholding.toFixed(2)}%</label>
                                        <label className="text-black">{selectedInvoice.totalWithholding.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</label>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="font-semibold text-black">{t("documents.total_gross")}</label>
                                        <label className="font-semibold text-black">{t("documents.total_to_pay")}</label>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="text-black">{selectedInvoice.totalGross.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</label>
                                        <label className="text-black">{selectedInvoice.totalToPay.toFixed(2)}{selectedInvoice.changeRate?.currency1 || "€"}</label>
                                    </div>
                                    {(selectedInvoice.changeRate?.rate || 1) !== 1 && (
                                    <div className="flex justify-between">
                                        <label className="text-black">{selectedInvoice.totalGrossInCurrency2.toFixed(2)}{selectedInvoice.changeRate?.currency2 || "€"}</label>
                                        <label className="text-black">{selectedInvoice.totalToPayInCurrency2.toFixed(2)}{selectedInvoice.changeRate?.currency2 || "€"}</label>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
            {/* Card Add Invoice */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-2/3 max-h-[90vh] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4">{t('documents.add_invoice')}</h3>
                    <div className="p-6 modal-scroll overflow-y-auto">
                        <div className="flex gap-4 mb-4">
                            <select
                                className="p-2 w-1/3 rounded-full border bg-[color:var(--background)]"
                                value={selectedProvider?.idCompany || ""}
                                onChange={handleProviderSelection}
                                >
                                <option value="">{t("documents.select_provider")}</option>
                                {providers.map(c => (
                                    <option key={c.idCompany} value={c.idCompany}>
                                        {c.comName}
                                    </option>
                                ))}
                            </select>
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
                                {selectedProvider?.comName || ""}
                            </span>
                            <span className="p-2 w-1/2">
                                {selectedProvider?.vatNumber || ""}
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
                            <button
                                type="button"
                                onClick={() => setShowChangeRateForm(true)}
                                className="px-2 py-1 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)]"
                            >
                                +
                            </button>
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
                                {(selectedProvider?.vatRate ?? 0) > 1
                                ? t("documents.vat_rate") + ": " + formData.vatRate + "%" 
                                : t("documents.vat_rate") + ": " + formData.vatRate * 100 + "%"
                                }
                            </span>
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_vat")}: ${totals.totalVat}${formData.currency}`}
                            </span>
                        </div>
                        <div className="flex gap-4 mb-1 w-full">
                            <span className="p-2 w-1/4">
                                {(selectedProvider?.withholding ?? 0) > 1
                                ? t("documents.withholding") + ": " + formData.withholding + "%" 
                                : t("documents.withholding") + ": " + formData.withholding * 100 + "%"
                                }
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
                        {(selectedChangeRate?.rate || 1) !== 1 && 
                        <div className="flex gap-4 mb-2 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_gross")}: ${totals.totalGross2}${selectedChangeRate.currency2}`}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.total_to_pay")}: ${totals.totalToPay2}${selectedChangeRate.currency2}`}
                            </span>
                        </div>
                        }
                        {error && (
                            <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                {error}
                            </div>
                        )}
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
                        <hr/>
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
            {/* Card Edit Invoice */}
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
                    <div className="p-6 modal-scroll overflow-y-auto">
                        <div className="flex p-6 modal-scroll overflow-y-auto justify-end">
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
                        {selectedChangeRate?.rate !== 1 && 
                        <div className="flex gap-4 mb-2 w-full">
                            <span className="p-2 w-1/4">
                                {`${t("documents.total_gross")}: ${totals.totalGross2}${selectedChangeRate.currency2}`}
                            </span>
                            <span className="p-2 w-1/2">
                                {`${t("documents.total_to_pay")}: ${totals.totalToPay2}${selectedChangeRate.currency2}`}
                            </span>
                        </div>
                        }
                        {error && (
                            <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                {error}
                            </div>
                        )}
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
            {/* Card New Change Rate */}
            {showChangeRateForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                    <h4 className="text-lg font-semibold mb-2 w-1/8">{t('documents.new_change_rate')}</h4>
                        <div className="flex gap-4 mb-4">
                            <select
                                className="h-8 w-1/3 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start"
                                name="currency1"
                                value={newChangeRate.currency1 || ""}
                                onChange={handleCurrencySelection}
                                >
                                <option value="">{t("documents.currency1")}</option>
                                {currencies.map(c => (
                                    <option key={c} value={c}>
                                    {c}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="h-8 w-1/3 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start"
                                name="currency2"
                                value={newChangeRate.currency2 || ""}
                                onChange={handleCurrencySelection}
                                >
                                <option value="">{t("documents.currency2")}</option>
                                {currencies.map(c => (
                                    <option key={c} value={c}>
                                    {c}
                                    </option>
                                ))}
                            </select>
                            <span className="p-2 w-1/3">
                                    {newChangeRate.rate}
                            </span>
                        </div>
                        <div className="flex justify-end gap-2 my-5">
                            <button
                                type="button"
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                onClick={handleNewChangeRateCancel}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                onClick={handleNewChangeRateSubmit}    
                            >
                                {t('button.save')}
                            </button>
                        </div>
                    </div>
                </div>

            )}
            {/* List */}
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex flex-row">
                    <div className="w-full flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold mb-2 w-1/8">{t('documents.invoices_providers')}</h4>
                        <select
                            className="h-8 w-1/4 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start"
                            value={selectedProvider?.idCompany || ""}
                            onChange={(e) => {
                                const provider = providers.find(p => p.idCompany === Number(e.target.value));
                                setSelectedProvider(provider || {});
                            }}
                            >
                            <option value="">{t("providers.all_providers")}</option>
                            {providers.map(p => (
                                <option key={p.idCompany} value={p.idCompany}>
                                    {p.comName}
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
                <div className="modal-scroll overflow-auto max-h-80 w-full">
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
                            <td className="w-1/3 py-2" onClick={() => handleViewDetails(invoice)}>{invoice.comName}</td>
                            <td className="w-1/3 py-2" onClick={() => handleViewDetails(invoice)}>{invoice.docNumber}</td>
                            <td className="w-1/6 py-2" onClick={() => handleViewDetails(invoice)}>
                                {new Date(invoice.docDate).toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" })}
                            </td>
                            <td className="w-1/6 py-2" onClick={() => handleViewDetails(invoice)}>{`${invoice.totalNet.toFixed(2)}€`}</td>
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

export default ProviderInvoicesList;