import api from "../api/axios";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from "react-router-dom";
import { emailValidator, urlValidator } from "../utils/validator";


function Customers(){

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const searchQuery = searchParams.get("search");
    const [formData, setFormData] = useState({ 
                                        vatNumber:"",
                                        comName: "",
                                        legalName: "",
                                        email: "",
                                        web: "",
                                        contactPersons: [],
                                        phones: [],
                                        addresses: {},
                                        bankAccounts: [],
                                        invoicingMethod: "",
                                        duedate: "",
                                        payMethod: "",
                                        defaultLanguage: "es",
                                        defaultVat: "",
                                        defaultWithholding: "",
                                        europe: true,
                                    });
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState("enabled");
    const [sortConfig, setSortConfig] = useState({ key: "comName", direction: "asc" });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (searchQuery) {
            api.get(`/customers/search?input=${searchQuery}`)
                .then((res) => {
                    setCustomers(res.data);
                })
                .catch(err => console.error(err));
            
        } else {
        api.get("/customers")
            .then((res) => {
                    setCustomers(res.data);
                })
            .catch((err) => {
                console.error("Error fetching customers:", err);
                setError(err.response.data.message || "Error");
            });
        }
        
    }, [searchQuery]);

    const filteredCustomers = customers
                        .filter((c) =>
                          selectedTab === "enabled" ? c.enabled === true : c.enabled === false
                        );

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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

    //Add button
    const addCustomer = () => {
        setShowAddForm(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!formData.legalName || !formData.vatNumber || !formData.email || !formData.addresses.street || !formData.addresses.stNumber || !formData.addresses.cp || !formData.addresses.city || !formData.addresses.country) {
            setError(t('error.all_fields_required'));
            return;
        }
        if(!emailValidator(formData.email)){
            setError(t('error.email_invalid'));
            return;
        }
        if(!urlValidator(formData.web)){
            setError(t('error.url_invalid'));
            return;
        }
        if (isNaN(Number(formData.duedate))) {
            setError(t('error.invalid_duedate'));
            return;
        }
        if (isNaN(Number(formData.defaultVat))) {
            setError(t('error.invalid_default_vat'));
            return;
        }
        if (isNaN(Number(formData.defaultWithholding))) {
            setError(t('error.invalid_default_withholding'));
            return;
        }

        const payload = {
            ...formData,
            addresses: [formData.addresses],  // Addresses must be an array
        };

        try {
            const response = await api.post("/customers", payload);

            setCustomers((prevCustomers) => [...prevCustomers, response.data]);

            setShowAddForm(false);
            setError(t(''));
            setFormData({ vatNumber:"",
                          comName: "",
                          legalName: "",
                          email: "",
                          web: "",
                          contactPersons: [],
                          phones: [],
                          addresses: {},
                          bankAccounts: [],
                          invoicingMethod: "",
                          duedate: "",
                          payMethod: "",
                          defaultLanguage: "es",
                          defaultVat: "",
                          defaultWithholding: "",
                          europe: true, });

        } catch (err) {
            console.error(err);
            setError(err.response.data.message || t('error.saving_customer'));
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setError(t(''));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If field for Address
        if (['street','stNumber','apt','cp','city','state','country'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                addresses: { ...prev.addresses, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    return(
        <div className="flex w-full flex-col items-center gap-5 py-10">
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">{t('customers.add_customer')}</h3>
                        <div className="p-6 overflow-y-auto">
                            <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        name="comName"
                                        placeholder={t('customers.com_name')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                    <input
                                        type="text"
                                        name="legalName"
                                        placeholder={t('customers.legal_name')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        required
                                        />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="vatNumber"
                                        placeholder={t('customers.vat_number')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        required
                                        />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={t('customers.email')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="web"
                                        placeholder={t('customers.web')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                    <select
                                        name="defaultLanguage"
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]">
                                        <option value="es">{t("languages.es")}</option>
                                        <option value="fr">{t("languages.fr")}</option>
                                        <option value="en">{t("languages.en")}</option>
                                    </select>
                                </div>
                                <hr className="border-primary"/>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="street"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.street')}
                                        required />
                                    <input
                                        type="text"
                                        name="stNumber"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.st_number')}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="apt"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.apt')}
                                    />
                                    <input
                                        type="text"
                                        name="cp"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.cp')}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="city"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.city')}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.state')}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="country"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        placeholder={t('register.country')}
                                        required
                                    />
                                </div>
                                <hr className="border-primary"/>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        name="defaultVat"
                                        placeholder={t('customers.default_vat')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                    <input
                                        type="text"
                                        name="invoicingMethod"
                                        placeholder={t('customers.invocing_method')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        required
                                        />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="defaultWithholding"
                                        placeholder={t('customers.default_withholding')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        required
                                        />
                                    <input
                                        type="text"
                                        name="payMethod"
                                        placeholder={t('customers.pay_method')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="duedate"
                                        placeholder={t('customers.duedate')}
                                        onChange={handleChange}
                                        className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                        />
                                    <label className="w-1/2">
                                    {t('customers.europe')}
                                    <input
                                        type="checkbox"
                                        name="europe"
                                        onChange={handleChange}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                        defaultChecked  
                                        />
                                    </label>
                                </div>
                               
                                {error && (
                                    <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                        {error}
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                    type="button"
                                    className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                    onClick={handleCancelAdd}
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
            {/* List */}
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex flex-row">
                    <div className="w-full flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold mb-2 w-1/2">{t('customers.customers')}</h4>
                        {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") &&
                        <button
                            className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                            onClick={addCustomer}
                        >
                        <span className="text-lg font-bold">+</span> {t('button.add')}
                        </button>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[color:var(--primary)] mb-4">
                {["enabled", "disabled"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 -mb-px font-medium ${
                        selectedTab === tab
                        ? "border-b-4 border-[color:var(--primary)] text-[color:var(--text)] font-semibold"
                        : "text-[color:var(--text)]"
                    }`}
                    >
                    {tab === "enabled" ? t('users.enabled') : t('users.disabled')}
                    </button>
                ))}
                </div>

                {/* Table */}
                {sortedCustomers.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('customers.no_customers')}
                </div>
                ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-[color:var(--divide)]">
                    <thead>
                        <tr>
                        <th 
                            className="w-1/4 py-3 text-left text-[color:var(--text)] font-medium"
                            onClick={() => handleSort("comName")}>
                            {t('customers.com_name')} {sortConfig.key === "comName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th 
                            className="w-1/8 py-3 text-left text-[color:var(--text)] font-medium"
                            onClick={() => handleSort("vatNumber")}>
                            {t('customers.vat_number')} {sortConfig.key === "vatNumber" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th 
                            className="w-1/4 py-3 text-left text-[color:var(--text)] font-medium"
                            onClick={() => handleSort("email")}>
                            {t('customers.email')} {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th 
                            className="w-1/4 py-3 text-left text-[color:var(--text)] font-medium"
                            onClick={() => handleSort("web")}>
                            {t('customers.web')} {sortConfig.key === "web" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y [color:var(--divide)]">
                        {sortedCustomers.map((customer) => (
                        <tr
                            key={customer.idCustomer}
                            className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                            onClick={() => navigate(`/dashboard/customers/${customer.idCompany}`)}
                        >
                            <td className="w-1/6 py-2">{customer.comName}</td>
                            <td className=" w-1/6 py-2">{customer.vatNumber}</td>
                            <td className="w-1/4 py-2">{customer.email}</td>
                            <td className="w-1/4 py-2">{customer.web}</td>
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

export default Customers;