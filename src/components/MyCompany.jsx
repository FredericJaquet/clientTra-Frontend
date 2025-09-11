import api from "../api/axios";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { emailValidator, urlValidator } from "../utils/validator";
import Addresses from "./Addresses";
import Phones from "./Phones";
import BankAccounts from "./BankAccounts";
import CompanyLogo from "./CompanyLogo";

function MyCompany(){

    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
                                        idCompany:"",
                                        vatNumber: "",
                                        comName: "",
                                        legalName: "",
                                        email: "",
                                        web: "",
                                        phones: "",
                                        addresses: "",
                                        bankAccounts: "",
                                        users: "",
                                        logoPath: "" });
    const [company, setCompany] = useState({});
    const [error, setError] = useState("");
    const [isDemo, setIsDemo] = useState(true);
    const [selectedTab, setSelectedTab] = useState("addresses");

    useEffect(() => {
        api.get("/owner")
        .then((response) => {
            setCompany(response.data);
            setFormData({
                idCompany: response.data.idCompany,
                vatNumber: response.data.vatNumber,
                comName: response.data.comName,
                legalName: response.data.legalName,
                email: response.data.email,
                web: response.data.web,
                phones: response.data.phones,
                addresses: response.data.addresses,
                bankAccounts: response.data.bankAccounts,
                users: response.data.users,
                logoPath: response.data.logoPath
            });
            console.log(response.data);
        })
        .catch((err) => console.error("Error fetching My Company:", err));
    }, []);

    useEffect(() => {
        api.get("/context")
        .then((response) => {
            setIsDemo(response.data.isDemo);
        });
    }, []);

    const handleEdit = () => {
        if (company) {
        setIsEditing(!isEditing);
        setError("");
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if(!emailValidator(formData.email)){
            setError(t('error.email_invalid'));
            return;
        }
        if(!urlValidator(formData.web)){
            setError(t('error.url_invalid'));
            return;
        }
        try {
            const response = await api.patch("/owner", formData);
            setCompany(response.data);
            setIsEditing(false);
            setError("");
        } catch (err) {
            console.error(err);
        }
    }

    const renderTab = () => {
        switch (selectedTab) {
            case "addresses":
                return (
                    <Addresses
                    addresses={company.addresses}
                    idCompany={company.idCompany}
                    onAddressChange={handleAddressChange}
                    />
                );
            case "phones":
                return (
                    <Phones
                    phones={company.phones}
                    idCompany={company.idCompany}
                    onPhonesChange={handlePhonesChange}
                    />
                );
            case "bank_accounts":
                return (
                <BankAccounts
                    bankAccounts={company.bankAccounts}
                    idCompany={company.idCompany}
                    onAccountsChange={handleBankAccountsChange}
                    />
                );
            case "logo":
                return (
                <CompanyLogo
                    logoPath={company.logoPath}
                    onLogoChange={handleLogoChange}
                    />
                );
            default:
                return null;
        }
    };

    const handleAddressChange = (newAddress) => {
        setCompany(prev => ({ ...prev, addresses: [newAddress] }));
        setFormData(prev => ({ ...prev, addresses: [newAddress] }));
    };

    const handlePhonesChange = (newPhones) => {
        setCompany(prev => ({ ...prev, phones: newPhones }));
        setFormData(prev => ({ ...prev, phones: newPhones }));
    };

    const handleBankAccountsChange = (newAccounts) => {
        setCompany(prev => ({ ...prev, bankAccounts: newAccounts }));
        setFormData(prev => ({ ...prev, bankAccounts: newAccounts }));
    };

    const handleLogoChange = (newLogoPath) => {
        setCompany(prev => ({ ...prev, logoPath: newLogoPath }));
        setFormData(prev => ({ ...prev, logoPath: newLogoPath }));
    };

    return(
        <div className="flex w-full flex-col items-center gap-5 py-10">
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="flex justify-between p-2">
                    <h4 className="text-lg font-semibold ">{t('dashboard.my_company')}</h4>
                    {!isEditing ?
                        role === "ROLE_ADMIN" && (
                        <button
                            onClick={handleEdit}
                            disabled={isDemo} 
                            title={isDemo ? t('error.edit_disabled') : ""}
                            className={`px-4 py-2 rounded-xl 
                                        ${isDemo 
                                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                            : "bg-[color:var(--primary)] text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)]"
                                        }`}
                        >
                            {t('button.edit')}
                        </button> )
                    :
                    <div className="flex gap-2">
                        <button
                        onClick={handleSave}
                        className=" px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                        >
                        {t('button.save')}
                        </button>
                        <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                        >
                            {t('button.cancel')}
                        </button>
                    </div>
                    }
                </div>
                <hr className="border-[color:var(--primary)] mb-2" />
                <div className="grid grid-cols-[1fr_2fr_1fr_2fr] sd:grid-cols-2 gap-4">
                    <label className="mr-2 font-semibold">{t('register.com_name')}:</label>
                    {!isEditing ? 
                        <label className="mr-2">{company.comName}</label>
                        :
                        <input
                        type="text"
                        name="comName"
                        value={formData.comName}
                        onChange={handleChange}
                        className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                        />
                    }
                    <label className="mr-2 font-semibold">{t('register.legal_name')}:</label>
                    {!isEditing ? 
                        <label className="mr-2">{company.legalName}</label>
                        :
                        <input
                        type="text"
                        name="legalName"
                        value={formData.legalName}
                        onChange={handleChange}
                        className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                        />
                    }
                    <label className="mr-2 font-semibold">{t('register.cif')}:</label>
                    {!isEditing ? 
                        <label className="mr-2">{company.vatNumber}</label>
                        :
                        <input
                        type="text"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleChange}
                        className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                        />
                    }
                    <label className="mr-2 font-semibold">{t('register.email')}:</label>
                    {!isEditing ? 
                        <label className="mr-2">{company.email}</label>
                        :
                        <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                        />
                    }
                    <label className="mr-2 font-semibold">{t('register.web')}:</label>
                    {!isEditing ? 
                        <a 
                            href={company.web?.startsWith("http") ? company.web : `https://${company.web}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mr-2 text-[color:var(--info)]"
                        >{company.web}</a>
                        :
                        <input
                        type="text"
                        name="web"
                        value={formData.web}
                        onChange={handleChange}
                        className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                        />
                    }
                    
                </div>
                {error && (
                    <div className=" my-2 text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                        {error}
                    </div>
                )}
                <div className="flex border-b border-[color:var(--primary)] mt-4 mb-4">
                    {["addresses", "phones", "bank_accounts", "logo"].map((tab) => (
                        <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 -mb-px font-medium ${
                            selectedTab === tab
                            ? "border-b-4 border-[color:var(--primary)] text-[color:var(--text)] font-semibold"
                            : "text-[color:var(--text)]"
                        }`}
                        >
                            {tab === "addresses" ? t('companies.addresses') : tab === "phones" ? t('companies.phones') : tab === "bank_accounts" ? t('companies.bank_accounts') : "Logo" }
                        </button>
                    ))}
                </div>
                {renderTab()}
            </div>
            
        </div>
    )
}

export default MyCompany;