import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import Addresses from "./Addresses";
import Phones from "./Phones";
import BankAccounts from "./BankAccounts";
import ContactPersons from "./ContactPersons";
import Schemes from "./Schemes";


//TODO Afinar la creación y edición de esquemas (Al presionar Enter en la descripción de una linea por ejemplo)
function ProviderDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [provider, setProvider] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTab, setSelectedTab] = useState("addresses");
    const [formData, setFormData] = useState({ 
                                        vatNumber: "",
                                        comName: "",
                                        legalName: "",
                                        email: "",
                                        web: "",
                                        duedate: "",
                                        defaultLanguage: "",
                                        defaultVat: "",
                                        defaultWithholding: "",
                                        europe: "",
                                        enabled: "",                                    
                                    });

    const lanToLanguage = {
        "es": t("languages.es"),
        "fr": t("languages.fr"),
        "en": t("languages.en"),
    };

    useEffect(() => {
        api.get(`/providers/${id}`)
        .then((response) => {
            setProvider(response.data);
            setFormData({ 
                            vatNumber: response.data.vatNumber,
                            comName: response.data.comName,
                            legalName: response.data.legalName,
                            email: response.data.email,
                            web: response.data.web,
                            duedate: response.data.duedate,
                            defaultLanguage: response.data.defaultLanguage,
                            defaultVat: (Number.parseFloat(response.data.defaultVat)*100).toFixed(2),
                            defaultWithholding: (Number.parseFloat(response.data.defaultWithholding)*100).toFixed(2),
                            europe: response.data.europe,
                            enabled: response.data.enabled,
                        });

            console.log(response.data);
        })
        .catch(err => {
            console.error(err);
            setError(err.response.data.message || "Error");
        });
    }, [id]);

    const handleEdit = () => {
        if (provider) {
            setIsEditing(!isEditing);
            setError("");
        }
    };

    const handleDelete = async () => {
        if (!provider) return;

        try {
            await api.delete(`/providers/${id}`);

            navigate(`/dashboard/providers`);

            setShowDeleteConfirm(false);
            setProvider(null);
        } catch (err) {
            console.error(err);
            setError(err.response.data.message || t('error.deleting_provider'));
        }
    };

    const handleSave = async () => {
        try {
            const response = await api.patch(`/providers/${id}`, formData);
            setProvider(response.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.response.data.message || t('error.editing_provider'));
        }
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };


    if (!provider) {
        return <div>{t("dashboard.loading")}...</div>;
    }

    const renderTab = () => {
        switch (selectedTab) {
            case "addresses":
                return (
                    <Addresses
                    addresses={provider.addresses}
                    idCompany={provider.idCompany}
                    onAddressChange={(newAddress) => setProvider(prev => ({ ...prev, addresses: [newAddress] }))}
                    />
                );
            case "phones":
                return (
                    <Phones
                    phones={provider.phones}
                    idCompany={provider.idCompany}
                    onPhonesChange={(newPhone) => setProvider(prev => ({ ...prev, phones: newPhone }))}
                    />
                );
            case "bank_accounts":
                return (
                <BankAccounts
                    bankAccounts={provider.bankAccounts}
                    idCompany={provider.idCompany}
                    onAccountsChange={(newAccount) => setProvider(prev => ({ ...prev, bankAccounts: newAccount }))}
                    />
                );
            case "contact_persons":
                return (
                <ContactPersons
                    contacts={provider.contactPersons}
                    idCompany={provider.idCompany}
                    onContactsChange={(newContact) => setProvider(prev => ({ ...prev, contactPersons: newContact }))}
                />
                );
            case "schemes":
                return (
                <Schemes
                    schemes={provider.schemes}
                    idCompany={provider.idCompany}
                    onSchemesChange={(newScheme) => setProvider(prev => ({ ...prev, schemes: newScheme }))}
                />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex w-full flex-col items-center gap-5 py-10">
        <div className="w-3/4 mx-auto p-6 bg-[color:var(--secondary)] rounded-xl shadow-lg">
            <div className="flex justify-between">
                <h4 className="text-xl font-semibold mb-4">
                    {t("providers.detail")}: {provider.comName}
                </h4>
                {/* Buttons */}
                {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                    !isEditing ? (
                        <div className="flex gap-2">
                            <>
                                <button
                                onClick={handleEdit}
                                className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                >
                                {t("button.edit")}
                                </button>
                                <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                >
                                {t("button.delete")}
                                </button>
                            </>
                        </div>
                        ) : (
                        <div className="flex gap-2">
                            <button
                            onClick={handleSave}
                            className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                            >
                            {t("button.save")}
                            </button>
                            <button
                            onClick={() => {setIsEditing(false); setError("")}}
                            className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                            >
                            {t("button.cancel")}
                            </button>
                        </div>
                    )
                )}
            </div>
            {/* Delete confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">{t('providers.confirm_delete')}</h3>
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)]"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="bg-[color:var(--error)] text-white p-2 rounded mb-4">{error}</div>}

            {/* Provider Detail */}
            <div className="flex mb-4">
                <label className="font-semibold w-1/6">{t("providers.com_name")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.comName}</label>
                    :
                    <input
                    type="text"
                    name="comName"
                    value={formData.comName}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
                <label className="font-semibold w-1/6">{t("providers.legal_name")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.legalName}</label>
                    :
                    <input
                    type="text"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
            </div>
            <div className="flex mb-4">
                <label className="font-semibold w-1/6">{t("providers.vat_number")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.vatNumber}</label>
                    :
                    <input
                    type="text"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
                <label className="font-semibold w-1/6">{t("providers.language")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{lanToLanguage[provider.defaultLanguage]}</label>
                    :
                    <select
                        name="defaultLanguage"
                        onChange={handleChange}
                        value={formData.defaultLanguage}
                        className="mr-2 w-1/3 rounded-lg border bg-[color:var(--background)]">
                        <option value="es">{t("languages.es")}</option>
                        <option value="fr">{t("languages.fr")}</option>
                        <option value="en">{t("languages.en")}</option>
                    </select>
                }
            </div>
            <div className="flex mb-4">
                <label className="font-semibold w-1/6">{t("providers.email")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.email}</label>
                    :
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
                <label className="font-semibold w-1/6">{t("providers.web")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.web}</label>
                    :
                    <input
                    type="text"
                    name="web"
                    value={formData.web}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
            </div>
            <div className="flex mb-4">
                <label className="font-semibold w-1/6">{t("providers.vat")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{(provider.defaultVat*100).toFixed(2)}%</label>
                    :
                    <input
                    type="text"
                    name="defaultVat"
                    value={formData.defaultVat}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
                <label className="font-semibold w-1/6">{t("providers.withholding")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{(provider.defaultWithholding*100).toFixed(2)}%</label>
                    :
                    <input
                    type="text"
                    name="defaultWithholding"
                    value={formData.defaultWithholding}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }
            </div>
            <div className="flex mb-4">
                <label className="font-semibold w-1/6">{t("providers.duedate")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.duedate}</label>
                    :
                    <input
                    type="text"
                    name="duedate"
                    value={formData.duedate}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border w-1/3"
                    />
                }

                <div className="mr-2 w-1/2"></div>
            </div>
            <div className="flex mb-4">
                <label className="font-semibold w-1/6">{t("providers.europe")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.europe ? t("providers.yes") : t("providers.no")}</label>
                    :
                    <div className="flex items-center mr-2 w-1/3">
                    <input
                        type="checkbox"
                        name="europe"
                        checked={formData.europe}
                        onChange={handleChange}
                        className="w-4 h-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    />
                    </div>
                }
                <label className="font-semibold w-1/6">{t("providers.enabled")}</label>
                {!isEditing ? 
                    <label className="mr-2 w-1/3">{provider.enabled ? t("providers.yes") : t("providers.no")}</label>
                    :
                    <div className="flex items-center mr-2 w-1/3">
                    <input
                        type="checkbox"
                        name="enabled"
                        checked={formData.enabled}
                        onChange={handleChange}
                        className="w-4 h-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    />
                    </div>
                }
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-[color:var(--primary)] mt-4 mb-4">
                {["addresses", "phones", "contact_persons", "bank_accounts", "schemes"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 -mb-px font-medium ${
                                selectedTab === tab
                                ? "border-b-4 border-[color:var(--primary)] text-[color:var(--text)] font-semibold"
                                : "text-[color:var(--text)]"
                            }`}
                    >
                        {tab === "addresses" ? t('companies.addresses') : tab === "phones" ? t('companies.phones') : tab === "bank_accounts" ? t('companies.bank_accounts') : tab === "contact_persons" ? t("providers.contacts") : t("providers.schemes") }
                    </button>
                ))}
            </div>
            {renderTab()}
            
        </div>
        </div>
    );
}

export default ProviderDetails;
