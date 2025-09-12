import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import Addresses from "./Addresses";
import Phones from "./Phones";
import BankAccounts from "./BankAccounts";

function CustomerDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/customers/${id}`)
        .then(res => setCustomer(res.data))
        .catch(err => {
            console.error(err);
            setError(err.response.data.message);
        });
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm(t("customers.confirm_delete"))) {
        try {
            await api.delete(`/customers/${id}`);
            navigate("/customers"); // vuelve a la lista
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
        }
    };

    const handleSave = async () => {
        try {
        const res = await api.put(`/customers/${id}`, customer);
        setCustomer(res.data);
        setIsEditing(false);
        } catch (err) {
        setError(err.response.data.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    if (!customer) {
        return <div>{t("dashboard.loading")}...</div>;
    }

    return (
        <div className="w-3/4 mx-auto p-6 bg-[color:var(--secondary)] rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
            {t("customers.detail")}: {customer.comName}
        </h2>

        {error && <div className="bg-[color:var(--error)] text-white p-2 rounded mb-4">{error}</div>}

        {/* General info */}
        <div className="flex gap-4 mb-4">
            <input
            type="text"
            name="comName"
            value={customer.comName || ""}
            disabled={!isEditing}
            onChange={handleChange}
            className="p-2 border rounded w-1/2"
            />
            <input
            type="text"
            name="legalName"
            value={customer.legalName || ""}
            disabled={!isEditing}
            onChange={handleChange}
            className="p-2 border rounded w-1/2"
            />
        </div>

        {/* Subcomponents */}
        <Addresses
            addresses={customer.addresses || []}
            isEditing={isEditing}
            onChange={(addresses) => setCustomer(prev => ({ ...prev, addresses }))}
        />

        <Phones
            phones={customer.phones || []}
            isEditing={isEditing}
            onChange={(phones) => setCustomer(prev => ({ ...prev, phones }))}
        />

        <BankAccounts
            bankAccounts={customer.bankAccounts || []}
            isEditing={isEditing}
            onChange={(bankAccounts) => setCustomer(prev => ({ ...prev, bankAccounts }))}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
            {!isEditing ? (
            <>
                <button
                onClick={() => setIsEditing(true)}
                className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                >
                {t("button.edit")}
                </button>
                <button
                onClick={handleDelete}
                className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                >
                {t("button.delete")}
                </button>
            </>
            ) : (
            <>
                <button
                onClick={handleSave}
                className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                >
                {t("button.save")}
                </button>
                <button
                onClick={() => setIsEditing(false)}
                className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                >
                {t("button.cancel")}
                </button>
            </>
            )}
        </div>
        </div>
    );
}

export default CustomerDetails;
