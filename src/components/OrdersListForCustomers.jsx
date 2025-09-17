import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

function OrdersListForCustomers(){
    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [formData, setFormData] = useState({ 
                                        descrip:"",
                                        dateOrder: "",
                                        pricePerUnit: "",
                                        units: "",
                                        total: 0.0,
                                        billed: false,
                                        fieldName: "",
                                        sourceLanguage: "",
                                        targetLanguage: "",
                                        items: []
                                    });
    const [itemInput, setItemInput] = useState({ descrip: "", qty: "", discount: "" });
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderToDelete, setOrderToDelete] = useState({});
    const [customers, setCustomers] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [selectedScheme, setSelectedScheme] = useState({});
    const [schemeLineIndex, setSchemeLineIndex] = useState(0);
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "dateOrder", direction: "desc" });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    //Getting orders for list and customers for select
    useEffect(() => {
        axios
            .get("/orders/customers")
            .then(
                (response) => {setOrders(response.data);})
            .catch((err) => console.error(err.response.data.message || "Error"));
        axios
            .get("customers/minimal-list")
            .then(
                (response) => {
                    setCustomers(response.data);
                })
            .catch((err) => console.error(err.response.data.message || "Error"));
    }, []);

    //Filtering orders by customer/state
    useEffect(() => {
        let result = orders;

        if (selectedCustomer.comName) {
            result = result.filter(o => o.comName === selectedCustomer.comName);
        }

        if (selectedTab === "pending") {
            result = result.filter(o => o.billed === false);
        } else if (selectedTab === "billed") {
            result = result.filter(o => o.billed === true);
        }

        setFilteredOrders(result);
        }, [orders, selectedTab, selectedCustomer]);

    //Select scheme in Add form
    useEffect(() => {
        if(!selectedScheme.schemeName) return;

        setFormData({
            descrip: "",
            dateOrder: "",
            pricePerUnit: selectedScheme.price,
            units: selectedScheme.units,
            total: 0.0,
            billed: false,
            fieldName: selectedScheme.fieldName,
            sourceLanguage: selectedScheme.sourceLanguage,
            targetLanguage: selectedScheme.targetLanguage,
            items: []
        });

        loadNextSchemeLine();
    }, [selectedScheme]);

    //Sorting columns
    const sortedOrders = [...filteredOrders].sort((a, b) => {
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
    const addOrder = () => {
        setShowAddForm(true);
    };

    const handleAddCancel = () => {
        setShowAddForm(false);
        setError(t(''));
        setSelectedCustomer({});
        setSelectedScheme({});
        setFormData({ 
                     descrip:"",
                     dateOrder: "",
                     pricePerUnit: "",
                     units: "",
                     total: 0.0,
                     billed: false,
                     fieldName: "",
                     sourceLanguage: "",
                     targetLanguage: "",
                     items: []
                    });
        setItemInput({ descrip: "", qty: "", discount: "" });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (!formData.descrip || !formData.pricePerUnit || !formData.dateOrder ) {
            setError(t('error.all_fields_required'));
            return;
        }
        if (isNaN(Number(formData.pricePerUnit))) {
            setError(t('error.invalid_price'));
            return;
        }
        if(formData.total === 0){
            setError(t('error.order_without_items'));
            return;
        }
        if(!selectedCustomer.idCompany){
            setError(t('error.no_customer_selected'));
            return;
        }

        try {
            const response = await axios.post(`/companies/${selectedCustomer.idCompany}/orders`, formData);
            const newOrder = mapOrder(response.data);


            setOrders(prevOrders => {
                const updatedOrders = [...prevOrders, newOrder];
                return updatedOrders;
            });

            setShowAddForm(false);
            setError("");
            setFormData({ 
                     descrip:"",
                     dateOrder: "",
                     pricePerUnit: "",
                     units: "",
                     total: 0.0,
                     billed: false,
                     fieldName: "",
                     sourceLanguage: "",
                     targetLanguage: "",
                     items: []
                    });
            setItemInput({ descrip: "", qty: "", discount: "" });
            setError(t(''));
            setSelectedCustomer({});
            setSelectedScheme({});
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleSelectionCustomer = (customer) =>{
        axios
            .get(`companies/${customer.idCompany}/schemes`)
            .then(
                (response) => {setSchemes(response.data);})
            .catch((err) => console.error(err.response.data.message || "Error"));
    }

    const handleAddItem = (e) => {
        if (e.type === "keydown" && e.key !== "Enter") return;
        e.preventDefault();
        console.log(itemInput);
        if ( !itemInput.descrip || itemInput.qty === "" || itemInput.discount == null || itemInput.discount === ""){ 
            setError(t('error.all_fields_required'));
            return;
        }
        if (isNaN(Number(itemInput.discount))) {
            setError(t('error.invalid_discount'));
            return;
        }
        if (isNaN(Number(itemInput.qty))) {
            setError(t('error.invalid_qty'));
            return;
        }

        if(Number(itemInput.qty)>0){
            setFormData(prev => {
                let updatedItems;
                if (editingItemIndex !== null) {
                    // Editing existing item
                    updatedItems = prev.items.map((item, index) =>
                        index === editingItemIndex ? itemInput : item
                    );
                } else {
                    // Add new line
                    updatedItems = [...(prev.items || []), itemInput];
                }
                return { ...prev, items: updatedItems };
            });
        }

        setItemInput({ descrip: "", discount: "", qty: "" });
        setEditingItemIndex(null);
        setError("");
        loadNextSchemeLine();
    };

    const loadNextSchemeLine = () => {
        if(!selectedScheme.schemeName) return;
        const line = selectedScheme.schemeLines[schemeLineIndex];
        if (!line) return;

        setSchemeLineIndex(prev => prev + 1);
        setItemInput({
            descrip: line.descrip,
            qty: "",
            discount: line.discount,
        });
    };

    //Handle Edit
    const handleEditOrder = (order) => {
        
        axios
            .get(`/orders/${order.idOrder}`)
            .then(
                (response) => {
                    setSelectedOrder(response.data);
                    setFormData({   
                        descrip:response.data.descrip,
                        dateOrder: response.data.dateOrder,
                        pricePerUnit: response.data.pricePerUnit,
                        units: response.data.units,
                        total: response.data.total,
                        billed: response.data.billed,
                        fieldName: response.data.fieldName,
                        sourceLanguage: response.data.sourceLanguage,
                        targetLanguage: response.data.targetLanguage,
                        items: response.data.items
                    });})
            .catch((err) => console.error(err.response.data.message || "Error"));
        
        setShowEditForm(true);
    };

    const handleEditItem = (index) => {
        if(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING"){
            const item = formData.items[index];
            setItemInput(item);
            setEditingItemIndex(index);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!formData.descrip || !formData.pricePerUnit || !formData.dateOrder) {
            setError(t('error.all_fields_required'));
            return;
        }

        if (isNaN(Number(formData.pricePerUnit))) {
            setError(t('error.invalid_price'));
            return;
        }

        try {
            const response = await axios.patch(`/companies/${selectedOrder.company.idCompany}/orders/${selectedOrder.idOrder}`, formData);

            const updatedOrder = mapOrder(response.data);

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.idOrder === selectedOrder.idOrder ? updatedOrder : order
                )
            );

            setShowEditForm(false);
            setError("");
            setFormData({
                        descrip:"",
                        dateOrder: "",
                        pricePerUnit: "",
                        units: "",
                        total: 0.0,
                        billed: false,
                        fieldName: "",
                        sourceLanguage: "",
                        targetLanguage: "",
                        items: []
                        });
            setItemInput({ descrip: "", qty: "", discount: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.editing_order'));
        }
    };

    const handleEditCancel = () => {
        setShowEditForm(false);
        setFormData({
                    descrip:"",
                    dateOrder: "",
                    pricePerUnit: "",
                    units: "",
                    total: 0.0,
                    billed: false,
                    fieldName: "",
                    sourceLanguage: "",
                    targetLanguage: "",
                    items: []
                    });
        setItemInput({ descrip: "", qty: "", discount: "" });
        setEditingItemIndex(null);
        setError("");
    }

    //Handle Delete
    const handleDelete = (order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    }

    const handleDeleteSubmit = async () => {
        if (!orderToDelete) return;

        try {
            await axios.delete(`/orders/${orderToDelete.idOrder}`);
            
            setOrders(prevOrders => {
                const updatedOrders = prevOrders.filter(o => o.idOrder !== orderToDelete.idOrder);
                return updatedOrders;
            });

            setShowDeleteConfirm(false);
            setOrderToDelete(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.deleting_order'));
        }
    };

    const handleDeleteCancel = () => {
        setOrderToDelete(null);
        setShowDeleteConfirm(false);
        setError("");
    };

    //Inputs hanges for Add or Edit
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleItemChange = (e) => {
        const { name, value } = e.target;

        if (editingItemIndex !== null) {
            // Editing existing item
            const updatedItems = [...formData.items];
            updatedItems[editingItemIndex] = {
                ...updatedItems[editingItemIndex],
                [name]: value,
            };

            // Recalculate total for this item
            const item = updatedItems[editingItemIndex];
            const price = parseFloat(formData.pricePerUnit) || 0;
            const qty = parseFloat(item.qty) || 0;
            let discount = parseFloat(item.discount) || 0;
            if (discount > 1) discount = discount / 100;
            item.total = price * qty * (1 - discount);

            // Recalculate grand total
            const granTotal = updatedItems.reduce(
                (sum, i) => sum + (parseFloat(i.total) || 0),
                0
            );

            setFormData((prev) => ({
                ...prev,
                items: updatedItems,
                total: granTotal,
            }));

            setItemInput(item);
        } else {
            // New item (not yet in items array)
            const newItem = { ...itemInput, [name]: value };

            const price = parseFloat(formData.pricePerUnit) || 0;
            const qty = parseFloat(newItem.qty) || 0;
            let discount = parseFloat(newItem.discount) || 0;
            
            if (discount > 1) discount = discount / 100;
            newItem.total = price * qty * (1 - discount);

            setItemInput(newItem);

            // Calculate what grand total *would be* if added
            const tempItems = [...formData.items, newItem];
            const granTotal = tempItems.reduce(
                (sum, i) => sum + (parseFloat(i.total) || 0),
                0
            );

            setFormData((prev) => ({
                ...prev,
                total: granTotal,
            }));
        }
    };

    //Used to normalize the response of the backend for PATCH request
    const mapOrder = (order) => ({
        idOrder: order.idOrder,
        comName: order.comName || order.company?.comName || "",
        descrip: order.descrip,
        dateOrder: order.dateOrder,
        total: order.total,
        billed: order.billed
    });

    return(
        <div className="flex w-full flex-col items-center gap-5 py-10">
            {/* Card Add Order */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">{t('orders.add_order')}</h3>
                        <div className="p-6 overflow-y-auto">
                            <div className="flex gap-4 mb-4">
                                <select
                                    className="h-8 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start"
                                    value={selectedCustomer?.idCompany || ""}
                                    onChange={(e) => {
                                        const customer = customers.find(c => c.idCompany === Number(e.target.value));
                                        setSelectedCustomer(customer || {});
                                        handleSelectionCustomer(customer);
                                    }}
                                    >
                                    <option value="">{t("orders.select_customer")}</option>
                                    {customers.map(c => (
                                        <option key={c.idCompany} value={c.idCompany}>
                                            {c.comName}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="h-8 ml-4 bg-[color:var(--background)] border rounded-full px-2 justify-start"
                                    value={selectedScheme?.idScheme || ""}
                                    onChange={(e) => {
                                        const scheme = schemes.find(s => s.idScheme === Number(e.target.value));
                                        setSelectedScheme(scheme || {});
                                    }}
                                    >
                                    <option value="">{t("schemes.select_scheme")}</option>
                                    {schemes.map(s => (
                                        <option key={s.idScheme} value={s.idScheme}>
                                            {s.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-between">
                                    <span className="p-2 rounded-lg border">
                                        {selectedCustomer.comName}
                                    </span>
                                    <span className="p-2 rounded-lg border">
                                        {selectedCustomer.vatNumber}
                                    </span>
                            </div>
                            <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                                <div className="flex gap-2">
                                    <input 
                                    type="text"
                                    name="descrip"
                                    value={formData.descrip}
                                    placeholder={t('orders.name')}
                                    onChange={handleChange}
                                    className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                    required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                    type="date"
                                    name="dateOrder"
                                    value={formData.dateOrder}
                                    placeholder={t('orders.date')}
                                    onChange={handleChange}
                                    className="p-2 w-1/3 rounded-lg border bg-[color:var(--background)]"
                                    required
                                    />
                                    <input
                                    type="text"
                                    name="pricePerUnit"
                                    value={formData.pricePerUnit}
                                    placeholder={t('orders.price')}
                                    onChange={handleChange}
                                    className="p-2 w-1/3 rounded-lg border bg-[color:var(--background)]"
                                    required
                                    />
                                    <input
                                    type="text"
                                    name="units"
                                    value={formData.units}
                                    placeholder={t('orders.units')}
                                    onChange={handleChange}
                                    className="p-2 w-1/3 rounded-lg border bg-[color:var(--background)]"
                                    />                                
                                </div>
                                <div className="flex gap-2">
                                    <input
                                    type="text"
                                    name="fieldName"
                                    value={formData.fieldName}
                                    placeholder={t('orders.field')}
                                    onChange={handleChange}
                                    className="p-2 w-2/3 rounded-lg border bg-[color:var(--background)]"
                                    />
                                    <input
                                    type="text"
                                    name="sourceLanguage"
                                    value={formData.sourceLanguage}
                                    placeholder={t('orders.sourceLanguage')}
                                    onChange={handleChange}
                                    className="p-2 w-1/4 rounded-lg border bg-[color:var(--background)]"
                                    />
                                    <input
                                    type="text"
                                    name="targetLanguage"
                                    value={formData.targetLanguage}
                                    placeholder={t('orders.targetLanguage')}
                                    onChange={handleChange}
                                    className="p-2 w-1/4 rounded-lg border bg-[color:var(--background)]"
                                    />
                                </div>
                                <hr className="border-primary"/>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xl font-semibold">{t('orders.items')}</h4>
                                    <span className="p-2 rounded-lg border">
                                        {`${t("orders.total")}: ${formData.total.toFixed(2)}€`}
                                    </span>
                                </div>

                                {/* Existing items */}
                                <div className="mb-4">
                                    {formData.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                                        onDoubleClick={() => handleEditItem(index)}
                                        title="Double click to edit"
                                    >
                                        <label className="w-1/2 py-2">{item.descrip}</label>
                                        <label className="w-1/6 py-2">{item.qty}</label>
                                        <label className="w-1/6 py-2">{item.discount>1 ? `${item.discount}%` : `${item.discount*100}%`}</label>
                                        <label className="w-1/6 py-2">{`${item.total.toFixed(2)}€`}</label>
                                    </div>
                                    ))}
                                </div>

                                {/* Editing existing items : /* Adding new Item */}
                                {editingItemIndex !== null ? (
                                    <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        name="descrip"
                                        value={itemInput.descrip}
                                        onChange={handleItemChange}
                                        onKeyDown={handleAddItem}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    <input
                                        type="text"
                                        name="discount"
                                        value={itemInput.discount}
                                        onChange={handleItemChange}
                                        onKeyDown={handleAddItem}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    <input
                                        type="text"
                                        name="qty"
                                        value={itemInput.qty}
                                        onChange={handleItemChange}
                                        onKeyDown={handleAddItem}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    </div>)
                                    :
                                    (<div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            name="descrip"
                                            value={itemInput.descrip}
                                            onChange={handleItemChange}
                                            placeholder={t("orders.name")}
                                            onKeyDown={handleAddItem}
                                            className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        />
                                        <input
                                            type="text"
                                            name="discount"
                                            value={itemInput.discount}
                                            onChange={handleItemChange}
                                            placeholder={t("orders.discount")}
                                            onKeyDown={handleAddItem}
                                            className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        />
                                        <input
                                            type="text"
                                            name="qty"
                                            value={itemInput.qty}
                                            onChange={handleItemChange}
                                            placeholder={t("orders.quantity")}
                                            onKeyDown={handleAddItem}
                                            className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-lg hover:bg-[color:var(--primary-hover)]"
                                        >
                                        +
                                    </button>
                                    </div>
                                )}
                                {error && (
                                    <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                    {error}
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 mt-4">
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
                                    >
                                    {t('button.save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Card Edit Order */}
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">{t('orders.edit_order')}</h3>
                        <div className="p-6 overflow-y-auto">
                            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                                <div className="flex gap-2">
                                    <input 
                                    type="text"
                                    name="descrip"
                                    value={formData.descrip}
                                    placeholder={t('orders.name')}
                                    onChange={handleChange}
                                    className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                    type="date"
                                    name="dateOrder"
                                    value={formData.dateOrder}
                                    placeholder={t('orders.date')}
                                    onChange={handleChange}
                                    className="p-2 w-1/3 rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    required
                                    />
                                    <input
                                    type="text"
                                    name="pricePerUnit"
                                    value={formData.pricePerUnit}
                                    placeholder={t('orders.price')}
                                    onChange={handleChange}
                                    className="p-2 w-1/3 rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    required
                                    />
                                    <input
                                    type="text"
                                    name="units"
                                    value={formData.units}
                                    placeholder={t('orders.units')}
                                    onChange={handleChange}
                                    className="p-2 w-1/3 rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    />                                
                                </div>
                                <div className="flex gap-2">
                                    <input
                                    type="text"
                                    name="fieldName"
                                    value={formData.fieldName}
                                    placeholder={t('orders.field')}
                                    onChange={handleChange}
                                    className="p-2 w-2/3 rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    />
                                    <input
                                    type="text"
                                    name="sourceLanguage"
                                    value={formData.sourceLanguage}
                                    placeholder={t('orders.sourceLanguage')}
                                    onChange={handleChange}
                                    className="p-2 w-1/4 rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    />
                                    <input
                                    type="text"
                                    name="targetLanguage"
                                    value={formData.targetLanguage}
                                    placeholder={t('orders.targetLanguage')}
                                    onChange={handleChange}
                                    className="p-2 w-1/4 rounded-lg border bg-[color:var(--background)]"
                                    disabled={!(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING")}
                                    />
                                </div>
                                <hr className="border-primary"/>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xl font-semibold">{t('orders.items')}</h4>
                                    <span className="p-2 rounded-lg border">
                                        {`${t("orders.total")}: ${formData.total.toFixed(2)}€`}
                                    </span>
                                </div>

                                {/* Existing lines */}
                                <div className="mb-4">
                                    {formData.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                                        onDoubleClick={() => handleEditItem(index)}
                                        title="Double click to edit"
                                    >
                                        <label className="w-1/2 py-2">{item.descrip}</label>
                                        <label className="w-1/6 py-2">{item.qty}</label>
                                        <label className="w-1/6 py-2">{item.discount>1 ? `${item.discount}%` : `${item.discount*100}%`}</label>
                                        <label className="w-1/6 py-2">{`${item.total.toFixed(2)}€`}</label>
                                    </div>
                                    ))}
                                </div>

                                {/* Editing existing lines */}
                                {editingItemIndex !== null && (
                                    <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        name="descrip"
                                        value={itemInput.descrip}
                                        onChange={handleItemChange}
                                        onKeyDown={handleAddItem}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    <input
                                        type="text"
                                        name="discount"
                                        value={itemInput.discount}
                                        onChange={handleItemChange}
                                        onKeyDown={handleAddItem}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    <input
                                        type="text"
                                        name="qty"
                                        value={itemInput.qty}
                                        onChange={handleItemChange}
                                        onKeyDown={handleAddItem}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    </div>
                                )}

                                {error && (
                                    <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                    {error}
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 mt-4">
                                    {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") ? (
                                    <>
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
                                    >
                                    {t('button.save')}
                                    </button>
                                    </>
                                    ) : (
                                        <button
                                        type="button"
                                        className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                        onClick={handleEditCancel}
                                        >
                                            {t('button.back')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                )}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">{t('orders.confirm_delete')}</h3>
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
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex flex-row">
                    <div className="w-full flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold mb-2 w-1/8">{t('orders.orders_customers')}</h4>
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
                            onClick={addOrder}
                        >
                        <span className="text-lg font-bold">+</span> {t('button.add')}
                        </button>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[color:var(--primary)] mb-4">
                {["all", "pending", "billed"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 -mb-px font-medium ${
                        selectedTab === tab
                        ? "border-b-4 border-[color:var(--primary)] text-[color:var(--text)] font-semibold"
                        : "text-[color:var(--text)]"
                    }`}
                    >
                    {tab === "all" ? t('orders.all') : tab === "pending" ? t('orders.pending') : t('orders.billed')}
                    </button>
                ))}
                </div>

                {/* Table */}
            {sortedOrders.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('orders.no_orders')}
                </div>
                ) : (
                <div className="overflow-auto max-h-80 w-full">
                    <table className="min-w-full divide-y divide-[color:var(--divide)] table-fixed">
                        <thead className="bg-[color:var(--secondary)] sticky top-0 z-10">
                        <tr>
                            <th className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("comName")}>
                            {t('customers.customer')} {sortConfig.key === "comName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("descrip")}>
                            {t('orders.name')} {sortConfig.key === "descrip" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("dateOrder")}>
                            {t('orders.date')} {sortConfig.key === "dateOrder" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium" onClick={() => handleSort("total")}>
                            {t('orders.total')} {sortConfig.key === "total" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                            <th className="w-1/6 py-3 text-center text-[color:var(--text)] font-medium">{/* icon header */}</th>
                            )}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[color:var(--divide)]">
                        {sortedOrders.map(order => (
                            <tr key={order.idOrder} className="cursor-pointer bg-[color:var(--secondary)] text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors">
                            <td className="w-1/3 py-2" onClick={() => handleEditOrder(order)}>{order.comName}</td>
                            <td className="w-1/3 py-2" onClick={() => handleEditOrder(order)}>{order.descrip}</td>
                            <td className="w-1/6 py-2" onClick={() => handleEditOrder(order)}>
                                {new Date(order.dateOrder).toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" })}
                            </td>
                            <td className="w-1/6 py-2" onClick={() => handleEditOrder(order)}>{`${order.total.toFixed(2)}€`}</td>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                                <td className="w-1/6 py-2 text-center">
                                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(order)}>🗑️</button>
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
    );
}

export default OrdersListForCustomers;